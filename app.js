// ================= INITIAL STATE & DATA CONFIGURATION =================

// Default Roster Mock Data
const DEFAULT_ROSTER = [
  { id: 'r1', name: '강의현', number: '14', position: '가드', height: '', strengths: '' },
  { id: 'r2', name: '최해서', number: '1', position: '가드', height: '', strengths: '' },
  { id: 'r3', name: '송태진', number: '18', position: '센터', height: '', strengths: '' },
  { id: 'r4', name: '장근하', number: '11', position: '가드', height: '', strengths: '' },
  { id: 'r5', name: '오기용', number: '5', position: '포워드', height: '', strengths: '' },
  { id: 'r6', name: '이상혁', number: '8', position: '센터', height: '', strengths: '' },
  { id: 'r7', name: '허성준', number: '16', position: '포워드', height: '', strengths: '' },
  { id: 'r8', name: '김민준', number: '17', position: '가드', height: '', strengths: '' },
  { id: 'r9', name: '김호연', number: '29', position: '가드', height: '', strengths: '' },
  { id: 'r10', name: '배산하', number: '13', position: '포워드', height: '', strengths: '' }
];

// Default Schedule Mock Data
const DEFAULT_SCHEDULE = [
  { id: 's0', opponent: 'BDR 스타터스 리그', date: '2026-07-26', time: '10:20~미정', location: '스포라운드(경기 남양주시 마치로 122 스포라운드)', participants: '강의현, 최해서, 송태진, 장근하, 오기용, 이상혁, 허성준, 김민준, 김호연, 배산하', finished: false, ourScore: null, oppScore: null },
  { id: 's1', opponent: '교류전', date: '2026-07-19', time: '14:00~16:00', location: '장소 미정', participants: '오기용, 강의현, 배산하, 이상혁', finished: false, ourScore: null, oppScore: null },
  { id: 's2', opponent: '내전', date: '2026-07-11', time: '14:00~16:00', location: '장소 미정', participants: '참가자 미정', finished: false, ourScore: null, oppScore: null },
  { id: 's3', opponent: '고려대 동아리 교류전', date: '2026-06-27', time: '10:00~12:00', location: '버블짐(경기 남양주시 불암로 291 별내중앙타워 4층)', participants: '오기용, 강의현, 장근하, 김호연, 배산하, 이상혁, 최해서, 허성준, 송태진', finished: true, ourScore: 0, oppScore: 0 },
  { id: 's4', opponent: '내전+게스트2', date: '2026-06-19', time: '22:00~24:00', location: '리얼 농구교실(경기 구리시 동구릉로200번길 25 리얼농구교실)', participants: '오기용, 강의현, 김호연, 배산하, 이상혁, 장근하, 최해서, 김민준', finished: true, ourScore: 0, oppScore: 0 },
  { id: 's5', opponent: '내전', date: '2026-06-13', time: '08:00~10:00', location: '버블짐', participants: '오기용, 강의현, 최해서, 장근하, 이상혁, 김진호, 김호연, 배산하, 김민준, 허성준', finished: true, ourScore: 0, oppScore: 0 }
];

// Default Skill Cards
const DEFAULT_SKILLS = [
  { id: 'k1', category: '슈팅', name: '자유투 루틴화', desc: '자유투 성공률 75% 이상 유지하기', checked: true },
  { id: 'k2', category: '슈팅', name: '캐치 앤 슛', desc: '무빙 후 정지 상태에서 빠른 릴리즈 슛', checked: false },
  { id: 'k3', category: '드리블', name: '크로스오버', desc: '낮고 빠른 볼 전환으로 상대 중심 무너뜨리기', checked: true },
  { id: 'k4', category: '드리블', name: '비하인드 백/레그스루', desc: '압박 수비 상황에서 안정적으로 볼 소유하기', checked: false },
  { id: 'k5', category: '패스', name: '엔트리 패스', desc: '포스트업한 센터에게 적시에 볼 찔러넣기', checked: false },
  { id: 'k6', category: '패스', name: '바운스 패스', desc: '밀착 수비 발밑 공간을 노리는 기본 바운드 패스', checked: true },
  { id: 'k7', category: '수비', name: '대인 방어 슬라이드 step', desc: '돌파하는 상대의 길을 선점하는 잔발 스텝 수비', checked: false },
  { id: 'k8', category: '수비', name: '박스아웃 & 리바운드', desc: '슛 시도 시 상대를 엉덩이로 밀어내고 리바운드 사수', checked: true },
  { id: 'k9', category: '팀 전술', name: '2-3 지역방어 로테이션', desc: '외곽 패스 이동에 따라 신속하게 자리를 메우는 팀 로테이션', checked: false },
  { id: 'k10', category: '팀 전술', name: '픽 앤 롤 (Pick & Roll)', desc: '스크리너와 핸들러의 유기적인 연계 오펜스', checked: false }
];

// Default Local Rules
const DEFAULT_RULES = [
  { id: 'u1', title: '경기 시간', desc: '7분 4Q 경기(2심) / 1~3쿼터 1분 데드 적용, 4쿼터 2분 풀데드 적용' },
  { id: 'u2', title: '경기구', desc: '몰텐 BG4550' },
  { id: 'u3', title: '파울 누적 퇴장', desc: '개인 파울 5회 퇴장 (테크니컬 파울 2회 즉시 퇴장)' }
];

// Default Saved Tactics
const DEFAULT_TACTICS = [];

// Default Lineups
const DEFAULT_LINEUPS = [
  { id: 'q1', quarter: '1쿼터', players: '오기용, 송태진, 강의현, 이상혁, 김호연' },
  { id: 'q2', quarter: '2쿼터', players: '오기용, 허성준, 최해서, 배산하, 장근하' },
  { id: 'q3', quarter: '3쿼터', players: '송태진, 강의현, 김호연, 이상혁, 허성준' },
  { id: 'q4', quarter: '4쿼터', players: '송태진, 장근하, 오기용, 배산하, 최해서' }
];

// App Data Storage State
let appData = {
  roster: [],
  schedule: [],
  skills: [],
  rules: [],
  tactics: [],
  lineups: []
};

// Initial Token Positions (Percentages)
const defaultTokenPositions = {
  half: [
    { id: 'token-off-pg', label: '1', role: 'PG (포인트 가드)', type: 'offense', x: 60, y: 38 },
    { id: 'token-off-sg', label: '2', role: 'SG (슈팅 가드)', type: 'offense', x: 48, y: 77 },
    { id: 'token-off-sf', label: '3', role: 'SF (스몰 포워드)', type: 'offense', x: 43, y: 12 },
    { id: 'token-off-pf', label: '4', role: 'PF (파워 포워드)', type: 'offense', x: 35, y: 58 },
    { id: 'token-off-c', label: '5', role: 'C (센터)', type: 'offense', x: 35, y: 92 },

    { id: 'token-def-d1', label: '1', role: '수비 1', type: 'defense', x: 52, y: 39 },
    { id: 'token-def-d2', label: '2', role: '수비 2', type: 'defense', x: 48, y: 69 },
    { id: 'token-def-d3', label: '3', role: '수비 3', type: 'defense', x: 28, y: 13 },
    { id: 'token-def-d4', label: '4', role: '수비 4', type: 'defense', x: 32, y: 50 },
    { id: 'token-def-d5', label: '5', role: '수비 5', type: 'defense', x: 32, y: 85 },

    { id: 'token-ball', label: '🏀', role: '볼', type: 'ball', x: 63, y: 34 }
  ],
  full: [
    { id: 'token-off-pg', label: '1', role: 'PG (포인트 가드)', type: 'offense', x: 30, y: 38 },
    { id: 'token-off-sg', label: '2', role: 'SG (슈팅 가드)', type: 'offense', x: 24, y: 77 },
    { id: 'token-off-sf', label: '3', role: 'SF (스몰 포워드)', type: 'offense', x: 22, y: 12 },
    { id: 'token-off-pf', label: '4', role: 'PF (파워 포워드)', type: 'offense', x: 18, y: 58 },
    { id: 'token-off-c', label: '5', role: 'C (센터)', type: 'offense', x: 18, y: 92 },

    { id: 'token-def-d1', label: '1', role: '수비 1', type: 'defense', x: 26, y: 39 },
    { id: 'token-def-d2', label: '2', role: '수비 2', type: 'defense', x: 24, y: 69 },
    { id: 'token-def-d3', label: '3', role: '수비 3', type: 'defense', x: 14, y: 13 },
    { id: 'token-def-d4', label: '4', role: '수비 4', type: 'defense', x: 16, y: 50 },
    { id: 'token-def-d5', label: '5', role: '수비 5', type: 'defense', x: 16, y: 85 },

    { id: 'token-ball', label: '🏀', role: '볼', type: 'ball', x: 32, y: 34 }
  ]
};

let currentCourtView = 'half'; // 'half' or 'full'

// ================= FIREBASE SHARED DATA LAYER =================

const DATA_KEYS = ['roster', 'schedule', 'skills', 'rules', 'tactics', 'lineups'];
const DATA_DEFAULTS = {
  roster: DEFAULT_ROSTER,
  schedule: DEFAULT_SCHEDULE,
  skills: DEFAULT_SKILLS,
  rules: DEFAULT_RULES,
  tactics: DEFAULT_TACTICS,
  lineups: DEFAULT_LINEUPS
};

// Firebase 모듈 스크립트(index.html)가 window.fb 를 설정할 때까지 대기
function waitForFirebase() {
  return new Promise((resolve, reject) => {
    if (window.fb) return resolve();
    let waited = 0;
    const timer = setInterval(() => {
      if (window.fb) {
        clearInterval(timer);
        resolve();
      } else if ((waited += 50) >= 10000) {
        clearInterval(timer);
        reject(new Error('Firebase 로드 실패'));
      }
    }, 50);
  });
}

// 로컬 캐시에서 즉시 화면 표시 (Firestore 응답 전 빈 화면 방지)
function loadCache() {
  DATA_KEYS.forEach(key => {
    const cached = localStorage.getItem(`hoop_${key}`);
    if (cached) {
      try { appData[key] = JSON.parse(cached); } catch (e) { /* 무시 */ }
    }
  });
}

// 현재 활성 탭만 다시 렌더링
function refreshActiveTab() {
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab) renderTabContent(activeTab.id);
  updateHeroCountdown();
}

// Firestore 에서 공유 데이터를 불러오고 실시간 구독
async function loadState() {
  const { db, doc, getDoc, setDoc, onSnapshot } = window.fb;

  for (const key of DATA_KEYS) {
    const ref = doc(db, 'icf-data', key);

    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        appData[key] = snap.data().items || [];
      } else {
        // 최초 1회: 공유 DB에 기본 데이터를 심어둠
        appData[key] = DATA_DEFAULTS[key];
        await setDoc(ref, { items: DATA_DEFAULTS[key] });
      }
      localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
    } catch (e) {
      console.error(`'${key}' 불러오기 실패:`, e);
    }

    // 실시간: 누군가 데이터를 바꾸면 내 화면도 자동 갱신
    onSnapshot(ref, (d) => {
      if (!d.exists()) return;
      appData[key] = d.data().items || [];
      localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
      refreshActiveTab();
    });
  }

  // 모든 키 로드 완료 후 화면 한 번 갱신
  refreshActiveTab();
}

// 특정 key 를 공유 Firestore 에 저장 (모든 사용자에게 반영)
function saveKey(key) {
  appData[key] = appData[key] || [];
  localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key])); // 오프라인 캐시
  if (!window.fb) return;
  const { db, doc, setDoc } = window.fb;
  setDoc(doc(db, 'icf-data', key), { items: appData[key] })
    .catch(e => console.error(`'${key}' 저장 실패:`, e));
}

// 모든 공유 데이터를 기본값으로 초기화
function resetAllData() {
  if (confirm('모든 기록(일정, 로스터, 작전 등)을 초기값으로 리셋하시겠습니까? 모든 사용자에게 적용됩니다.')) {
    DATA_KEYS.forEach(key => {
      appData[key] = JSON.parse(JSON.stringify(DATA_DEFAULTS[key]));
      saveKey(key);
    });
    refreshActiveTab();
    alert('데이터가 성공적으로 초기화되었습니다.');
  }
}


// ================= NAVIGATION SYSTEM =================
const pageTitles = {
  dashboard: { title: '대시보드', subtitle: 'ICF 농구 대회 준비 및 활동 요약' },
  schedule: { title: '대회 일정 관리', subtitle: '다가오는 경기 시간, 장소 및 결과 기록' },
  tactics: { title: '작전판 & 전술', subtitle: '포지션 배치와 상세 공격/수비 작전 수립' },
  skills: { title: '스킬 & 트레이닝', subtitle: '농구 스킬관련 정리' },
  rules: { title: '경기 규칙', subtitle: '기본적인 농구 규정과 대회용 로컬 룰 요약' },
  roster: { title: '팀 로스터', subtitle: '목록 및 주요 포지션 관리' }
};

function switchTab(tabId) {
  // Update nav menu active states
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update tab content displays
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === tabId) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  // Update page header text
  if (pageTitles[tabId]) {
    document.getElementById('page-title').innerText = pageTitles[tabId].title;
    document.getElementById('page-subtitle').innerText = pageTitles[tabId].subtitle;
  }

  // Perform specific tab initialization / refresh
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


// ================= DASHBOARD RENDERER =================
function renderDashboard() {
  // Update counts
  const totalRoster = appData.roster.length;
  document.getElementById('stat-roster-count').innerText = totalRoster;

  // Upcoming games calculation
  const now = new Date();
  const upcomingGames = appData.schedule.filter(game => {
    const gameDate = new Date(`${game.date}T${game.time || '00:00'}`);
    return !game.finished && gameDate >= now;
  });

  document.getElementById('stat-upcoming-games').innerText = upcomingGames.length;
  document.getElementById('stat-total-games').innerText = appData.schedule.length;



  // Hero Countdown D-Day
  updateHeroCountdown();

  // Render recent upcoming matches in panel
  const panelGamesContainer = document.getElementById('dashboard-schedule-list');
  if (upcomingGames.length === 0) {
    panelGamesContainer.innerHTML = `
      <div class="empty-state">
        <p>예정된 경기가 없습니다.</p>
        <button class="btn btn-secondary btn-sm margin-top-md" onclick="switchTab('schedule')">경기 등록하러 가기</button>
      </div>
    `;
  } else {
    // Sort by date ascending
    const sortedUpcoming = [...upcomingGames].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
    panelGamesContainer.innerHTML = sortedUpcoming.map(game => {
      const gDate = new Date(game.date);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return `
        <div class="game-card" style="margin-bottom: 0.75rem;">
          <div class="game-meta">
            <div class="game-date-box" style="padding: 0.35rem 0.5rem; min-width: 65px; width: fit-content;">
              <div class="game-month" style="font-size: 0.65rem;">${gDate.getMonth() + 1}월</div>
              <div class="game-day" style="font-size: 1.15rem;">${gDate.getDate()}(${days[gDate.getDay()]})</div>
            </div>
            <div class="game-details-info">
              <span class="font-bold text-sm">${game.opponent} 전</span>
              <span class="game-venue-time" style="font-size: 0.75rem;">
                🏀 ${game.location} | ⏰ ${game.time}
              </span>
            </div>
          </div>
          <span class="badge badge-accent">D-${Math.ceil((gDate - now) / (1000 * 60 * 60 * 24))}</span>
        </div>
      `;
    }).join('');
  }

  // Render recent tactics
  const panelTacticsContainer = document.getElementById('dashboard-tactics-list');
  if (appData.tactics.length === 0) {
    panelTacticsContainer.innerHTML = `
      <div class="empty-state">
        <p>등록된 전술이 없습니다.</p>
        <button class="btn btn-secondary btn-sm margin-top-md" onclick="switchTab('tactics')">전술 작전판 짜기</button>
      </div>
    `;
  } else {
    const recentTactics = [...appData.tactics].reverse().slice(0, 3);
    panelTacticsContainer.innerHTML = recentTactics.map(tactic => `
      <div class="tactic-item-card" onclick="switchTab('tactics')" style="margin-bottom: 0.5rem; padding: 0.6rem 0.85rem;">
        <div class="tactic-item-info">
          <h4 style="font-size: 0.85rem;">${tactic.title}</h4>
          <p style="font-size: 0.75rem; max-width: 250px;">${tactic.desc}</p>
        </div>
        <span class="btn-text" style="font-size: 0.75rem;">작전판 &rarr;</span>
      </div>
    `).join('');
  }
}

function updateHeroCountdown() {
  const countdownTimer = document.getElementById('countdown-timer');
  const heroTitle = document.getElementById('dashboard-hero-title');
  const heroSubtitle = document.getElementById('dashboard-hero-subtitle');
  const sidebarDDay = document.getElementById('sidebar-dday');

  // 요소가 없으면 (다른 탭 활성 등) 안전하게 종료
  if (!countdownTimer || !heroTitle || !heroSubtitle) return;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingGames = appData.schedule.filter(game => {
    const gameDate = new Date(game.date);
    return !game.finished && gameDate >= now;
  });

  if (upcomingGames.length === 0) {
    countdownTimer.innerText = "D-?";
    heroTitle.innerHTML = `등록된 다가오는 <span class="text-highlight">경기 일정이 없습니다.</span>`;
    heroSubtitle.innerText = '대회나 연습경기가 있다면 경기 일정을 추가하여 카운트다운을 가동하세요!';
    if (sidebarDDay) sidebarDDay.innerText = '-';
  } else {
    // Sort upcoming games by date
    const nextGame = [...upcomingGames].sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const gameDate = new Date(nextGame.date);
    gameDate.setHours(0, 0, 0, 0);

    const diffTime = gameDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      countdownTimer.innerText = "D-Day";
      heroTitle.innerHTML = `오늘 바로 <span class="text-highlight">${nextGame.opponent} 전</span>이 있습니다!`;
      heroSubtitle.innerText = `장소: ${nextGame.location} | 시간: ${nextGame.time} | 참가자: ${nextGame.participants || '미정'}`;
      if (sidebarDDay) sidebarDDay.innerText = 'Day';
    } else {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      countdownTimer.innerText = `D-${diffDays}`;
      heroTitle.innerHTML = `다음 경기 <span class="text-highlight">${nextGame.opponent}</span>까지 <span class="text-highlight">${countdownTimer.innerText}</span> 남았습니다!`;
      heroSubtitle.innerText = `장소: ${nextGame.location} | 일시: ${nextGame.date}(${days[gameDate.getDay()]}) ${nextGame.time} | 참가자: ${nextGame.participants || '미정'}`;
      if (sidebarDDay) sidebarDDay.innerText = `-${diffDays}`;
    }
  }
}


// ================= SCHEDULE TAB CONTROL =================
let activeScheduleFilter = 'all';

function renderScheduleList() {
  const container = document.getElementById('schedule-list-container');
  let filteredList = [...appData.schedule];

  // Apply filters
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (activeScheduleFilter === 'upcoming') {
    filteredList = filteredList.filter(game => !game.finished);
  } else if (activeScheduleFilter === 'finished') {
    filteredList = filteredList.filter(game => game.finished);
  }

  // 모든 일정 날짜 내림차순 정렬
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
    let scoreDisplayHtml = '';

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
      scoreDisplayHtml = ``;
    } else {
      statusBadgeHtml = `<span class="badge badge-accent">예정</span>`;
      scoreDisplayHtml = ``;
    }

    const participantsList = game.participants ? game.participants.split(',').map(p => p.trim()).filter(p => p).sort((a, b) => a.localeCompare(b, 'ko')) : [];
    const participantsCount = participantsList.length;
    const participantsHtml = participantsCount > 0 && game.participants !== '참가자 미정'
      ? `<div style="display: flex; align-items: flex-start; gap: 0.35rem; margin-top: 0.5rem; color: var(--color-primary);"><svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top: 0.15rem; flex-shrink: 0;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg><div style="flex: 1; font-size: 0.85rem; line-height: 1.4;"><strong class="font-bold">${participantsCount}명</strong> 참가<div style="color: var(--color-text-secondary); font-size: 0.8rem; margin-top: 0.1rem;">${participantsList.join(', ')}</div></div></div>`
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
      ? `<div style="display: flex; flex-direction: column; line-height: 1.3;"><span>${locationName}</span><span style="font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 0.1rem;">${locationAddress}</span></div>`
      : `<span>${locationName}</span>`;

    return `
      <div class="game-card">
        <div class="game-meta">
          <div class="game-date-box">
            <div class="game-month">${monthStr}</div>
            <div class="game-day">${dayStr}</div>
          </div>
          <div class="game-details-info">
            <h3 class="game-opponent">${game.opponent}</h3>
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
              ${game.time}
            </span>
            ${participantsHtml}
          </div>
        </div>
        
        <div class="game-score-display">
          ${scoreDisplayHtml}
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
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

// Modal handling for Schedules
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

finishedCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    scoreInputsContainer.style.display = 'grid';
  } else {
    scoreInputsContainer.style.display = 'none';
  }
});

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
    // Edit Mode
    const index = appData.schedule.findIndex(s => s.id === id);
    if (index !== -1) {
      appData.schedule[index] = { ...appData.schedule[index], opponent, date, time, location, participants, finished, ourScore, oppScore };
    }
  } else {
    // Add Mode
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

function openEditScheduleModal(id) {
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

  scheduleModal.classList.add('active');
}

function deleteSchedule(id) {
  if (confirm('이 경기 일정을 정말 삭제하시겠습니까?')) {
    appData.schedule = appData.schedule.filter(s => s.id !== id);
    saveKey('schedule');
    renderScheduleList();
    updateHeroCountdown();
  }
}

// Bind Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeScheduleFilter = e.target.getAttribute('data-filter');
    renderScheduleList();
  });
});


// ================= TACTICS BOARD DRAG & DROP =================
let isBoardInitialized = false;
let currentTokenPositionsState = [];

function initTacticsBoard() {
  const courtContainer = document.getElementById('court-board-container');
  const tokensOverlay = document.getElementById('tokens-overlay');

  // Set ViewBox based on View settings (half vs full)
  const courtSvg = document.getElementById('court-svg');
  if (currentCourtView === 'half') {
    courtSvg.setAttribute('viewBox', '0 0 400 500');
    courtContainer.classList.remove('full-court');
  } else {
    courtSvg.setAttribute('viewBox', '0 0 800 500');
    courtContainer.classList.add('full-court');
  }

  // Populate tokens if state is empty
  if (currentTokenPositionsState.length === 0) {
    resetTokenPositions();
  } else {
    renderTokens();
  }

  if (!isBoardInitialized) {
    setupDragAndDrop();
    isBoardInitialized = true;
  }
}

function resetTokenPositions() {
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

    // Set descriptive tooltip
    if (token.type === 'offense') {
      el.title = `공격 ${token.label} (${token.role})`;
    } else if (token.type === 'defense') {
      el.title = `수비 ${token.label} (${token.role})`;
    } else {
      el.title = '농구공';
    }

    // Store index
    el.dataset.id = token.id;
    tokensOverlay.appendChild(el);
  });
}

// Drag & Drop Physics
let activeDragToken = null;

function setupDragAndDrop() {
  const container = document.getElementById('court-board-container');

  const startDrag = (e) => {
    const target = e.target;
    if (target.classList.contains('board-token')) {
      activeDragToken = target;
      e.preventDefault(); // Prevents touch scrolling
    }
  };

  const moveDrag = (e) => {
    if (!activeDragToken) return;

    const rect = container.getBoundingClientRect();
    let clientX, clientY;

    if (e.type.startsWith('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Convert pixels to relative percentages inside container
    const isPortrait = document.getElementById('court-wrapper').classList.contains('portrait-mode');
    let xPercent, yPercent;

    if (isPortrait) {
      xPercent = 100 - ((clientY - rect.top) / rect.height) * 100;
      yPercent = ((clientX - rect.left) / rect.width) * 100;
    } else {
      xPercent = ((clientX - rect.left) / rect.width) * 100;
      yPercent = ((clientY - rect.top) / rect.height) * 100;
    }

    // Clamp coordinates [2% - 98%]
    xPercent = Math.max(2, Math.min(98, xPercent));
    yPercent = Math.max(2, Math.min(98, yPercent));

    // Update styling
    activeDragToken.style.left = `${xPercent}%`;
    activeDragToken.style.top = `${yPercent}%`;

    // Update in-memory state
    const tokenId = activeDragToken.dataset.id;
    const tokenObj = currentTokenPositionsState.find(t => t.id === tokenId);
    if (tokenObj) {
      tokenObj.x = Math.round(xPercent);
      tokenObj.y = Math.round(yPercent);
    }
  };

  const endDrag = () => {
    activeDragToken = null;
  };

  // Attach mouse and touch listeners
  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);

  container.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('touchmove', moveDrag, { passive: false });
  window.addEventListener('touchend', endDrag);
}

// View toggle buttons
document.getElementById('court-half').addEventListener('click', (e) => {
  document.getElementById('court-half').classList.add('active');
  document.getElementById('court-full').classList.remove('active');
  currentCourtView = 'half';
  currentTokenPositionsState = []; // Reset coordinates for layout change
  initTacticsBoard();
});

document.getElementById('court-full').addEventListener('click', (e) => {
  document.getElementById('court-full').classList.add('active');
  document.getElementById('court-half').classList.remove('active');
  currentCourtView = 'full';
  currentTokenPositionsState = []; // Reset coordinates for layout change
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


// ================= TACTICS SAVE / LOAD CRUD =================
function renderTacticsList() {
  const tacticsList = document.getElementById('saved-tactics-list');
  if (appData.tactics.length === 0) {
    tacticsList.innerHTML = `
      <p class="text-muted text-center text-sm py-4">등록된 전술이 없습니다.</p>
    `;
    return;
  }

  tacticsList.innerHTML = appData.tactics.map(t => `
    <div class="tactic-item-card" onclick="loadTacticToForm('${t.id}')">
      <div class="tactic-item-info">
        <h4>${t.title}</h4>
        <p>${t.desc}</p>
      </div>
      <button class="game-btn-icon delete-btn" onclick="deleteTactic(event, '${t.id}')" title="삭제" style="width: 28px; height: 28px;">
        &times;
      </button>
    </div>
  `).join('');
}

document.getElementById('btn-save-tactic').addEventListener('click', () => {
  const titleInput = document.getElementById('tactic-title');
  const descInput = document.getElementById('tactic-desc');

  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) {
    alert('전술 이름을 입력해주세요.');
    return;
  }

  // Create tactic object
  const newTactic = {
    id: 't_' + Date.now(),
    title,
    desc
  };

  appData.tactics.push(newTactic);
  saveKey('tactics');

  titleInput.value = '';
  descInput.value = '';

  renderTacticsList();
  alert('작전이 저장되었습니다.');
});

function loadTacticToForm(id) {
  const tactic = appData.tactics.find(t => t.id === id);
  if (!tactic) return;

  document.getElementById('tactic-title').value = tactic.title;
  document.getElementById('tactic-desc').value = tactic.desc;
}

function deleteTactic(event, id) {
  event.stopPropagation(); // Avoid triggering loading click
  if (confirm('이 전술을 리스트에서 삭제하시겠습니까?')) {
    appData.tactics = appData.tactics.filter(t => t.id !== id);
    saveKey('tactics');
    renderTacticsList();
  }
}


// ================= SKILLS CHECKLIST CONTROL =================
function renderSkillsList() {
  const container = document.getElementById('skills-list-container');

  // Group skills by category
  const categories = {};
  appData.skills.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  container.innerHTML = Object.keys(categories).map(catName => {
    const skillsHtml = categories[catName].map(skill => `
      <div class="skill-item">
        <div class="skill-details">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-desc">${skill.desc}</span>
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
    `).join('');

    return `
      <div class="skill-category-card">
        <div class="skill-category-header">
          <span class="skill-category-title">🏀 ${catName}</span>
        </div>
        <div class="skill-items-container">
          ${skillsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function toggleSkillCheckbox(id) {
  const skill = appData.skills.find(s => s.id === id);
  if (skill) {
    skill.checked = !skill.checked;
    saveKey('skills');
  }
}

function deleteSkill(id) {
  if (confirm('이 스킬 항목을 삭제하시겠습니까?')) {
    appData.skills = appData.skills.filter(s => s.id !== id);
    saveKey('skills');
    renderSkillsList();
  }
}

function editSkill(id) {
  const skill = appData.skills.find(s => s.id === id);
  if (!skill) return;

  document.getElementById('skill-modal-title').innerText = '스킬 항목 수정';
  document.getElementById('form-skill-id').value = skill.id;
  document.getElementById('form-skill-category').value = skill.category;
  document.getElementById('form-skill-name').value = skill.name;
  document.getElementById('form-skill-desc').value = skill.desc || '';

  skillModal.classList.add('active');
}

// Modal handling for Skills
const skillModal = document.getElementById('skill-modal');
const skillForm = document.getElementById('skill-form');

document.getElementById('btn-open-skill-modal').addEventListener('click', () => {
  document.getElementById('skill-modal-title').innerText = '새로운 스킬 추가';
  document.getElementById('form-skill-id').value = '';
  skillForm.reset();
  skillModal.classList.add('active');
});

const closeSkillModal = () => {
  skillModal.classList.remove('active');
};
document.getElementById('btn-close-skill-modal').addEventListener('click', closeSkillModal);
document.getElementById('btn-cancel-skill-modal').addEventListener('click', closeSkillModal);

skillForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('form-skill-id').value;
  const categoryInput = document.getElementById('form-skill-category');
  const nameInput = document.getElementById('form-skill-name');
  const descInput = document.getElementById('form-skill-desc');

  const category = categoryInput.value.trim() || '기타';
  const name = nameInput.value.trim();
  const desc = descInput.value.trim();

  if (id) {
    const index = appData.skills.findIndex(s => s.id === id);
    if (index !== -1) {
      appData.skills[index] = { ...appData.skills[index], category, name, desc };
    }
  } else {
    const newSkill = {
      id: 'k_' + Date.now(),
      category,
      name,
      desc,
      checked: false
    };
    appData.skills.push(newSkill);
  }

  saveKey('skills');

  closeSkillModal();
  renderSkillsList();
});



// ================= LOCAL TOURNAMENT RULES =================
function renderLocalRules() {
  const container = document.getElementById('local-rules-container');
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
        <h4>📌 ${rule.title}</h4>
        <p>${rule.desc}</p>
      </div>
      <button class="game-btn-icon delete-btn" onclick="deleteLocalRule('${rule.id}')" title="삭제" style="width: 32px; height: 32px;">
        &times;
      </button>
    </div>
  `).join('');
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

function deleteLocalRule(id) {
  if (confirm('이 규칙을 리스트에서 삭제하시겠습니까?')) {
    appData.rules = appData.rules.filter(r => r.id !== id);
    saveKey('rules');
    renderLocalRules();
  }
}


// ================= TEAM ROSTER CONTROL =================
function renderRosterList() {
  const container = document.getElementById('roster-grid-container');
  const lineupsContainer = document.getElementById('quarter-lineups-container');

  if (lineupsContainer) {
    if (!appData.lineups || appData.lineups.length === 0) {
      lineupsContainer.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1;">등록된 쿼터별 라인업이 없습니다.</p>';
    } else {
      lineupsContainer.innerHTML = appData.lineups.map(lineup => `
        <div class="card" style="padding: 1rem; border: 1px solid var(--border-color); box-shadow: none; background: rgba(255, 255, 255, 0.03);">
          <h4 style="margin-bottom: 0.5rem; color: var(--color-primary);">${lineup.quarter}</h4>
          <p style="font-size: 0.85rem; line-height: 1.4; color: var(--color-text-secondary);">${lineup.players}</p>
        </div>
      `).join('');
    }
  }

  if (appData.roster.length === 0) {
    container.innerHTML = `
      <div class="card text-center span-all-cols" style="padding: 3rem 1rem;">
        <p class="text-muted">팀원이 등록되지 않았습니다.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = appData.roster.map(player => `
    <div class="roster-card">
      <div class="roster-jersey-num">#${player.number}</div>
      <div class="roster-avatar">🏀</div>
      <h3 class="roster-name">${player.name}</h3>
      <span class="roster-pos-badge">${player.position}</span>
    </div>
  `).join('');
}

// Modal handling for Roster
const rosterModal = document.getElementById('roster-modal');
const rosterForm = document.getElementById('roster-form');

document.getElementById('btn-open-roster-modal').addEventListener('click', () => {
  document.getElementById('roster-modal-title').innerText = '선수 정보 등록';
  rosterForm.reset();
  document.getElementById('form-roster-id').value = '';
  rosterModal.classList.add('active');
});

const closeRosterModal = () => {
  rosterModal.classList.remove('active');
};
document.getElementById('btn-close-roster-modal').addEventListener('click', closeRosterModal);
document.getElementById('btn-cancel-roster-modal').addEventListener('click', closeRosterModal);

rosterForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('form-roster-name').value;
  const number = document.getElementById('form-roster-number').value;
  const position = document.getElementById('form-roster-position').value;

  const newPlayer = {
    id: 'r_' + Date.now(),
    name, number, position, height: '', strengths: ''
  };
  appData.roster.push(newPlayer);

  saveKey('roster');
  closeRosterModal();
  renderRosterList();
});


// ================= INITIALIZATION & SETUP =================

function setTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  const dayStr = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];

  document.getElementById('current-date').innerText = `${year}. ${month}. ${date} (${dayStr})`;
}

// Connect Tab Event Listeners
function connectTabEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // On mobile sidebar-menu is active, prevent standard link actions
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function initApp() {
  setTodayDate();
  connectTabEvents();

  // Set default active tab
  switchTab('dashboard');

  // Trigger default data count checks
  updateHeroCountdown();

  // Reset Data bind
  document.getElementById('btn-reset-data').addEventListener('click', resetAllData);
}

// Start
window.addEventListener('DOMContentLoaded', async () => {
  loadCache();   // 캐시로 즉시 화면 표시
  try {
    initApp();   // UI 이벤트 연결
  } catch (e) {
    console.error('initApp 오류:', e);
  }
  try {
    await waitForFirebase();
    await loadState();   // 공유 데이터 로드 + 실시간 구독
  } catch (e) {
    console.error('Firebase 연결 실패 — 로컬 캐시로만 동작합니다.', e);
  }
});
