import { appData } from './data.js';
import { escapeHtml } from './utils.js';
import { saveKey } from './firebase-service.js';
import { initTacticsBoard, renderTacticsList, resetTacticsSelection, loadTacticToForm } from './board.js';
import { uploadMediaFiles, renderMediaPreviewGrid, openMediaViewModal } from './media.js';

export const tempSkillMedia = [];
export const tempRosterMedia = [];

// ================= NAVIGATION SYSTEM =================
const pageTitles = {
  dashboard: { title: '대시보드', subtitle: 'ICF 농구 대회 준비 및 활동 요약' },
  schedule: { title: '대회 일정 관리', subtitle: '다가오는 경기 시간, 장소 및 결과 기록' },
  tactics: { title: '전술', subtitle: '포지션 배치와 상세 공격/수비 작전 수립' },
  skills: { title: '스킬', subtitle: '농구 스킬관련 정리' },
  rules: { title: '경기 규칙', subtitle: '기본적인 농구 규정과 대회용 로컬 룰 요약' },
  roster: { title: '팀 로스터', subtitle: '목록 및 주요 포지션 관리' }
};

export function switchTab(tabId) {
  if (tabId !== 'tactics') {
    resetTacticsSelection();
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === tabId) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  if (pageTitles[tabId]) {
    document.getElementById('page-title').innerText = pageTitles[tabId].title;
    document.getElementById('page-subtitle').innerText = pageTitles[tabId].subtitle;
  }

  renderTabContent(tabId);
}

function renderTabContent(tabId) {
  switch (tabId) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'schedule':
      renderScheduleList();
      break;
    case 'tactics':
      initTacticsBoard();
      renderTacticsList();
      break;
    case 'skills':
      renderSkillsList();
      break;
    case 'rules':
      renderLocalRules();
      break;
    case 'roster':
      renderRosterList();
      break;
  }
}

export function refreshActiveTab() {
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab) renderTabContent(activeTab.id);
  updateHeroCountdown();
}

// ================= DASHBOARD RENDERER =================
function renderDashboard() {
  const totalRoster = appData.roster.length;
  const statRosterCount = document.getElementById('stat-roster-count');
  if (statRosterCount) statRosterCount.innerText = totalRoster;

  const now = new Date();
  const upcomingGames = appData.schedule.filter(game => {
    const gameDate = new Date(game.date);
    gameDate.setHours(23, 59, 59, 999);
    return !game.finished && gameDate >= now;
  });

  const statUpcoming = document.getElementById('stat-upcoming-games');
  const statTotal = document.getElementById('stat-total-games');
  if (statUpcoming) statUpcoming.innerText = upcomingGames.length;
  if (statTotal) statTotal.innerText = appData.schedule.length;

  updateHeroCountdown();

  const panelGamesContainer = document.getElementById('dashboard-schedule-list');
  if (panelGamesContainer) {
    if (upcomingGames.length === 0) {
      panelGamesContainer.innerHTML = `
        <div class="empty-state">
          <p>예정된 경기가 없습니다.</p>
          <button class="btn btn-secondary btn-sm margin-top-md" onclick="switchTab('schedule')">경기 등록하러 가기</button>
        </div>
      `;
    } else {
      const sortedUpcoming = [...upcomingGames].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      panelGamesContainer.innerHTML = sortedUpcoming.map(game => {
        const gDate = new Date(game.date);
        const gDateMidnight = new Date(game.date);
        gDateMidnight.setHours(0, 0, 0, 0);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `
          <div class="game-card" style="margin-bottom: 0.75rem;">
            <div class="game-meta">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <div class="game-date-box" style="padding: 0.35rem 0.5rem; min-width: 65px; width: fit-content;">
                  <div class="game-month" style="font-size: 0.65rem;">${gDate.getMonth() + 1}월</div>
                  <div class="game-day" style="font-size: 1.15rem;">${gDate.getDate()}(${days[gDate.getDay()]})</div>
                </div>
                <span class="badge badge-accent">D-${Math.ceil((gDateMidnight - today) / (1000 * 60 * 60 * 24))}</span>
              </div>
              <div class="game-details-info">
                <span class="font-bold text-sm">${escapeHtml(game.opponent)}</span>
                <span class="game-venue-time" style="font-size: 0.75rem;">
                  🏀 ${escapeHtml(game.location)} | ⏰ ${escapeHtml(game.time)}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const panelTacticsContainer = document.getElementById('dashboard-tactics-list');
  if (panelTacticsContainer) {
    if (appData.tactics.length === 0) {
      panelTacticsContainer.innerHTML = `
        <div class="empty-state">
          <p>등록된 전술이 없습니다.</p>
          <button class="btn btn-secondary btn-sm margin-top-md" onclick="switchTab('tactics')">전술보드 짜기</button>
        </div>
      `;
    } else {
      const recentTactics = [...appData.tactics].reverse().slice(0, 3);
      panelTacticsContainer.innerHTML = recentTactics.map(tactic => `
        <div class="tactic-item-card" onclick="switchTab('tactics'); loadTacticToForm('${tactic.id}');" style="margin-bottom: 0.5rem; padding: 0.6rem 0.85rem;">
          <div class="tactic-item-info">
            <h4 style="font-size: 0.85rem;">${escapeHtml(tactic.title)}</h4>
            <p style="font-size: 0.75rem; max-width: 250px;">${escapeHtml(tactic.desc)}</p>
          </div>
          <span class="btn-text" style="font-size: 0.75rem; white-space: nowrap; flex-shrink: 0;">전술보드 &rarr;</span>
        </div>
      `).join('');
    }
  }
}

export function updateHeroCountdown() {
  const countdownTimer = document.getElementById('countdown-timer');
  const heroTitle = document.getElementById('dashboard-hero-title');
  const heroSubtitle = document.getElementById('dashboard-hero-subtitle');
  const sidebarDDay = document.getElementById('sidebar-dday');

  if (!countdownTimer || !heroTitle || !heroSubtitle) return;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingGames = appData.schedule.filter(game => {
    const gameDate = new Date(game.date);
    gameDate.setHours(23, 59, 59, 999);
    return !game.finished && gameDate >= now;
  });

  if (upcomingGames.length === 0) {
    countdownTimer.innerText = "D-?";
    heroTitle.innerHTML = `등록된 다가오는 <span class="text-highlight">경기 일정이 없습니다.</span>`;
    heroSubtitle.innerText = '대회나 연습경기가 있다면 경기 일정을 추가하여 카운트다운을 가동하세요!';
    if (sidebarDDay) sidebarDDay.innerText = '-';
  } else {
    const nextGame = [...upcomingGames].sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const gameDate = new Date(nextGame.date);
    gameDate.setHours(0, 0, 0, 0);

    const diffTime = gameDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      countdownTimer.innerText = "D-Day";
      heroTitle.innerHTML = `오늘 바로 <span class="text-highlight">${escapeHtml(nextGame.opponent)}</span>이 있습니다!`;
      heroSubtitle.innerText = `장소: ${nextGame.location} | 시간: ${nextGame.time} | 참가자: ${nextGame.participants || '미정'}`;
      if (sidebarDDay) sidebarDDay.innerText = 'Day';
    } else {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      countdownTimer.innerText = `D-${diffDays}`;
      heroTitle.innerHTML = `다음 경기 <span class="text-highlight">${escapeHtml(nextGame.opponent)}</span>까지 <span class="text-highlight">${escapeHtml(countdownTimer.innerText)}</span> 남았습니다!`;
      heroSubtitle.innerText = `장소: ${nextGame.location} | 일시: ${nextGame.date}(${days[gameDate.getDay()]}) ${nextGame.time} | 참가자: ${nextGame.participants || '미정'}`;
      if (sidebarDDay) sidebarDDay.innerText = `-${diffDays}`;
    }
  }
}

// ================= SCHEDULE TAB CONTROL =================
let activeScheduleFilter = 'all';

export function renderScheduleList() {
  const container = document.getElementById('schedule-list-container');
  if (!container) return;
  let filteredList = [...appData.schedule];

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (activeScheduleFilter === 'upcoming') {
    filteredList = filteredList.filter(game => !game.finished);
  } else if (activeScheduleFilter === 'finished') {
    filteredList = filteredList.filter(game => game.finished);
  }

  filteredList.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filteredList.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 3rem 1rem;">
        <p class="text-muted">조건에 맞는 경기 일정이 존재하지 않습니다.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredList.map(game => {
    const gDate = new Date(game.date);
    const monthStr = `${gDate.getMonth() + 1}월`;
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayStr = `${gDate.getDate()}(${days[gDate.getDay()]})`;

    let statusBadgeHtml = '';

    if (game.finished) {
      const isWin = game.ourScore > game.oppScore;
      const isDraw = game.ourScore === game.oppScore;

      let badgeClass = 'badge-danger';
      let badgeText = 'LOSE';
      if (isWin) {
        badgeClass = 'badge-success';
        badgeText = 'WIN';
      } else if (isDraw) {
        badgeClass = 'badge-cyan';
        badgeText = '종료';
      }

      statusBadgeHtml = `<span class="badge ${badgeClass}">${badgeText}</span>`;
    } else {
      statusBadgeHtml = `<span class="badge badge-accent">예정</span>`;
    }

    const participantsList = game.participants ? game.participants.split(',').map(p => p.trim()).filter(p => p).sort((a, b) => a.localeCompare(b, 'ko')) : [];
    const participantsCount = participantsList.length;
    const participantsHtml = participantsCount > 0 && game.participants !== '참가자 미정'
      ? `<div style="display: flex; align-items: flex-start; gap: 0.35rem; margin-top: 0.5rem; color: var(--color-primary);"><svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top: 0.15rem; flex-shrink: 0;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg><div style="flex: 1; font-size: 0.85rem; line-height: 1.4;"><strong class="font-bold">${participantsCount}명</strong> 참가<div style="color: var(--color-text-secondary); font-size: 0.8rem; margin-top: 0.1rem;">${escapeHtml(participantsList.join(', '))}</div></div></div>`
      : `<div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 0.5rem; color: var(--color-text-muted); font-size: 0.85rem;"><svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>참가자 미정</div>`;

    let locationName = game.location;
    let locationAddress = "";
    let mapQuery = game.location;

    const locMatch = game.location.match(/^(.*?)\s*\((.*?)\)$/);
    if (locMatch) {
      locationName = locMatch[1].trim();
      locationAddress = locMatch[2].trim();
      mapQuery = locationAddress;
    }

    const locationHtml = locationAddress
      ? `<div style="display: flex; flex-direction: column; line-height: 1.3;"><span>${escapeHtml(locationName)}</span><span style="font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 0.1rem;">${escapeHtml(locationAddress)}</span></div>`
      : `<span>${escapeHtml(locationName)}</span>`;

    return `
      <div class="game-card">
        <div class="game-meta">
          <div class="game-date-box">
            <div class="game-month">${monthStr}</div>
            <div class="game-day">${dayStr}</div>
          </div>
          <div class="game-details-info">
            <h3 class="game-opponent">${escapeHtml(game.opponent)}</h3>
            <a href="https://map.naver.com/v5/search/${encodeURIComponent(mapQuery)}" target="_blank" class="game-venue-time" style="text-decoration: none; align-items: flex-start;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'" title="네이버 지도로 보기">
              <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="${locationAddress ? 'margin-top: 0.1rem;' : ''}">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${locationHtml}
            </a>
            <span class="game-venue-time" style="margin-top: 0.1rem;">
              <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${escapeHtml(game.time)}
            </span>
            ${participantsHtml}
          </div>
        </div>
        
        <div class="game-score-display">
          <div style="display: flex; flex-direction: row; align-items: center; gap: 0.75rem; margin-left: auto;">
            ${statusBadgeHtml}
            <div class="game-actions">
              <button class="game-btn-icon" onclick="openEditScheduleModal('${game.id}')" title="수정">
                <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="game-btn-icon delete-btn" onclick="deleteSchedule('${game.id}')" title="삭제">
                <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function openEditScheduleModal(id) {
  const game = appData.schedule.find(s => s.id === id);
  if (!game) return;

  document.getElementById('schedule-modal-title').innerText = '경기 일정 수정';
  document.getElementById('form-schedule-id').value = game.id;
  document.getElementById('form-schedule-opponent').value = game.opponent;
  document.getElementById('form-schedule-date').value = game.date;

  if (game.time && game.time.includes('~')) {
    const [start, end] = game.time.split('~');
    document.getElementById('form-schedule-time-start').value = start.trim();
    document.getElementById('form-schedule-time-end').value = end.trim();
  } else {
    document.getElementById('form-schedule-time-start').value = game.time || '';
    document.getElementById('form-schedule-time-end').value = '';
  }

  document.getElementById('form-schedule-location').value = game.location;
  document.getElementById('form-schedule-participants').value = game.participants || '';

  const finishedCheckbox = document.getElementById('form-schedule-finished');
  const scoreInputsContainer = document.getElementById('score-inputs-container');
  finishedCheckbox.checked = game.finished;
  if (game.finished) {
    scoreInputsContainer.style.display = 'grid';
    document.getElementById('form-schedule-our-score').value = game.ourScore;
    document.getElementById('form-schedule-opp-score').value = game.oppScore;
  } else {
    scoreInputsContainer.style.display = 'none';
    document.getElementById('form-schedule-our-score').value = '';
    document.getElementById('form-schedule-opp-score').value = '';
  }

  document.getElementById('schedule-modal').classList.add('active');
}

export function deleteSchedule(id) {
  if (confirm('이 경기 일정을 정말 삭제하시겠습니까?')) {
    const idx = appData.schedule.findIndex(s => s.id === id);
    if (idx !== -1) appData.schedule.splice(idx, 1);
    saveKey('schedule');
    renderScheduleList();
    updateHeroCountdown();
  }
}

// ================= SKILLS CHECKLIST CONTROL =================
export function renderSkillsList() {
  const container = document.getElementById('skills-list-container');
  if (!container) return;

  const categories = {};
  appData.skills.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  container.innerHTML = Object.keys(categories).map(catName => {
    const skillsHtml = categories[catName].map(skill => {
      const globalSkillIdx = appData.skills.findIndex(s => s.id === skill.id);
      const mediaGalleryHtml = (skill.media && skill.media.length > 0) ? `
        <div class="card-media-gallery" style="margin-top: 0.5rem;">
          ${skill.media.map((m, mIdx) => {
        const src = escapeHtml(m.previewUrl || m.url || m.dataUrl);
        return `
            <div class="card-media-item" onclick="openMediaViewModal(appData.skills[${globalSkillIdx}].media[${mIdx}])">
              ${m.type === 'video' ? `<video src="${src}"></video><div class="video-badge">▶</div>` : `<img src="${src}">`}
            </div>
            `;
      }).join('')}
        </div>
      ` : '';

      return `
        <div class="skill-item" style="flex-direction: column; align-items: stretch; gap: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div class="skill-details">
              <span class="skill-name">${escapeHtml(skill.name)}</span>
              <span class="skill-desc">${escapeHtml(skill.desc || '')}</span>
            </div>
            <div class="skill-item-actions">
              <button class="game-btn-icon skill-edit-btn" onclick="editSkill('${skill.id}')" title="항목 수정">
                <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="game-btn-icon delete-btn skill-delete-btn" onclick="deleteSkill('${skill.id}')" title="항목 삭제">
                <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          ${mediaGalleryHtml}
        </div>
      `;
    }).join('');

    return `
      <div class="skill-category-card">
        <div class="skill-category-header">
          <span class="skill-category-title">🏀 ${escapeHtml(catName)}</span>
        </div>
        <div class="skill-items-container">
          ${skillsHtml}
        </div>
      </div>
    `;
  }).join('');
}

export function deleteSkill(id) {
  if (confirm('이 스킬 항목을 삭제하시겠습니까?')) {
    const idx = appData.skills.findIndex(s => s.id === id);
    if (idx !== -1) appData.skills.splice(idx, 1);
    saveKey('skills');
    renderSkillsList();
  }
}

export function editSkill(id) {
  const skill = appData.skills.find(s => s.id === id);
  if (!skill) return;

  document.getElementById('skill-modal-title').innerText = '스킬 항목 수정';
  document.getElementById('form-skill-id').value = skill.id;
  document.getElementById('form-skill-category').value = skill.category;
  document.getElementById('form-skill-name').value = skill.name;
  document.getElementById('form-skill-desc').value = skill.desc || '';

  tempSkillMedia.length = 0;
  if (skill.media) {
    tempSkillMedia.push(...JSON.parse(JSON.stringify(skill.media)));
  }
  renderMediaPreviewGrid('skill-media-preview', tempSkillMedia, 'removeTempSkillMedia');

  document.getElementById('skill-modal').classList.add('active');
}

export function removeTempSkillMedia(index) {
  tempSkillMedia.splice(index, 1);
  renderMediaPreviewGrid('skill-media-preview', tempSkillMedia, 'removeTempSkillMedia');
}

// ================= LOCAL TOURNAMENT RULES =================
export function renderLocalRules() {
  const container = document.getElementById('local-rules-container');
  if (!container) return;
  if (appData.rules.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 2rem 1rem;">
        <p class="text-muted">등록된 로컬 규칙이 없습니다.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = appData.rules.map(rule => `
    <div class="local-rule-item">
      <div class="local-rule-info">
        <h4>📌 ${escapeHtml(rule.title)}</h4>
        <p>${escapeHtml(rule.desc)}</p>
      </div>
      <button class="game-btn-icon delete-btn" onclick="deleteLocalRule('${rule.id}')" title="삭제" style="width: 32px; height: 32px;">
        &times;
      </button>
    </div>
  `).join('');
}

export function deleteLocalRule(id) {
  if (confirm('이 규칙을 리스트에서 삭제하시겠습니까?')) {
    const idx = appData.rules.findIndex(r => r.id === id);
    if (idx !== -1) appData.rules.splice(idx, 1);
    saveKey('rules');
    renderLocalRules();
  }
}

// ================= TEAM ROSTER CONTROL =================
export function renderRosterList() {
  const container = document.getElementById('roster-grid-container');
  const lineupsContainer = document.getElementById('quarter-lineups-container');

  if (lineupsContainer) {
    if (!appData.lineups || appData.lineups.length === 0) {
      lineupsContainer.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1;">등록된 쿼터별 라인업이 없습니다.</p>';
    } else {
      lineupsContainer.innerHTML = appData.lineups.map(lineup => `
        <div class="card" style="padding: 1rem; border: 1px solid var(--border-color); box-shadow: none; background: rgba(255, 255, 255, 0.03);">
          <h4 style="margin-bottom: 0.5rem; color: var(--color-primary);">${escapeHtml(lineup.quarter)}</h4>
          <p style="font-size: 0.85rem; line-height: 1.4; color: var(--color-text-secondary);">${escapeHtml(lineup.players)}</p>
        </div>
      `).join('');
    }
  }

  if (!container) return;
  if (appData.roster.length === 0) {
    container.innerHTML = `
      <div class="card text-center span-all-cols" style="padding: 3rem 1rem;">
        <p class="text-muted">팀원이 등록되지 않았습니다.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = appData.roster.map((player, pIdx) => {
    const firstImg = player.media && player.media.find(m => m.type === 'image');
    const avatarSrc = firstImg ? (firstImg.previewUrl || firstImg.url || firstImg.dataUrl) : '';
    const avatarHtml = firstImg
      ? `<div class="roster-avatar-container" onclick="openMediaViewModal(appData.roster[${pIdx}].media[0])" style="cursor:pointer;"><img src="${escapeHtml(avatarSrc)}" class="roster-avatar-img"></div>`
      : `<div class="roster-avatar">🏀</div>`;

    const mediaGalleryHtml = (player.media && player.media.length > 0) ? `
      <div class="card-media-gallery" style="margin-top: 0.5rem; justify-content: center;">
        ${player.media.map((m, mIdx) => {
      const src = escapeHtml(m.previewUrl || m.url || m.dataUrl);
      return `
          <div class="card-media-item" style="width:40px; height:40px;" onclick="openMediaViewModal(appData.roster[${pIdx}].media[${mIdx}])">
            ${m.type === 'video' ? `<video src="${src}"></video><div class="video-badge" style="width:16px; height:16px; font-size:8px;">▶</div>` : `<img src="${src}">`}
          </div>
          `;
    }).join('')}
      </div>
    ` : '';

    return `
      <div class="roster-card" style="display:flex; flex-direction:column; align-items:center;">
        <div class="roster-jersey-num">#${escapeHtml(player.number)}</div>
        ${avatarHtml}
        <h3 class="roster-name" style="margin-top:0.35rem;">${escapeHtml(player.name)}</h3>
        <span class="roster-pos-badge">${escapeHtml(player.position)}</span>
        ${mediaGalleryHtml}
      </div>
    `;
  }).join('');
}

export function removeTempRosterMedia(index) {
  tempRosterMedia.splice(index, 1);
  renderMediaPreviewGrid('roster-media-preview', tempRosterMedia, 'removeTempRosterMedia');
}

export function setupUIEventListeners() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeScheduleFilter = e.target.getAttribute('data-filter');
      renderScheduleList();
    });
  });

  const scheduleModal = document.getElementById('schedule-modal');
  const scheduleForm = document.getElementById('schedule-form');
  const scoreInputsContainer = document.getElementById('score-inputs-container');
  const finishedCheckbox = document.getElementById('form-schedule-finished');

  document.getElementById('btn-open-schedule-modal').addEventListener('click', () => {
    document.getElementById('schedule-modal-title').innerText = '새 경기 일정 등록';
    scheduleForm.reset();
    document.getElementById('form-schedule-id').value = '';
    scoreInputsContainer.style.display = 'none';
    scheduleModal.classList.add('active');
  });

  const closeScheduleModal = () => {
    scheduleModal.classList.remove('active');
  };
  document.getElementById('btn-close-schedule-modal').addEventListener('click', closeScheduleModal);
  document.getElementById('btn-cancel-schedule-modal').addEventListener('click', closeScheduleModal);

  if (finishedCheckbox) {
    finishedCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        scoreInputsContainer.style.display = 'grid';
      } else {
        scoreInputsContainer.style.display = 'none';
      }
    });
  }

  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('form-schedule-id').value;
      const opponent = document.getElementById('form-schedule-opponent').value;
      const date = document.getElementById('form-schedule-date').value;
      const timeStart = document.getElementById('form-schedule-time-start').value;
      const timeEnd = document.getElementById('form-schedule-time-end').value;
      const time = (timeStart && timeEnd) ? `${timeStart}~${timeEnd}` : (timeStart || timeEnd || '');
      const location = document.getElementById('form-schedule-location').value;
      const participants = document.getElementById('form-schedule-participants').value;
      const finished = finishedCheckbox.checked;
      const ourScore = finished ? parseInt(document.getElementById('form-schedule-our-score').value) || 0 : null;
      const oppScore = finished ? parseInt(document.getElementById('form-schedule-opp-score').value) || 0 : null;

      if (id) {
        const index = appData.schedule.findIndex(s => s.id === id);
        if (index !== -1) {
          appData.schedule[index] = { ...appData.schedule[index], opponent, date, time, location, participants, finished, ourScore, oppScore };
        }
      } else {
        const newGame = {
          id: 's_' + Date.now(),
          opponent, date, time, location, participants, finished, ourScore, oppScore
        };
        appData.schedule.push(newGame);
      }

      saveKey('schedule');
      closeScheduleModal();
      renderScheduleList();
      updateHeroCountdown();
    });
  }

  const skillModal = document.getElementById('skill-modal');
  const skillForm = document.getElementById('skill-form');

  document.getElementById('btn-open-skill-modal').addEventListener('click', () => {
    document.getElementById('skill-modal-title').innerText = '새로운 스킬 추가';
    document.getElementById('form-skill-id').value = '';
    tempSkillMedia.length = 0;
    renderMediaPreviewGrid('skill-media-preview', tempSkillMedia, 'removeTempSkillMedia');
    const mediaInput = document.getElementById('form-skill-media');
    if (mediaInput) mediaInput.value = '';
    skillForm.reset();
    skillModal.classList.add('active');
  });

  const closeSkillModal = () => {
    skillModal.classList.remove('active');
  };
  document.getElementById('btn-close-skill-modal').addEventListener('click', closeSkillModal);
  document.getElementById('btn-cancel-skill-modal').addEventListener('click', closeSkillModal);

  if (skillForm) {
    skillForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('form-skill-id').value;
      const categoryInput = document.getElementById('form-skill-category');
      const nameInput = document.getElementById('form-skill-name');
      const descInput = document.getElementById('form-skill-desc');

      const category = categoryInput.value.trim() || '기타';
      const name = nameInput.value.trim();
      const desc = descInput.value.trim();

      const submitBtn = skillForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = '업로드 중...';
      submitBtn.disabled = true;
      document.body.style.cursor = 'wait';

      let finalMedia = [];
      try {
        finalMedia = await uploadMediaFiles(tempSkillMedia, 'skills');
      } catch (err) {
        console.error(err);
      } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
        document.body.style.cursor = 'default';
      }

      if (id) {
        const index = appData.skills.findIndex(s => s.id === id);
        if (index !== -1) {
          appData.skills[index] = {
            ...appData.skills[index],
            category, name, desc,
            media: finalMedia
          };
        }
      } else {
        const newSkill = {
          id: 'k_' + Date.now(),
          category,
          name,
          desc,
          checked: false,
          media: finalMedia
        };
        appData.skills.push(newSkill);
      }

      saveKey('skills');
      closeSkillModal();
      renderSkillsList();
    });
  }

  document.getElementById('btn-add-local-rule').addEventListener('click', () => {
    const titleInput = document.getElementById('input-local-rule-title');
    const descInput = document.getElementById('input-local-rule-desc');

    const title = titleInput.value.trim();
    const desc = descInput.value.trim();

    if (!title || !desc) {
      alert('규칙 제목과 설명을 모두 입력해주세요.');
      return;
    }

    const newRule = {
      id: 'u_' + Date.now(),
      title,
      desc
    };

    appData.rules.push(newRule);
    saveKey('rules');

    titleInput.value = '';
    descInput.value = '';

    renderLocalRules();
  });

  const rosterModal = document.getElementById('roster-modal');
  const rosterForm = document.getElementById('roster-form');

  document.getElementById('btn-open-roster-modal').addEventListener('click', () => {
    document.getElementById('roster-modal-title').innerText = '선수 정보 등록';
    rosterForm.reset();
    document.getElementById('form-roster-id').value = '';
    tempRosterMedia.length = 0;
    renderMediaPreviewGrid('roster-media-preview', tempRosterMedia, 'removeTempRosterMedia');
    const mediaInput = document.getElementById('form-roster-media');
    if (mediaInput) mediaInput.value = '';
    rosterModal.classList.add('active');
  });

  const closeRosterModal = () => {
    rosterModal.classList.remove('active');
  };
  document.getElementById('btn-close-roster-modal').addEventListener('click', closeRosterModal);
  document.getElementById('btn-cancel-roster-modal').addEventListener('click', closeRosterModal);

  if (rosterForm) {
    rosterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('form-roster-name').value;
      const number = document.getElementById('form-roster-number').value;
      const position = document.getElementById('form-roster-position').value;

      const submitBtn = rosterForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = '업로드 중...';
      submitBtn.disabled = true;
      document.body.style.cursor = 'wait';

      let finalMedia = [];
      try {
        finalMedia = await uploadMediaFiles(tempRosterMedia, 'roster');
      } catch (err) {
        console.error(err);
      } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
        document.body.style.cursor = 'default';
      }

      const newPlayer = {
        id: 'r_' + Date.now(),
        name, number, position, height: '', strengths: '',
        media: finalMedia
      };
      appData.roster.push(newPlayer);

      saveKey('roster');
      closeRosterModal();
      renderRosterList();
    });
  }
}
