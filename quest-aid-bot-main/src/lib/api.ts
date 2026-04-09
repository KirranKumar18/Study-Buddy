/**
 * Authenticated API client with automatic token refresh on 401 responses.
 * Use this instead of raw `fetch` for all API calls to protected endpoints.
 */

let getAccessToken: () => string | null = () => null;
let refreshAccessToken: () => Promise<string | null> = async () => null;
let onAuthFailure: () => void = () => {};

/**
 * Initialize the API client with auth functions from the AuthContext.
 * Called once from AuthProvider or App component.
 */
export function initApiClient(
  getToken: () => string | null,
  refreshToken: () => Promise<string | null>,
  onFailure: () => void
) {
  getAccessToken = getToken;
  refreshAccessToken = refreshToken;
  onAuthFailure = onFailure;
}

/**
 * Authenticated fetch wrapper.
 * - Automatically attaches Authorization header
 * - On 401, attempts to refresh the token and retry once
 * - On double 401, triggers logout
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(url, { ...options, headers });

  // If unauthorized, try refreshing the token
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, { ...options, headers });
      
      // If still unauthorized after refresh, force logout
      if (response.status === 401) {
        onAuthFailure();
      }
    } else {
      onAuthFailure();
    }
  }

  return response;
}
