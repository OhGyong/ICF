// ================= INITIAL STATE & DATA CONFIGURATION =================

export const DEFAULT_ROSTER = [
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

export const DEFAULT_SCHEDULE = [
  { id: 's0', opponent: 'BDR 스타터스 리그', date: '2026-07-26', time: '10:20~미정', location: '스포라운드(경기 남양주시 마치로 122 스포라운드)', participants: '강의현, 최해서, 송태진, 장근하, 오기용, 이상혁, 허성준, 김민준, 김호연, 배산하', finished: false, ourScore: null, oppScore: null },
  { id: 's1', opponent: '교류전', date: '2026-07-19', time: '14:00~16:00', location: '장소 미정', participants: '오기용, 강의현, 배산하, 이상혁', finished: false, ourScore: null, oppScore: null },
  { id: 's2', opponent: '내전', date: '2026-07-11', time: '14:00~16:00', location: '장소 미정', participants: '참가자 미정', finished: false, ourScore: null, oppScore: null },
  { id: 's3', opponent: '고려대 동아리 교류전', date: '2026-06-27', time: '10:00~12:00', location: '버블짐(경기 남양주시 불암로 291 별내중앙타워 4층)', participants: '오기용, 강의현, 장근하, 김호연, 배산하, 이상혁, 최해서, 허성준, 송태진', finished: true, ourScore: 0, oppScore: 0 },
  { id: 's4', opponent: '내전+게스트2', date: '2026-06-19', time: '22:00~24:00', location: '리얼 농구교실(경기 구리시 동구릉로200번길 25 리얼농구교실)', participants: '오기용, 강의현, 김호연, 배산하, 이상혁, 장근하, 최해서, 김민준', finished: true, ourScore: 0, oppScore: 0 },
  { id: 's5', opponent: '내전', date: '2026-06-13', time: '08:00~10:00', location: '버블짐', participants: '오기용, 강의현, 최해서, 장근하, 이상혁, 김진호, 김호연, 배산하, 김민준, 허성준', finished: true, ourScore: 0, oppScore: 0 }
];

export const DEFAULT_SKILLS = [
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

export const DEFAULT_RULES = [
  { id: 'u1', title: '경기 시간', desc: '7분 4Q 경기(2심) / 1~3쿼터 1분 데드 적용, 4쿼터 2분 풀데드 적용' },
  { id: 'u2', title: '경기구', desc: '몰텐 BG4550' },
  { id: 'u3', title: '파울 누적 퇴장', desc: '개인 파울 5회 퇴장 (테크니컬 파울 2회 즉시 퇴장)' }
];

export const DEFAULT_TACTICS = [];

export const DEFAULT_LINEUPS = [
  { id: 'q1', quarter: '1쿼터', players: '오기용, 송태진, 강의현, 이상혁, 김호연' },
  { id: 'q2', quarter: '2쿼터', players: '오기용, 허성준, 최해서, 배산하, 장근하' },
  { id: 'q3', quarter: '3쿼터', players: '송태진, 강의현, 김호연, 이상혁, 허성준' },
  { id: 'q4', quarter: '4쿼터', players: '송태진, 장근하, 오기용, 배산하, 최해서' }
];

export const DATA_KEYS = ['roster', 'schedule', 'skills', 'rules', 'tactics', 'lineups'];

export const DATA_DEFAULTS = {
  roster: DEFAULT_ROSTER,
  schedule: DEFAULT_SCHEDULE,
  skills: DEFAULT_SKILLS,
  rules: DEFAULT_RULES,
  tactics: DEFAULT_TACTICS,
  lineups: DEFAULT_LINEUPS
};

export const appData = {
  roster: [],
  schedule: [],
  skills: [],
  rules: [],
  tactics: [],
  lineups: []
};

export const defaultTokenPositions = {
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
