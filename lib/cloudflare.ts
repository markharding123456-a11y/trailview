/**
 * Cloudflare R2 upload helpers for TrailView.
 *
 * These call the Pages Functions API routes in /functions/api/
 * to store GPX files, videos, and thumbnails in R2.
 */

const API_BASE = "/api";

export type UploadResult = {
  success: boolean;
  key: string;
  url: string;
  size: number;
};

export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

/**
 * Upload a GPX file to R2.
 */
export async function uploadGpx(
  file: File,
  trailId: string
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("trailId", trailId);
  formData.append("type", "gpx");

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GPX upload failed: ${err}`);
  }

  return res.json();
}

/**
 * Upload a video file to R2 with progress tracking.
 * Uses XMLHttpRequest for progress events since fetch doesn't support upload progress.
 */
export function uploadVideo(
  file: File,
  trailId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("trailId", trailId);
    formData.append("type", "video");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/upload`);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Video upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.send(formData);
  });
}

/**
 * Upload a thumbnail image to R2.
 */
export async function uploadThumbnail(
  file: File,
  trailId: string
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("trailId", trailId);
  formData.append("type", "thumbnail");

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Thumbnail upload failed: ${err}`);
  }

  return res.json();
}

/**
 * Get a public URL for an R2 asset.
 */
export function getAssetUrl(key: string): string {
  return `${API_BASE}/assets/${encodeURIComponent(key)}`;
}

/**
 * Delete an asset from R2.
 */
export async function deleteAsset(key: string): Promise<void> {
  const res = await fetch(`${API_BASE}/assets/${encodeURIComponent(key)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Delete failed: ${await res.text()}`);
  }
}

/**
 * Format bytes to human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
