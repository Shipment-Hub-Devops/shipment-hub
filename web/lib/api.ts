import axios from 'axios';
import { getToken } from './auth';

// `??` rather than `||` so an explicitly empty NEXT_PUBLIC_API_URL is honoured
// and produces a relative base ("/api/v1"). In production the frontend and the
// API are served from the same origin behind nginx, so a relative path keeps
// the container image portable — nothing environment-specific is baked into
// the bundle, which matters because NEXT_PUBLIC_* values are inlined at build
// time and cannot be changed afterwards. Unset still falls back to localhost
// for local development.
const baseURL =
  (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000') + '/api/v1';

// Authenticated client — attaches the stored JWT to every request.
export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public client — used for unauthenticated endpoints such as tracking.
export const publicApi = axios.create({ baseURL });
