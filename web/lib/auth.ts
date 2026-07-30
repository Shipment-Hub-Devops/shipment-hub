import { User } from './types';

const TOKEN_KEY = 'shipmenthub_token';
const USER_KEY = 'shipmenthub_user';

export const getToken = (): string | null =>
  typeof window === 'undefined'
    ? null
    : window.localStorage.getItem(TOKEN_KEY);

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  try {
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const storeSession = (token: string, user: User): void => {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = (): void => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};