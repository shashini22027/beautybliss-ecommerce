/**
 * Backend base URL for resolving uploaded image paths.
 * In production, images are served from the Railway backend.
 * Locally, the Vite dev server proxy handles /uploads paths.
 */
const BACKEND_URL = 'https://beautybliss-ecommerce-production.up.railway.app';

/**
 * Prepends the backend URL to relative image paths (e.g. /uploads/...).
 * Leaves absolute URLs (http/https/data) and empty values unchanged.
 *
 * @param {string} path - The image path to resolve
 * @returns {string} The fully-qualified image URL
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `${BACKEND_URL}${path}`;
};

export default BACKEND_URL;
