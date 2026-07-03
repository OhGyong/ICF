import { escapeHtml } from './utils.js';
import { storage, storageRef, uploadBytes, getDownloadURL } from './firebase-service.js';

export function processMediaFile(file) {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('video/')) {
      alert(`'${file.name}' 동영상은 업로드할 수 없습니다. 사진만 첨부 가능합니다.`);
      return resolve(null);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1920;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve({ type: 'image', file: blob, previewUrl: URL.createObjectURL(blob), name: file.name });
          }, 'image/jpeg', 0.90);
        };
        img.onerror = () => {
          resolve({ type: 'image', file: file, previewUrl: URL.createObjectURL(file), name: file.name });
        };
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }
  });
}

export async function uploadMediaFiles(tempMediaArray, folderName) {
  if (!storage) return tempMediaArray;

  const uploadedMedia = [];
  for (const item of tempMediaArray) {
    if (item.file) {
      try {
        const fileExt = item.name.split('.').pop() || 'tmp';
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const sRef = storageRef(storage, `image/${fileName}`);

        await uploadBytes(sRef, item.file);
        const url = await getDownloadURL(sRef);
        uploadedMedia.push({ type: item.type, url: url, name: item.name });
      } catch (err) {
        console.error('Upload error:', err);
        alert(`'${item.name}' 파일 업로드 중 오류가 발생했습니다.`);
      }
    } else {
      uploadedMedia.push({ type: item.type, url: item.url, dataUrl: item.dataUrl, name: item.name });
    }
  }
  return uploadedMedia;
}

export function renderMediaPreviewGrid(containerId, mediaArray, onRemoveFuncName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!mediaArray || mediaArray.length === 0) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = mediaArray.map((item, index) => {
    const src = escapeHtml(item.previewUrl || item.url || item.dataUrl);
    return `
    <div class="preview-item">
      ${item.type === 'video'
        ? `<video src="${src}"></video><div class="video-badge">▶</div>`
        : `<img src="${src}" alt="미리보기">`}
      <button type="button" class="preview-remove-btn" onclick="${onRemoveFuncName}(${index})">&times;</button>
    </div>
    `;
  }).join('');
}

export function openMediaViewModal(mediaObj) {
  const modal = document.getElementById('media-view-modal');
  const body = document.getElementById('media-view-body');
  const title = document.getElementById('media-view-title');
  if (!modal || !body) return;

  const src = escapeHtml(mediaObj.previewUrl || mediaObj.url || mediaObj.dataUrl);
  title.innerText = mediaObj.type === 'video' ? '동영상 보기' : '사진 보기';
  body.innerHTML = mediaObj.type === 'video'
    ? `<video src="${src}" controls autoplay style="max-width:100%; max-height:65vh;"></video>`
    : `<img src="${src}" style="max-width:100%; max-height:65vh; object-fit:contain;">`;

  modal.classList.add('active');
}
