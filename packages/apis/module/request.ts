import { extend } from 'umi-request';

declare global {
  interface Window {
    __APP_AUTH_TOKEN__?: string;
  }
}

const request = extend({
  credentials: 'include',
});

request.interceptors.request.use((url, options) => {
  const accessToken = typeof window !== 'undefined' ? window.__APP_AUTH_TOKEN__ : '';

  return {
    url,
    options: {
      ...options,
      headers: {
        ...(options?.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    },
  };
});

request.interceptors.response.use((response) => {
  if (response.status === 401) {
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.__APP_AUTH_TOKEN__ = '';
      window.location.href = '/login';
    }
  }
  return response;
});

export { request };
