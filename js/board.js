import { appData, defaultTokenPositions } from './data.js';
import { escapeHtml } from './utils.js';
import { uploadMediaFiles, renderMediaPreviewGrid, openMediaViewModal } from './media.js';
import { saveKey } from './firebase-service.js';

export let currentCourtView = 'half'; // 'half' or 'full'
let isBoardInitialized = false;
let currentTokenPositionsState = [];
let currentRoutesState = [];
let isDrawMode = false;
let isEraseMode = false;
let activeDrawRoute = null;
let activeDragToken = null;

let currentDrawTool = 'arrow'; // 'arrow' or 'line'
let currentDrawColor = '#08541c';

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

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const d = points.map((p, i) => {
      const sx = (p.x * vbW) / 100;
      const sy = (p.y * vbH) / 100;
      return `${i === 0 ? 'M' : 'L'} ${sx} ${sy}`;
    }).join(' ');

    if (!isPreview) {
      const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hitPath.setAttribute('d', d);
      hitPath.setAttribute('fill', 'none');
      hitPath.setAttribute('stroke', 'transparent');
      hitPath.setAttribute('stroke-width', '24');
      hitPath.style.cursor = isEraseMode ? 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMEg3TDMgMTZDMi40IDE1LjQgMi40IDE0LjYgMyAxNEwxMyA0QzEzLjYgMy40IDE0LjQgMy40IDE1IDRMMjAgOUMyMC42IDkuNiAyMC42IDEwLjQgMjAgMTFMMTEgMjBIMjBaIi8+PGxpbmUgeDE9IjE4IiB5MT0iMTMiIHgyPSIxMSIgeTI9IjIwIi8+PC9zdmc+"), crosshair' : 'default';
      hitPath.setAttribute('pointer-events', isEraseMode ? 'stroke' : 'none');
      
      hitPath.addEventListener('click', (e) => {
        if (!isEraseMode) return;
        e.stopPropagation();
        const idx = currentRoutesState.indexOf(route);
        if (idx !== -1) {
          currentRoutesState.splice(idx, 1);
          renderRoutes();
        }
      });
      group.appendChild(hitPath);
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    
    const strokeColor = route.color || '#08541c';
    const toolType = route.tool || 'arrow';
    
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    if (toolType === 'arrow') {
      path.setAttribute('marker-end', `url(#arrowhead-${strokeColor})`);
    }
    path.setAttribute('pointer-events', 'none');
    if (isPreview) {
      path.setAttribute('opacity', '0.6');
    }
    group.appendChild(path);
    container.appendChild(group);
  };

  currentRoutesState.forEach(route => drawPath(route, false));
  if (activeDrawRoute) {
    drawPath(activeDrawRoute, true);
  }
}

function setupDragAndDrop() {
  const container = document.getElementById('court-board-container');

  const getRelativePos = (e, rect) => {
    // touchend 시점에는 e.touches가 빈 배열이므로 e.changedTouches를 폴백으로 사용
    const touch = e.type.startsWith('touch')
      ? (e.touches.length > 0 ? e.touches[0] : e.changedTouches[0])
      : null;
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
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
    
    if (isEraseMode) return;
    
    if (isDrawMode) {
      const rect = container.getBoundingClientRect();
      const pos = getRelativePos(e, rect);
      activeDrawRoute = { 
        points: [pos],
        tool: currentDrawTool,
        color: currentDrawColor
      };
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
      if (Math.sqrt(dx * dx + dy * dy) > 2.5) {
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

    activeDragToken.style.left = `${xPercent.toFixed(2)}%`;
    activeDragToken.style.top = `${yPercent.toFixed(2)}%`;

    const tokenId = activeDragToken.dataset.id;
    const tokenObj = currentTokenPositionsState.find(t => t.id === tokenId);
    if (tokenObj) {
      tokenObj.x = parseFloat(xPercent.toFixed(2));
      tokenObj.y = parseFloat(yPercent.toFixed(2));
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
    isEraseMode = false;
    document.getElementById('mode-move').classList.add('active');
    document.getElementById('mode-draw').classList.remove('active');
    document.getElementById('mode-erase').classList.remove('active');
    document.getElementById('tactics-board-container').classList.remove('draw-mode');
    const drawToolbar = document.getElementById('draw-toolbar');
    if (drawToolbar) drawToolbar.style.display = 'none';
    renderRoutes();
  });

  document.getElementById('mode-draw').addEventListener('click', () => {
    isDrawMode = true;
    isEraseMode = false;
    document.getElementById('mode-draw').classList.add('active');
    document.getElementById('mode-move').classList.remove('active');
    document.getElementById('mode-erase').classList.remove('active');
    document.getElementById('tactics-board-container').classList.add('draw-mode');
    const drawToolbar = document.getElementById('draw-toolbar');
    if (drawToolbar) drawToolbar.style.display = 'block';
    renderRoutes();
  });

  document.getElementById('mode-erase').addEventListener('click', () => {
    isDrawMode = false;
    isEraseMode = true;
    document.getElementById('mode-erase').classList.add('active');
    document.getElementById('mode-move').classList.remove('active');
    document.getElementById('mode-draw').classList.remove('active');
    document.getElementById('tactics-board-container').classList.remove('draw-mode');
    const drawToolbar = document.getElementById('draw-toolbar');
    if (drawToolbar) drawToolbar.style.display = 'none';
    renderRoutes();
  });

  // Draw Tool Selection
  const btnToolArrow = document.getElementById('tool-arrow');
  const btnToolLine = document.getElementById('tool-line');
  if (btnToolArrow && btnToolLine) {
    btnToolArrow.addEventListener('click', () => {
      currentDrawTool = 'arrow';
      btnToolArrow.classList.add('active');
      btnToolLine.classList.remove('active');
    });
    btnToolLine.addEventListener('click', () => {
      currentDrawTool = 'line';
      btnToolLine.classList.add('active');
      btnToolArrow.classList.remove('active');
    });
  }

  // Color Palette Selection
  const colorBtns = document.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedColor = e.target.dataset.color;
      if (selectedColor) {
        currentDrawColor = selectedColor;
        colorBtns.forEach(cb => cb.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
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
        // 클램핑 없이 순수 배수 변환 → 역변환(/2)으로 완전히 복원 가능
        // (풀코트 오른쪽 토큰은 하프코트에서 화면 밖이지만 데이터는 보존됨)
        token.x = parseFloat((token.x * 2).toFixed(2));
      });
    }
    if (currentRoutesState.length > 0) {
      currentRoutesState.forEach(route => {
        if (route.points) {
          route.points.forEach(p => { p.x = parseFloat((p.x * 2).toFixed(2)); });
        } else if (route.startX !== undefined) {
          route.startX = parseFloat((route.startX * 2).toFixed(2));
          route.endX = parseFloat((route.endX * 2).toFixed(2));
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
        token.x = parseFloat((token.x / 2).toFixed(2));
      });
    }
    if (currentRoutesState.length > 0) {
      currentRoutesState.forEach(route => {
        if (route.points) {
          route.points.forEach(p => { p.x = parseFloat((p.x / 2).toFixed(2)); });
        } else if (route.startX !== undefined) {
          route.startX = parseFloat((route.startX / 2).toFixed(2));
          route.endX = parseFloat((route.endX / 2).toFixed(2));
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

  const showFormBtn = document.getElementById('btn-show-tactic-form');
  if (showFormBtn) {
    showFormBtn.addEventListener('click', () => {
      // Clear previous selection and form inputs
      resetTacticsSelection();
      // Clear board state
      resetTokenPositions();
      currentRoutesState.length = 0;
      renderRoutes();

      // Show the form for a new tactic
      document.getElementById('tactic-input-form').style.display = 'block';
      showFormBtn.style.display = 'none';
    });
  }

  const hideFormBtn = document.getElementById('btn-hide-tactic-form');
  if (hideFormBtn) {
    hideFormBtn.addEventListener('click', () => {
      document.getElementById('tactic-input-form').style.display = 'none';
      if (showFormBtn) showFormBtn.style.display = 'flex';
      resetTacticsSelection();
    });
  }
}

function renderBoardTacticNotes(tactic) {
  const container = document.getElementById('tactic-board-notes-container');
  const titleEl = document.getElementById('tactic-board-notes-title');
  const descEl = document.getElementById('tactic-board-notes-desc');
  if (!container || !titleEl || !descEl) return;

  if (!tactic) {
    container.style.display = 'none';
    descEl.innerText = '';
    return;
  }

  titleEl.innerText = tactic.title || '전술';
  const desc = (tactic.desc || '').trim();
  if (desc) {
    descEl.innerText = desc;
    descEl.classList.remove('is-empty');
  } else {
    descEl.innerText = '작성된 설명 및 지시사항이 없습니다.';
    descEl.classList.add('is-empty');
  }
  container.style.display = 'block';
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
  const tacticForm = document.getElementById('tactic-input-form');
  if (tacticForm) tacticForm.style.display = 'none';
  const showFormBtn = document.getElementById('btn-show-tactic-form');
  if (showFormBtn) showFormBtn.style.display = 'flex';

  currentEditingTacticId = null;
  tempTacticMedia.length = 0; // mutate array to clear it
  renderMediaPreviewGrid('tactic-media-preview', tempTacticMedia, 'removeTempTacticMedia');
  renderBoardTacticMedia(null);
  renderBoardTacticNotes(null);

  const mediaInput = document.getElementById('tactic-media-input');
  if (mediaInput) mediaInput.value = '';

  const titleInput = document.getElementById('tactic-title');
  const descInput = document.getElementById('tactic-desc');
  const saveBtn = document.getElementById('btn-save-tactic');
  const cancelBtn = document.getElementById('btn-cancel-tactic-edit');
  if (titleInput) titleInput.value = '';
  if (descInput) descInput.value = '';
  const linksContainer = document.getElementById('tactic-links-container');
  if (linksContainer) {
    linksContainer.innerHTML = `
      <div class="link-input-row" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
        <input type="url" class="tactic-link-input" placeholder="예: https://youtube.com/watch?v=..." style="flex: 1; min-width: 0;">
        <button type="button" class="btn btn-outline" onclick="addTacticLinkInput(this)" style="flex-shrink: 0; width: 44px; padding: 0; display: flex; align-items: center; justify-content: center;" title="링크 추가">+</button>
      </div>
    `;
  }
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

    return `
      <div class="tactic-item-card ${isActive ? 'active' : ''}" onclick="loadTacticToForm('${t.id}')">
        <div class="tactic-item-info" style="flex:1;">
          <h4>${escapeHtml(t.title)} ${isActive ? '<span style="font-size:0.7rem; color:var(--color-primary); font-weight:normal;">(선택됨)</span>' : ''}</h4>
          <p style="max-width: 100%; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(t.desc)}</p>
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
  const linkInputs = document.querySelectorAll('.tactic-link-input');

  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const links = Array.from(linkInputs).map(inp => inp.value.trim()).filter(val => val);

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

  // currentEditingTacticId가 있을 때만 수정, 없으면 항상 신규 추가
  // (제목 기반 매칭은 동명 전술을 의도치 않게 덮어쓸 수 있어 제거)
  const existingIndex = currentEditingTacticId
    ? appData.tactics.findIndex(t => t.id === currentEditingTacticId)
    : -1;

  if (existingIndex !== -1) {
    appData.tactics[existingIndex].title = title;
    appData.tactics[existingIndex].desc = desc;
    appData.tactics[existingIndex].links = links;
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
      links,
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
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const tacticForm = document.getElementById('tactic-input-form');
  if (tacticForm) tacticForm.style.display = 'block';
  const showFormBtn = document.getElementById('btn-show-tactic-form');
  if (showFormBtn) showFormBtn.style.display = 'none';

  if (currentEditingTacticId === id) {
    // If it's already selected, just return (the form is already shown now)
    return;
  }

  const tactic = appData.tactics.find(t => t.id === id);
  if (!tactic) return;

  currentEditingTacticId = id;
  document.getElementById('tactic-title').value = tactic.title;
  document.getElementById('tactic-desc').value = tactic.desc;
  
  const linksContainer = document.getElementById('tactic-links-container');
  if (linksContainer) {
    linksContainer.innerHTML = '';
    let tacticLinks = tactic.links || [];
    if (tactic.link && tacticLinks.length === 0) {
      tacticLinks = [tactic.link];
    }
    
    if (tacticLinks.length > 0) {
      tacticLinks.forEach((l) => {
        const row = document.createElement('div');
        row.className = 'link-input-row';
        row.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.5rem;';
        row.innerHTML = `
          <a href="${escapeHtml(l)}" target="_blank" class="tactic-link-btn" style="flex: 1; min-width: 0; box-sizing: border-box; display: block; background-color: var(--color-bg); border: 1.5px solid var(--color-border-strong); border-radius: 10px; padding: 0.75rem 1rem; color: var(--color-primary); font-size: 0.95rem; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(l)}">
            🔗 ${escapeHtml(l)}
          </a>
          <input type="hidden" class="tactic-link-input" value="${escapeHtml(l)}">
          <button type="button" class="btn btn-outline" onclick="removeTacticLinkInput(this)" style="flex-shrink: 0; width: 44px; padding: 0; display: flex; align-items: center; justify-content: center;" title="링크 삭제">-</button>
        `;
        linksContainer.appendChild(row);
      });
    }
    
    const emptyRow = document.createElement('div');
    emptyRow.className = 'link-input-row';
    emptyRow.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.5rem;';
    emptyRow.innerHTML = `
      <input type="url" class="tactic-link-input" placeholder="예: https://youtube.com/watch?v=..." style="flex: 1; min-width: 0;">
      <button type="button" class="btn btn-outline" onclick="addTacticLinkInput(this)" style="flex-shrink: 0; width: 44px; padding: 0; display: flex; align-items: center; justify-content: center;" title="링크 추가">+</button>
    `;
    linksContainer.appendChild(emptyRow);
  }
  document.getElementById('btn-save-tactic').innerText = '전술 업데이트';

  tempTacticMedia.length = 0;
  if (tactic.media) {
    tempTacticMedia.push(...JSON.parse(JSON.stringify(tactic.media)));
  }
  renderMediaPreviewGrid('tactic-media-preview', tempTacticMedia, 'removeTempTacticMedia');
  renderBoardTacticMedia(tactic);
  renderBoardTacticNotes(tactic);

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

export function addTacticLinkInput(btn) {
  const row = btn.closest('.link-input-row');
  const input = row.querySelector('input');
  const val = input.value.trim();
  
  if (!val) {
    alert('링크 주소를 먼저 입력해주세요.');
    input.focus();
    return;
  }
  
  row.innerHTML = `
    <a href="${escapeHtml(val)}" target="_blank" class="tactic-link-btn" style="flex: 1; min-width: 0; box-sizing: border-box; display: block; background-color: var(--color-bg); border: 1.5px solid var(--color-border-strong); border-radius: 10px; padding: 0.75rem 1rem; color: var(--color-primary); font-size: 0.95rem; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(val)}">
      🔗 ${escapeHtml(val)}
    </a>
    <input type="hidden" class="tactic-link-input" value="${escapeHtml(val)}">
    <button type="button" class="btn btn-outline" onclick="removeTacticLinkInput(this)" style="flex-shrink: 0; width: 44px; padding: 0; display: flex; align-items: center; justify-content: center;" title="링크 삭제">-</button>
  `;

  const container = document.getElementById('tactic-links-container');
  if (!container) return;
  const newRow = document.createElement('div');
  newRow.className = 'link-input-row';
  newRow.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.5rem;';
  newRow.innerHTML = `
    <input type="url" class="tactic-link-input" placeholder="예: https://youtube.com/watch?v=..." style="flex: 1; min-width: 0;">
    <button type="button" class="btn btn-outline" onclick="addTacticLinkInput(this)" style="flex-shrink: 0; width: 44px; padding: 0; display: flex; align-items: center; justify-content: center;" title="링크 추가">+</button>
  `;
  container.appendChild(newRow);
}

export function removeTacticLinkInput(btn) {
  const row = btn.closest('.link-input-row');
  if (row) row.remove();
}
