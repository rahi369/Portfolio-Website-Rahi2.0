import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from './firebase';

export interface UploadResult {
  url: string;
  fileName: string;
}

function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file.'));
      }
    };
    reader.onerror = () => reject(new Error('File read error.'));
    reader.readAsDataURL(blob);
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, ms);
    promise.then(
      (val) => {
        window.clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function isImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  return /\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(file.name);
}

/**
 * Resize and compress oversized mobile/desktop images client-side so uploads
 * stay fast, sharp, and well below server/proxy payload limits.
 */
async function optimizeImageForUpload(
  file: File
): Promise<{ blob: Blob; mimeType: string; fileName: string }> {
  if (!isImageFile(file)) {
    return {
      blob: file,
      mimeType: file.type || 'application/pdf',
      fileName: file.name,
    };
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1600;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          blob: file,
          mimeType: file.type || 'image/jpeg',
          fileName: file.name,
        });
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const preservePng = file.type === 'image/png' && file.size <= 900 * 1024;
      const targetMime = preservePng ? 'image/png' : 'image/jpeg';
      const quality = preservePng ? undefined : 0.86;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              blob: file,
              mimeType: file.type || 'image/jpeg',
              fileName: file.name,
            });
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, '') || 'design';
          const ext = targetMime === 'image/png' ? 'png' : 'jpg';
          resolve({
            blob,
            mimeType: targetMime,
            fileName: `${baseName}.${ext}`,
          });
        },
        targetMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        blob: file,
        mimeType: file.type || 'image/jpeg',
        fileName: file.name,
      });
    };

    img.src = objectUrl;
  });
}

async function safeReadJson(resp: Response): Promise<{
  url?: string;
  fileName?: string;
  error?: string;
} | null> {
  try {
    const contentType = resp.headers.get('content-type') || '';
    const text = await resp.text();
    if (!text) return null;
    if (contentType.includes('text/html') || text.trimStart().startsWith('<')) {
      return null;
    }
    return JSON.parse(text) as { url?: string; fileName?: string; error?: string };
  } catch {
    return null;
  }
}

export async function uploadAssetFile(
  file: File,
  cloudinaryConfig?: { cloudName?: string; uploadPreset?: string }
): Promise<UploadResult> {
  const prepared = await optimizeImageForUpload(file);

  const cloudName =
    cloudinaryConfig?.cloudName?.trim() || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    cloudinaryConfig?.uploadPreset?.trim() || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // 1. Prefer Cloudinary when configured. A slow mobile connection should not
  // be treated as a failed upload after only 15 seconds; if Cloudinary rejects
  // the request, continue to the Firebase Storage fallback.
  let cloudinaryFailureReason = '';
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append('file', prepared.blob, prepared.fileName);
      formData.append('upload_preset', uploadPreset);
      const resourceType = prepared.mimeType === 'application/pdf' ? 'raw' : 'image';
      const resp = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(60000),
        }
      );
      const data = (await safeReadJson(resp)) as {
        secure_url?: string;
        original_filename?: string;
        error?: { message?: string } | string;
      } | null;
      if (!resp.ok || !data?.secure_url) {
        const errMsg =
          typeof data?.error === 'object' ? data.error?.message : data?.error;
        throw new Error(errMsg || `Cloudinary upload failed (${resp.status}).`);
      }
      return {
        url: data.secure_url,
        fileName: data.original_filename || prepared.fileName,
      };
    } catch (err) {
      cloudinaryFailureReason =
        err instanceof Error ? err.message : 'Cloudinary upload failed';
    }
  }

  // 2. The Vercel /api/upload route intentionally returns 404 because local
  // disk is ephemeral on serverless hosting. Only use that endpoint locally;
  // production uploads go directly to durable cloud storage instead of first
  // converting the file to a large base64 JSON payload.
  let serverFailureReason = cloudinaryFailureReason;
  const isLocalNodeHost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  if (isLocalNodeHost) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Please sign in as administrator before uploading files.');
    }

    try {
      const idToken = await currentUser.getIdToken();
      const dataBase64 = await fileToBase64(prepared.blob);
      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fileName: prepared.fileName,
          mimeType: prepared.mimeType,
          dataBase64,
        }),
        signal: AbortSignal.timeout(60000),
      });
      const payload = await safeReadJson(resp);
      if (resp.ok && payload?.url) {
        return {
          url: payload.url,
          fileName: payload.fileName || prepared.fileName,
        };
      }
      if (payload?.error && resp.status < 500 && resp.status !== 404 && resp.status !== 405) {
        throw new Error(payload.error);
      }
      serverFailureReason = payload?.error || `Upload endpoint unavailable (HTTP ${resp.status})`;
    } catch (err) {
      if (
        err instanceof Error &&
        err.name !== 'TimeoutError' &&
        err.name !== 'AbortError' &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('HTTP ')
      ) {
        throw err;
      }
      serverFailureReason =
        err instanceof Error && err.name === 'TimeoutError'
          ? 'Upload server timed out'
          : err instanceof Error
            ? err.message
            : 'Upload server unreachable';
    }
  }
  // 3. Fallback to Firebase Storage with a generous timeout for mobile networks.
  try {
    const safeName = prepared.fileName
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .slice(0, 64);
    const storageRef = ref(storage, `portfolio-assets/${Date.now()}-${safeName}`);
    await withTimeout(
      uploadBytes(storageRef, prepared.blob, {
        contentType: prepared.mimeType,
      }),
      90000,
      'Firebase Storage upload timed out after 90 seconds. Check the connection and Storage rules.'
    );
    const url = await withTimeout(
      getDownloadURL(storageRef),
      20000,
      'Could not retrieve uploaded file URL.'
    );
    return {
      url,
      fileName: prepared.fileName,
    };
  } catch (fbErr) {
    const fbMsg = fbErr instanceof Error ? fbErr.message : '';
    throw new Error(
      `Upload could not complete (${serverFailureReason || 'Cloud upload unavailable'}${fbMsg ? `; ${fbMsg}` : ''}). Check that Firebase Storage is enabled and its rules allow the signed-in admin to upload, or configure Cloudinary in Admin → Settings.`
    );
  }
}
