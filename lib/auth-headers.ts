import { tokenManager } from './token-manager' 

export function authHeaders(includeContentType = false): Record<string, string> {
  let token: string | null = null;

  try {
    token = tokenManager?.getAccessToken?.() ?? null;
  } catch {
    token = null;
  }

  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

export default authHeaders;
