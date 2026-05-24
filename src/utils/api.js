const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const rawApiBaseUrl = import.meta.env.VITE_API_URL || '/api';

export const API_BASE_URL = trimTrailingSlash(rawApiBaseUrl);

export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;