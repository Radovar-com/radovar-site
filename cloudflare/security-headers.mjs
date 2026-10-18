// Complements the export's per-document meta CSP with defenses that require
// actual response headers. It grants no new script or collector permission.
export const SECURITY_HEADERS = Object.freeze({
  'Content-Security-Policy': "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'; upgrade-insecure-requests",
  // Subdomains are excluded until their HTTPS coverage is separately verified.
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
});

export function withSecurityHeaders(response) {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    // Multiple CSP policies are enforced together; never replace an upstream
    // policy that may restrict scripts more tightly than this header adapter.
    if (name === 'Content-Security-Policy' && secured.headers.has(name)) secured.headers.append(name, value);
    else secured.headers.set(name, value);
  }
  return secured;
}
