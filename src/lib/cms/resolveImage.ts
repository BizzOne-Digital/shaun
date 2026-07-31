/**
 * Resolve CMS / content image URLs for the storefront.
 * - `/api/uploads/...` → MongoDB-backed (Vercel-safe)
 * - legacy `/uploads/...` disk paths → safe static fallback (those files don't exist on Vercel)
 * - everything else (e.g. `/studio/...`, `/brand/...`) → unchanged
 */
export function resolveCmsImage(
  url: string | null | undefined,
  fallback = "/brand/logo.png",
): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("/api/uploads/")) {
    // Block obvious path traversal in stored CMS strings
    if (trimmed.includes("..")) return fallback;
    return trimmed;
  }

  // Old local-disk uploads — do not serve broken paths after Vercel deploy
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    return fallback;
  }

  return trimmed;
}
