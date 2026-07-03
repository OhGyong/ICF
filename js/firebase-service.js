import { appData, DATA_KEYS, DATA_DEFAULTS } from './data.js';
import { refreshActiveTab } from './ui.js';

export function waitForFirebase() {
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

export function loadCache() {
  DATA_KEYS.forEach(key => {
    const cached = localStorage.getItem(`hoop_${key}`);
    if (cached) {
      try { appData[key] = JSON.parse(cached); } catch (e) { }
    }
  });
}

// 키별 onSnapshot 구독 해제 함수 보관
const _unsubscribers = {};

export async function loadState() {
  const { db, doc, getDoc, setDoc, onSnapshot } = window.fb;

  for (const key of DATA_KEYS) {
    // 기존 리스너가 있으면 먼저 해제하여 중복 등록 방지
    if (_unsubscribers[key]) {
      _unsubscribers[key]();
      _unsubscribers[key] = null;
    }

    const ref = doc(db, 'icf-data', key);

    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        appData[key] = snap.data().items || [];
      } else {
        appData[key] = DATA_DEFAULTS[key];
        await setDoc(ref, { items: DATA_DEFAULTS[key] });
      }
      localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
    } catch (e) {
      console.error(`'${key}' 불러오기 실패:`, e);
    }

    // 반환된 unsubscribe 함수를 저장
    _unsubscribers[key] = onSnapshot(ref, (d) => {
      if (!d.exists()) return;
      appData[key] = d.data().items || [];
      localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
      refreshActiveTab();
    });
  }

  refreshActiveTab();
}

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
        .filter(m => m.url)                          // Storage URL 없는 항목 제외
        .map(({ type, url, name }) => ({ type, url, name })) // 필요 필드만 보존
    };
  });
}

export function saveKey(key) {
  appData[key] = appData[key] || [];
  // localStorage: 현재 세션 표시용으로 원본 그대로 저장 (previewUrl 포함)
  localStorage.setItem(`hoop_${key}`, JSON.stringify(appData[key]));
  if (!window.fb) return;
  const { db, doc, setDoc } = window.fb;
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
