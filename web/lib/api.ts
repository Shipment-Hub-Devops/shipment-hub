import axios from 'axios';
import { getToken } from './auth';

const baseURL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/v1';

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