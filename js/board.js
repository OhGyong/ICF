import { appData, defaultTokenPositions } from './data.js';
import { escapeHtml } from './utils.js';
import { uploadMediaFiles, renderMediaPreviewGrid, openMediaViewModal } from './media.js';
import { saveKey } from './firebase-service.js';

export let currentCourtView = 'half'; // 'half' or 'full'
let isBoardInitialized = false;
let currentTokenPositionsState = [];
let currentRoutesState = [];
let isDrawMode = false;
let activeDrawRoute = null;
let activeDragToken = null;

export let currentEditingTacticId = null;
export const tempTacticMedia = [];

export function initTacticsBoard() {
  const courtContainer = document.getElementById('court-board-container');

  // Set ViewBox based on View settings (half vs full)
  const courtSvg = document.getElementById('court-svg');
  const courtWrapper = document.getElementById('court-wrapper');
  if (currentCourtView === 'half') {
    courtSvg.setAttribute('viewBox', '0 0 400 500');
    courtContainer.classList.remove('full-court');
    courtWrapper.classList.remove('full-court');
    courtWrapper.classList.add('half-court');
  } else {
    courtSvg.setAttribute('viewBox', '0 0 800 500');
    courtContainer.classList.add('full-court');
    courtWrapper.classList.remove('half-court');
    courtWrapper.classList.add('full-court');
  }

  // Populate tokens if state is empty
  if (currentTokenPositionsState.length === 0) {
    resetTokenPositions();
  } else {
    renderTokens();
  }

  renderRoutes();

  if (!isBoardInitialized) {
    setupDragAndDrop();
    setupBoardEventListeners();
    isBoardInitialized = true;
  }
}

export function resetTokenPositions() {
  currentTokenPositionsState = JSON.parse(JSON.stringify(defaultTokenPositions[currentCourtView]));
  renderTokens();
}

function renderTokens() {
  const tokensOverlay = document.getElementById('tokens-overlay');
  tokensOverlay.innerHTML = '';

  currentTokenPositionsState.forEach(token => {
    const el = document.createElement('div');
    el.id = token.id;
    el.className = `board-token token-${token.type}`;
    el.style.left = `${token.x}%`;
    el.style.top = `${token.y}%`;
    el.innerText = token.label;

    if (token.type === 'offense') {
      el.title = `공격 ${token.label} (${token.role})`;
    } else if (token.type === 'defense') {
      el.title = `수비 ${token.label} (${token.role})`;
    } else {
      el.title = '농구공';
    }

    el.dataset.id = token.id;
    tokensOverlay.appendChild(el);
  });
}

function renderRoutes() {
  const container = document.getElementById('routes-container');
  if (!container) return;
  container.innerHTML = '';

  const isHalf = currentCourtView === 'half';
  const vbW = isHalf ? 400 : 800;
  const vbH = 500;

  const routesSvg = document.getElementById('routes-svg');
  if (routesSvg) {
    routesSvg.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
    routesSvg.setAttribute('preserveAspectRatio', 'none');
  }

  const drawPath = (route, isPreview) => {
    let points = route.points;
    if (!points && route.startX !== undefined) {
      points = [{ x: route.startX, y: route.startY }, { x: route.endX, y: route.endY }];
    }

    if (!points || points.length < 2) return;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = points.map((p, i) => {
      const sx = (p.x * vbW) / 100;
      const sy = (p.y * vbH) / 100;
      return `${i === 0 ? 'M' : 'L'} ${sx} ${sy}`;
    }).join(' ');

    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#08541c');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    if (isPreview) {
      path.setAttribute('opacity', '0.6');
    }
    container.appendChild(path);
  };

  currentRoutesState.forEach(route => drawPath(route, false));
  if (activeDrawRoute) {
    drawPath(activeDrawRoute, true);
  }
}

function setupDragAndDrop() {
  const container = document.getElementById('court-board-container');

  const getRelativePos = (e, rect) => {
    let clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    let clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    const isPortrait = document.getElementById('court-wrapper').classList.contains('portrait-mode');
    let xPercent, yPercent;
    if (isPortrait) {
      xPercent = 100 - ((clientY - rect.top) / rect.height) * 100;
      yPercent = ((clientX - rect.left) / rect.width) * 100;
    } else {
      xPercent = ((clientX - rect.left) / rect.width) * 100;
      yPercent = ((clientY - rect.top) / rect.height) * 100;
    }
    return {
      x: Math.max(0, Math.min(100, xPercent)),
      y: Math.max(0, Math.min(100, yPercent))
    };
  };

  const startDrag = (e) => {
    e.preventDefault();
    const target = e.target;
    
    if (isDrawMode) {
      const rect = container.getBoundingClientRect();
      const pos = getRelativePos(e, rect);
      activeDrawRoute = { points: [pos] };
      renderRoutes();
      return;
    }

    if (target.classList.contains('board-token')) {
      activeDragToken = target;
    }
  };

  const moveDrag = (e) => {
    if (activeDrawRoute && isDrawMode) {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const pos = getRelativePos(e, rect);
      const lastPos = activeDrawRoute.points[activeDrawRoute.points.length - 1];
      const dx = pos.x - lastPos.x;
      const dy = pos.y - lastPos.y;
      if (Math.sqrt(dx * dx + dy * dy) > 0.5) {
        activeDrawRoute.points.push(pos);
        renderRoutes();
      }
      return;
    }

    if (!activeDragToken) return;

    const rect = container.getBoundingClientRect();
    const pos = getRelativePos(e, rect);

    let xPercent = Math.max(2, Math.min(98, pos.x));
    let yPercent = Math.max(2, Math.min(98, pos.y));

    activeDragToken.style.left = `${xPercent}%`;
    activeDragToken.style.top = `${yPercent}%`;

    const tokenId = activeDragToken.dataset.id;
    const tokenObj = currentTokenPositionsState.find(t => t.id === tokenId);
    if (tokenObj) {
      tokenObj.x = Math.round(xPercent);
      tokenObj.y = Math.round(yPercent);
    }
  };

  const endDrag = (e) => {
    if (activeDrawRoute && isDrawMode) {
      if (activeDrawRoute.points.length > 2) {
        currentRoutesState.push({ ...activeDrawRoute });
      }
      activeDrawRoute = null;
      renderRoutes();
      return;
    }
    activeDragToken = null;
  };

  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);

  container.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('touchmove', moveDrag, { passive: false });
  window.addEventListener('touchend', endDrag);
}

function setupBoardEventListeners() {
  document.getElementById('mode-move').addEventListener('click', () => {
    isDrawMode = false;
    document.getElementById('mode-move').classList.add('active');
    document.getElementById('mode-draw').classList.remove('active');
    document.getElementById('tactics-board-container').classList.remove('draw-mode');
  });

  document.getElementById('mode-draw').addEventListener('click', () => {
    isDrawMode = true;
    document.getElementById('mode-draw').classList.add('active');
    document.getElementById('mode-move').classList.remove('active');
    document.getElementById('tactics-board-container').classList.add('draw-mode');
  });

  document.getElementById('btn-reset-routes').addEventListener('click', () => {
    currentRoutesState = [];
    renderRoutes();
  });

  document.getElementById('court-half').addEventListener('click', (e) => {
    if (currentCourtView === 'half') return;
    document.getElementById('court-half').classList.add('active');
    document.getElementById('court-full').classList.remove('active');
    currentCourtView = 'half';
    if (currentTokenPositionsState.length > 0) {
      currentTokenPositionsState.forEach(token => {
        token.x = Math.min(98, Math.max(2, Math.round(token.x * 2)));
      });
    }
    if (currentRoutesState.length > 0) {
      currentRoutesState.forEach(route => {
        if (route.points) {
          route.points.forEach(p => { p.x = p.x * 2; });
        } else if (route.startX !== undefined) {
          route.startX *= 2;
          route.endX *= 2;
        }
      });
    }
    initTacticsBoard();
  });

  document.getElementById('court-full').addEventListener('click', (e) => {
    if (currentCourtView === 'full') return;
    document.getElementById('court-full').classList.add('active');
    document.getElementById('court-half').classList.remove('active');
    currentCourtView = 'full';
    if (currentTokenPositionsState.length > 0) {
      currentTokenPositionsState.forEach(token => {
        token.x = Math.round(token.x / 2);
      });
    }
    if (currentRoutesState.length > 0) {
      currentRoutesState.forEach(route => {
        if (route.points) {
          route.points.forEach(p => { p.x = p.x / 2; });
        } else if (route.startX !== undefined) {
          route.startX /= 2;
          route.endX /= 2;
        }
      });
    }
    initTacticsBoard();
  });

  document.getElementById('btn-reset-board-tokens').addEventListener('click', resetTokenPositions);

  document.getElementById('btn-toggle-rotation').addEventListener('click', (e) => {
    const wrapper = document.getElementById('court-wrapper');
    wrapper.classList.toggle('portrait-mode');
    if (wrapper.classList.contains('portrait-mode')) {
      e.target.innerText = '가로 보기 전환';
    } else {
      e.target.innerText = '세로 보기 전환';
    }
  });

  document.getElementById('btn-save-tactic').addEventListener('click', handleSaveTactic);
  const cancelTacticBtn = document.getElementById('btn-cancel-tactic-edit');
  if (cancelTacticBtn) {
    cancelTacticBtn.addEventListener('click', resetTacticsSelection);
  }
}

function renderBoardTacticMedia(tactic) {
  const container = document.getElementById('tactic-board-media-container');
  const grid = document.getElementById('tactic-large-media-grid');
  const title = document.getElementById('tactic-board-media-title');
  if (!container || !grid) return;

  if (!tactic || !tactic.media || tactic.media.length === 0) {
    container.style.display = 'none';
    grid.innerHTML = '';
    return;
  }

  if (title) title.innerText = `📺 '${tactic.title}' 참고`;
  const globalTacticIdx = appData.tactics.findIndex(t => t.id === tactic.id);

  grid.innerHTML = tactic.media.map((m, idx) => {
    const src = escapeHtml(m.previewUrl || m.url || m.dataUrl);
    return `
    <div class="tactic-large-media-card" onclick="openMediaViewModal(appData.tactics[${globalTacticIdx}].media[${idx}])">
      ${m.type === 'video'
        ? `<video src="${src}"></video><div class="large-video-badge">▶</div>`
        : `<img src="${src}">`}
    </div>
    `;
  }).join('');

  container.style.display = 'block';
}

export function resetTacticsSelection() {
  currentEditingTacticId = null;
  tempTacticMedia.length = 0; // mutate array to clear it
  renderMediaPreviewGrid('tactic-media-preview', tempTacticMedia, 'removeTempTacticMedia');
  renderBoardTacticMedia(null);

  const mediaInput = document.getElementById('tactic-media-input');
  if (mediaInput) mediaInput.value = '';

  const titleInput = document.getElementById('tactic-title');
  const descInput = document.getElementById('tactic-desc');
  const saveBtn = document.getElementById('btn-save-tactic');
  const cancelBtn = document.getElementById('btn-cancel-tactic-edit');
  if (titleInput) titleInput.value = '';
  if (descInput) descInput.value = '';
  if (saveBtn) saveBtn.innerText = '전술 저장';
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (document.getElementById('saved-tactics-list')) {
    renderTacticsList();
  }
}

export function renderTacticsList() {
  const tacticsList = document.getElementById('saved-tactics-list');
  if (!tacticsList) return;
  if (appData.tactics.length === 0) {
    tacticsList.innerHTML = `<p class="text-muted text-center text-sm py-4">등록된 전술이 없습니다.</p>`;
    return;
  }

  tacticsList.innerHTML = appData.tactics.map((t, tIndex) => {
    const isActive = t.id === currentEditingTacticId;
    const mediaGalleryHtml = (t.media && t.media.length > 0) ? `
      <div class="card-media-gallery" onclick="event.stopPropagation();">
        ${t.media.map((m, mIdx) => {
      const src = escapeHtml(m.previewUrl || m.url || m.dataUrl);
      return `
          <div class="card-media-item" onclick="openMediaViewModal(appData.tactics[${tIndex}].media[${mIdx}])">
            ${m.type === 'video' ? `<video src="${src}"></video><div class="video-badge">▶</div>` : `<img src="${src}">`}
          </div>
          `;
    }).join('')}
      </div>
    ` : '';

    return `
      <div class="tactic-item-card ${isActive ? 'active' : ''}" onclick="loadTacticToForm('${t.id}')">
        <div class="tactic-item-info" style="flex:1;">
          <h4>${escapeHtml(t.title)} ${isActive ? '<span style="font-size:0.7rem; color:var(--color-primary); font-weight:normal;">(선택됨)</span>' : ''}</h4>
          <p style="max-width: 100%; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(t.desc)}</p>
          ${mediaGalleryHtml}
        </div>
        <button class="game-btn-icon delete-btn" onclick="deleteTactic(event, '${t.id}')" title="삭제" style="width: 28px; height: 28px; flex-shrink: 0; align-self: flex-start; margin-left: 0.5rem;">
          &times;
        </button>
      </div>
    `;
  }).join('');
}

async function handleSaveTactic() {
  const titleInput = document.getElementById('tactic-title');
  const descInput = document.getElementById('tactic-desc');

  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) {
    alert('전술 이름을 입력해주세요.');
    return;
  }

  if (currentTokenPositionsState.length === 0) {
    resetTokenPositions();
  }

  const saveBtn = document.getElementById('btn-save-tactic');
  const originalBtnText = saveBtn.innerText;
  saveBtn.innerText = '업로드 중...';
  saveBtn.disabled = true;
  document.body.style.cursor = 'wait';

  let finalMedia = [];
  try {
    finalMedia = await uploadMediaFiles(tempTacticMedia, 'tactics');
  } catch (e) {
    console.error(e);
  } finally {
    saveBtn.innerText = originalBtnText;
    saveBtn.disabled = false;
    document.body.style.cursor = 'default';
  }

  let existingIndex = -1;
  if (currentEditingTacticId) {
    existingIndex = appData.tactics.findIndex(t => t.id === currentEditingTacticId);
  }
  if (existingIndex === -1) {
    existingIndex = appData.tactics.findIndex(t => t.title.toLowerCase() === title.toLowerCase());
  }

  if (existingIndex !== -1) {
    appData.tactics[existingIndex].title = title;
    appData.tactics[existingIndex].desc = desc;
    appData.tactics[existingIndex].courtView = currentCourtView;
    appData.tactics[existingIndex].tokens = JSON.parse(JSON.stringify(currentTokenPositionsState));
    appData.tactics[existingIndex].routes = JSON.parse(JSON.stringify(currentRoutesState));
    appData.tactics[existingIndex].media = finalMedia;
    alert(`'${title}' 전술 정보와 토큰 위치가 업데이트되었습니다.`);
  } else {
    const newTactic = {
      id: 't_' + Date.now(),
      title,
      desc,
      courtView: currentCourtView,
      tokens: JSON.parse(JSON.stringify(currentTokenPositionsState)),
      routes: JSON.parse(JSON.stringify(currentRoutesState)),
      media: finalMedia
    };
    appData.tactics.push(newTactic);
    alert(`'${title}' 새로운 전술이 저장되었습니다.`);
  }

  saveKey('tactics');
  resetTacticsSelection();
}

export function loadTacticToForm(id) {
  if (currentEditingTacticId === id) {
    resetTacticsSelection();
    return;
  }

  const tactic = appData.tactics.find(t => t.id === id);
  if (!tactic) return;

  currentEditingTacticId = id;
  document.getElementById('tactic-title').value = tactic.title;
  document.getElementById('tactic-desc').value = tactic.desc;
  document.getElementById('btn-save-tactic').innerText = '전술 업데이트';

  tempTacticMedia.length = 0;
  if (tactic.media) {
    tempTacticMedia.push(...JSON.parse(JSON.stringify(tactic.media)));
  }
  renderMediaPreviewGrid('tactic-media-preview', tempTacticMedia, 'removeTempTacticMedia');
  renderBoardTacticMedia(tactic);

  const cancelBtn = document.getElementById('btn-cancel-tactic-edit');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';

  if (tactic.courtView && tactic.tokens) {
    currentCourtView = tactic.courtView;
    if (currentCourtView === 'half') {
      document.getElementById('court-half').classList.add('active');
      document.getElementById('court-full').classList.remove('active');
    } else {
      document.getElementById('court-full').classList.add('active');
      document.getElementById('court-half').classList.remove('active');
    }
    currentTokenPositionsState = JSON.parse(JSON.stringify(tactic.tokens));
    currentRoutesState = tactic.routes ? JSON.parse(JSON.stringify(tactic.routes)) : [];
    initTacticsBoard();
  }

  renderTacticsList();
}

export function deleteTactic(event, id) {
  event.stopPropagation();
  if (confirm('이 전술을 리스트에서 삭제하시겠습니까?')) {
    if (currentEditingTacticId === id) {
      resetTacticsSelection();
    }
    const idx = appData.tactics.findIndex(t => t.id === id);
    if (idx !== -1) appData.tactics.splice(idx, 1);
    saveKey('tactics');
    renderTacticsList();
  }
}

export function removeTempTacticMedia(index) {
  tempTacticMedia.splice(index, 1);
  renderMediaPreviewGrid('tactic-media-preview', tempTacticMedia, 'removeTempTacticMedia');
}
