/**
 * Constructs a full URL based on environment
 * In development, uses NEXT_PUBLIC_VERCEL_URL directly
 * In production, ensures https:// protocol
 */
export const getUrl = (path: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_VERCEL_URL environment variable is not defined");
  }

  // Remove leading slash from path if it exists to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (process.env.NODE_ENV === "development") {
    return `${baseUrl}/${cleanPath}`;
  }

  // In production, ensure we use https://
  const url = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
  return `${url}/${cleanPath}`;
};
