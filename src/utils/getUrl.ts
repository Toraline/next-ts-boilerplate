export const getUrl = (url) => {
  if (process.env.NODE_ENV === "development") {
    return `${process.env.NEXT_PUBLIC_VERCEL_URL}/${url}`;
  }

  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/${url}`;
};
