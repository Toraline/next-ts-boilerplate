export function getClientIp(request: Request): string | null {
  const forwardedForHeader = request.headers.get("x-forwarded-for");
  if (forwardedForHeader) {
    const [ip] = forwardedForHeader.split(",").map((item) => item.trim());
    if (ip) return ip;
  }

  const realIpHeader = request.headers.get("x-real-ip");
  if (realIpHeader) return realIpHeader.trim();

  const cloudflareIpHeader = request.headers.get("cf-connecting-ip");
  if (cloudflareIpHeader) return cloudflareIpHeader.trim();

  return null;
}

export function getUserAgent(request: Request): string | null {
  return request.headers.get("user-agent");
}
