// Firebase SDK를 모듈에서 직접 import → window.fb 전역 브릿지 및 waitForFirebase() 폴링 불필요
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getFirestore, doc, getDoc, setDoc, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {
  getStorage, ref as storageRef, uploadBytes, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';

import { appData, DATA_KEYS, DATA_DEFAULTS } from './data.js';
import { refreshActiveTab } from './ui.js';

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

let db = null;
export let storage = null;
export { storageRef, uploadBytes, getDownloadURL };

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (e) {
  console.error('Firebase 초기화 실패 — 로컬 캐시로만 동작합니다.', e);
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

    const docRef = doc(db, 'icf-data', key);

    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        appData[key] = snap.data().items || [];
      } else {
        appData[key] = DATA_DEFAULTS[key];
        await setDoc(docRef, { items: DATA_DEFAULTS[key] });
      }
      localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
    } catch (e) {
      console.error(`'${key}' 불러오기 실패:`, e);
    }

    // 반환된 unsubscribe 함수를 저장
    _unsubscribers[key] = onSnapshot(docRef, (d) => {
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
  if (!db) return;
  // Firestore: dataUrl/previewUrl/file 제거 후 저장
  const firestoreItems = sanitizeForFirestore(appData[key]);
  setDoc(doc(db, 'icf-data', key), { items: firestoreItems })
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
