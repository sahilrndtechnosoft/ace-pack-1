/**
 * Percent-encodes each segment of a site-relative file path. Uploaded/crawled blog images have
 * names with spaces, commas and brackets, and the live server 404s on a raw comma in the path.
 * Absolute URLs and data URIs pass through unchanged; already-encoded paths aren't double-encoded.
 */
export function encodeAssetPath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return path
    .split('/')
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        // A stray '%' that isn't an escape: encode the segment as-is.
        return encodeURIComponent(segment);
      }
    })
    .join('/');
}
