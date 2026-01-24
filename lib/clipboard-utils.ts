// lib/clipboard-utils.ts
/**
 * Clipboard utilities for handling image paste with fallbacks
 * and permission handling
 */

export interface ClipboardImageResult {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Compress image to optimize for storage/embedding
 * @param dataUrl Base64 or blob URL
 * @param maxWidth Maximum width in pixels
 * @param maxHeight Maximum height in pixels
 * @param quality JPEG quality (0-1)
 * @returns Promise<string> Compressed data URL
 */
export async function compressImage(
  dataUrl: string,
  maxWidth: number = 1920,
  maxHeight: number = 1440,
  quality: number = 0.8
): Promise<ClipboardImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        } else {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({
        src: compressedDataUrl,
        width,
        height,
        quality,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = dataUrl;
  });
}

/**
 * Check if clipboard read permission is available
 */
export async function checkClipboardPermission(): Promise<boolean> {
  if (!navigator?.permissions?.query) {
    return false;
  }

  try {
    const permissionStatus = await navigator.permissions.query({
      name: 'clipboard-read' as PermissionName,
    });
    return permissionStatus.state === 'granted' || permissionStatus.state === 'prompt';
  } catch {
    return false;
  }
}

/**
 * Read images from clipboard using modern Clipboard API
 * with fallback to paste event handling
 */
export async function readClipboardImages(): Promise<ClipboardImageResult[]> {
  try {
    // Try modern Clipboard API first
    if (navigator?.clipboard?.read) {
      try {
        const items = await navigator.clipboard.read();
        const images: ClipboardImageResult[] = [];

        for (const item of items) {
          // Look for image types
          const imageTypes = item.types.filter(type => type.startsWith('image/'));
          
          if (imageTypes.length > 0) {
            for (const imageType of imageTypes) {
              const blob = await item.getType(imageType);
              const url = URL.createObjectURL(blob);
              const compressed = await compressImage(url);
              images.push(compressed);
              URL.revokeObjectURL(url);
            }
          }
        }

        return images;
      } catch (err) {
        console.warn('Clipboard API read failed, will require paste event:', err);
        return [];
      }
    }
  } catch {
    // Clipboard API not available
  }

  return [];
}

/**
 * Extract image from clipboard event data
 * Handles both single and multiple images
 */
export async function extractImagesFromClipboardEvent(
  event: ClipboardEvent
): Promise<ClipboardImageResult[]> {
  const items = event.clipboardData?.items;
  if (!items) return [];

  const images: ClipboardImageResult[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        try {
          const dataUrl = await fileToDataUrl(file);
          const compressed = await compressImage(dataUrl);
          images.push(compressed);
        } catch (err) {
          console.error('Failed to process pasted image:', err);
        }
      }
    }
  }

  return images;
}

/**
 * Convert File to data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      resolve(result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Get optimal image dimensions for canvas page
 * Maintains aspect ratio and fits within page bounds
 */
export function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  pageWidth: number,
  pageHeight: number
): { width: number; height: number } {
  const maxWidth = pageWidth * 0.8;
  const maxHeight = pageHeight * 0.6;
  
  const aspectRatio = originalWidth / originalHeight;
  
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Calculate center position for new element on page
 */
export function calculateCenterPosition(
  pageWidth: number,
  pageHeight: number,
  elementWidth: number,
  elementHeight: number
): { x: number; y: number } {
  return {
    x: Math.max(0, (pageWidth - elementWidth) / 2),
    y: Math.max(0, (pageHeight - elementHeight) / 2),
  };
}
