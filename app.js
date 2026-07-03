import { loadCache, loadState, waitForFirebase, resetAllData } from './js/firebase-service.js';
import { processMediaFile, renderMediaPreviewGrid, openMediaViewModal } from './js/media.js';
import {
  switchTab, openEditScheduleModal, deleteSchedule,
  editSkill, deleteSkill, removeTempSkillMedia, tempSkillMedia,
  deleteLocalRule,
  removeTempRosterMedia, tempRosterMedia, editRoster, deleteRoster,
  updateHeroCountdown,
  setupUIEventListeners
} from './js/ui.js';
import {
  deleteTactic, loadTacticToForm, removeTempTacticMedia, tempTacticMedia, addTacticLinkInput, removeTacticLinkInput
} from './js/board.js';
import { appData } from './js/data.js';

// ================= GLOBAL BINDINGS FOR HTML INLINE EVENTS =================
window.appData = appData;
window.switchTab = switchTab;
window.openEditScheduleModal = openEditScheduleModal;
window.deleteSchedule = deleteSchedule;
window.loadTacticToForm = loadTacticToForm;
window.deleteTactic = deleteTactic;
window.removeTempTacticMedia = removeTempTacticMedia;
window.addTacticLinkInput = addTacticLinkInput;
window.removeTacticLinkInput = removeTacticLinkInput;
window.editSkill = editSkill;
window.deleteSkill = deleteSkill;
window.removeTempSkillMedia = removeTempSkillMedia;
window.deleteLocalRule = deleteLocalRule;
window.removeTempRosterMedia = removeTempRosterMedia;
window.editRoster = editRoster;
window.deleteRoster = deleteRoster;
window.openMediaViewModal = openMediaViewModal;

// ================= INITIALIZATION & SETUP =================

function setTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  const dayStr = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];

  document.getElementById('current-date').innerText = `${year}. ${month}. ${date} (${dayStr})`;
}

function connectTabEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function initMediaInputs() {
  const tacticInput = document.getElementById('tactic-media-input');
  if (tacticInput) {
    tacticInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const f of files) {
        try {
          const item = await processMediaFile(f);
          if (item) tempTacticMedia.push(item);
        } catch (err) {
          console.error(err);
          alert(`'${f.name}' 파일을 읽는 중 오류가 발생했습니다.`);
        }
      }
      renderMediaPreviewGrid('tactic-media-preview', tempTacticMedia, 'removeTempTacticMedia');
      tacticInput.value = '';
    });
  }

  const skillInput = document.getElementById('form-skill-media');
  if (skillInput) {
    skillInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const f of files) {
        try {
          const item = await processMediaFile(f);
          if (item) tempSkillMedia.push(item);
        } catch (err) {
          console.error(err);
          alert(`'${f.name}' 파일을 읽는 중 오류가 발생했습니다.`);
        }
      }
      renderMediaPreviewGrid('skill-media-preview', tempSkillMedia, 'removeTempSkillMedia');
      skillInput.value = '';
    });
  }

  const rosterInput = document.getElementById('form-roster-media');
  if (rosterInput) {
    rosterInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const f of files) {
        try {
          const item = await processMediaFile(f);
          if (item) tempRosterMedia.push(item);
        } catch (err) {
          console.error(err);
          alert(`'${f.name}' 파일을 읽는 중 오류가 발생했습니다.`);
        }
      }
      renderMediaPreviewGrid('roster-media-preview', tempRosterMedia, 'removeTempRosterMedia');
      rosterInput.value = '';
    });
  }

  const mediaModal = document.getElementById('media-view-modal');
  const closeMediaBtn = document.getElementById('btn-close-media-view');
  if (closeMediaBtn && mediaModal) {
    closeMediaBtn.addEventListener('click', () => {
      mediaModal.classList.remove('active');
      const body = document.getElementById('media-view-body');
      if (body) body.innerHTML = '';
    });
  }
}

function initApp() {
  setTodayDate();
  connectTabEvents();
  initMediaInputs();
  setupUIEventListeners();

  switchTab('dashboard');
  updateHeroCountdown();

  document.getElementById('btn-reset-data').addEventListener('click', resetAllData);
}

// Start
window.addEventListener('DOMContentLoaded', async () => {
  loadCache();
  try {
    initApp();
  } catch (e) {
    console.error('initApp 오류:', e);
  }
  try {
    await waitForFirebase();
    await loadState();
  } catch (e) {
    console.error('Firebase 연결 실패 — 로컬 캐시로만 동작합니다.', e);
  }
});
