/**
 * Optimizes a Google User Content (lh3.googleusercontent.com) image URL by appending
 * sizing and WebP formatting parameters.
 * 
 * @param url The original image URL.
 * @param size The desired max dimension size (e.g. 256, 600, 1200).
 * @returns The optimized URL if it matches Google's hosting, or the original URL.
 */
export function getOptimizedGoogleUrl(url: string | undefined | null, size: number): string {
  if (!url) return '';
  if (url.includes('lh3.googleusercontent.com')) {
    // Clean up any existing parameters at the end (like =s256-rw)
    const baseUrl = url.split('=')[0];
    return `${baseUrl}=s${size}-rw`;
  }
  return url;
}
