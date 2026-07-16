// Centralized SEO constants for consistent URL handling
// IMPORTANT: Always use www. prefix for canonical URLs to avoid duplicate content issues

export const SEO_BASE_URL = "https://www.middasbuy.com";

// Helper function to generate full URL
export const getFullUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_BASE_URL}${normalizedPath}`;
};

// Helper function to generate canonical URL
export const getCanonicalUrl = (path?: string): string => {
  if (!path) return SEO_BASE_URL;
  return getFullUrl(path);
};
