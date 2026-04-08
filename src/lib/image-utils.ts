/**
 * Compress image to reduce file size before storing in localStorage
 * @param file The image file to compress
 * @param maxSize The maximum size in pixels for the longest dimension
 * @returns A promise that resolves to the compressed image data URL
 */
export function compressImage(file: File, maxSize: number = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas with new dimensions
      ctx.drawImage(img, 0, 0, width, height);

      // Create compressed image data URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

      // Clean up the object URL
      URL.revokeObjectURL(img.src);

      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Could not load image'));
    };
  });
}

/**
 * Get the size of a base64 encoded string in bytes
 * @param base64String The base64 encoded string
 * @returns The size in bytes
 */
export function getBase64Size(base64String: string): number {
  // Remove the data URL prefix if present
  const base64 = base64String.replace(/^data:image\/\w+;base64,/, '');

  // Calculate approximate size (base64 encoding increases size by ~33%)
  return Math.round((base64.length * 3) / 4);
}

/**
 * Check if the image is too large for localStorage
 * @param base64String The base64 encoded image string
 * @returns Whether the image is too large
 */
export function isImageTooLarge(base64String: string): boolean {
  const size = getBase64Size(base64String);
  // localStorage limit is ~5MB in most browsers, but we'll use a more conservative 2MB
  const limit = 2 * 1024 * 1024; // 2MB in bytes
  return size > limit;
}