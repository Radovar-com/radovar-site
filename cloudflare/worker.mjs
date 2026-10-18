import { withSecurityHeaders } from './security-headers.mjs';

// The origin still serves its original HTML, assets, redirects and cache policy.
export default {
  async fetch(request) {
    return withSecurityHeaders(await fetch(request));
  },
};
