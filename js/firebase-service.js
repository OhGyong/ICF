import { appData, DATA_KEYS, DATA_DEFAULTS } from './data.js';
import { refreshActiveTab } from './ui.js';

// ================= Firebase 함수 참조 (동적 초기화 후 설정) =================
// static import 대신 dynamic import를 사용하여
// CDN 장애 시에도 앱이 로컬 캐시 모드로 동작할 수 있도록 합니다.
let db = null;
let _doc = null;
let _getDoc = null;
let _setDoc = null;
let _onSnapshot = null;

export let storage = null;
export let storageRef = null;
export let uploadBytes = null;
export let getDownloadURL = null;

// ================= FIREBASE 초기화 =================
const firebaseConfig = {
  apiKey: 'AIzaSyBGqADhFYbr_7KI590WHmt1MHGXexOa79E',
  authDomain: 'icf-inchangfriend.firebaseapp.com',
  databaseURL: 'https://icf-inchangfriend-default-rtdb.firebaseio.com',
  projectId: 'icf-inchangfriend',
  storageBucket: 'icf-inchangfriend.firebasestorage.app',
  messagingSenderId: '680680923499',
  appId: '1:680680923499:web:84f36425015960c9ff2c2e',
  measurementId: 'G-QFS6X2EF5X'
};

/**
 * Firebase SDK를 동적으로 로드합니다.
 * CDN 로드 실패 시 에러를 내부에서 처리하고,
 * db/storage 를 null로 유지하여 이후 코드가 캐시 전용으로 동작합니다.
 */
export async function initFirebase() {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const {
      getFirestore, doc, getDoc, setDoc, onSnapshot
    } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
    const {
      getStorage,
      ref,
      uploadBytes: _uploadBytes,
      getDownloadURL: _getDownloadURL
    } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js');

    const app = initializeApp(firebaseConfig);
    db      = getFirestore(app);
    storage = getStorage(app);

    // Firestore 함수 참조 저장 (loadState / saveKey 에서 사용)
    _doc        = doc;
    _getDoc     = getDoc;
    _setDoc     = setDoc;
    _onSnapshot = onSnapshot;

    // Storage 함수 참조 저장 (media.js 에서 사용 — export let 라이브 바인딩)
    storageRef      = ref;
    uploadBytes     = _uploadBytes;
    getDownloadURL  = _getDownloadURL;

    console.log('Firebase 초기화 완료');
  } catch (e) {
    console.error('Firebase CDN 로드 실패 — 로컬 캐시로만 동작합니다.', e);
    // db, storage 는 null로 유지 → 이하 모든 Firebase 호출이 조기 반환됨
  }
}

// ================= 캐시 로드 =================
export function loadCache() {
  DATA_KEYS.forEach(key => {
    const cached = localStorage.getItem(`hoop_${key}`);
    if (cached) {
      try { appData[key] = JSON.parse(cached); } catch (e) { }
    }
  });
}

// ================= FIRESTORE 실시간 동기화 =================
// 키별 onSnapshot 구독 해제 함수 보관
const _unsubscribers = {};

export async function loadState() {
  if (!db) throw new Error('Firebase DB가 초기화되지 않았습니다.');

  for (const key of DATA_KEYS) {
    // 기존 리스너가 있으면 먼저 해제하여 중복 등록 방지
    if (_unsubscribers[key]) {
      _unsubscribers[key]();
      _unsubscribers[key] = null;
    }

    const docRef = _doc(db, 'icf-data', key);

    try {
      const snap = await _getDoc(docRef);
      if (snap.exists()) {
        appData[key] = snap.data().items || [];
      } else {
        appData[key] = DATA_DEFAULTS[key];
        await _setDoc(docRef, { items: DATA_DEFAULTS[key] });
      }
      localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
    } catch (e) {
      console.error(`'${key}' 불러오기 실패:`, e);
    }

    // 반환된 unsubscribe 함수를 저장
    _unsubscribers[key] = _onSnapshot(docRef, (d) => {
      if (!d.exists()) return;
      appData[key] = d.data().items || [];
      localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
      refreshActiveTab();
    });
  }

  refreshActiveTab();
}

// ================= FIRESTORE 저장 =================
/**
 * Firestore 저장 전 미디어 항목을 정리합니다.
 * - dataUrl(base64), previewUrl(blob URL), file(Blob) 은 제거
 * - Firebase Storage URL(url)이 있는 항목만 유지
 * → Firestore 문서 1MB 제한 초과 방지
 */
function sanitizeForFirestore(items) {
  return items.map(item => {
    if (!item.media || item.media.length === 0) return item;
    return {
      ...item,
      media: item.media
        .filter(m => m.url)
        .map(({ type, url, name }) => ({ type, url, name }))
    };
  });
}

export function saveKey(key) {
  appData[key] = appData[key] || [];
  // localStorage: 현재 세션 표시용으로 원본 그대로 저장 (previewUrl 포함)
  localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
  if (!db || !_doc || !_setDoc) return;
  // Firestore: dataUrl/previewUrl/file 제거 후 저장
  const firestoreItems = sanitizeForFirestore(appData[key]);
  _setDoc(_doc(db, 'icf-data', key), { items: firestoreItems })
    .catch(e => {
      console.error(`'${key}' 저장 실패:`, e);
      alert(`'${key}' 데이터 공유 저장에 실패했습니다. (첨부된 이미지/동영상 용량이 데이터베이스 제한을 초과했을 수 있습니다.)`);
    });
}

export function resetAllData() {
  if (confirm('모든 기록(일정, 로스터, 작전 등)을 초기값으로 리셋하시겠습니까? 모든 사용자에게 적용됩니다.')) {
    DATA_KEYS.forEach(key => {
      appData[key] = JSON.parse(JSON.stringify(DATA_DEFAULTS[key]));
      saveKey(key);
    });
    refreshActiveTab();
    alert('데이터가 성공적으로 초기화되었습니다.');
  }
}
