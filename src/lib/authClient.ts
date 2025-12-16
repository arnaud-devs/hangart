const loginPath = '/api/auth/login/';
const registerPath = '/api/auth/register/';

export async function login(payload: { username?: string;  password: string }) {
  const res = await fetch(loginPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.message || 'Login failed');
  }
  return data;
}

export async function register(payload: {
  username: string;
  email: string;
  password: string;
  password2: string;
  role: 'artist' | 'buyer';
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  const res = await fetch(registerPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.message || 'Register failed');
  }
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch('/api/auth/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  const data = await res.json();
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.message || 'Token refresh failed');
  }
  return data; // access token also set as cookie by server
}

export async function getMe() {
  const res = await fetch('/api/auth/me/', { method: 'GET' });
  const data = await res.json();
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.message || 'Fetch user failed');
  }
  return data;
}

export async function getArtistProfile() {
  const res = await fetch('/api/profiles/artist/', { method: 'GET' });
  const data = await res.json();
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.message || 'Fetch artist profile failed');
  }
  return data;
}

export async function patchArtistProfile(payload: Record<string, any>) {
  const res = await fetch('/api/profiles/artist/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.message || 'Update artist profile failed');
  }
  return data;
}

export async function getBuyerProfile() {
  const res = await fetch('/api/profiles/buyer/', { method: 'GET' });
  const data = await res.json();
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.message || 'Fetch buyer profile failed');
  }
  return data;
}

export async function patchBuyerProfile(payload: Record<string, any>) {
  const res = await fetch('/api/profiles/buyer/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.message || 'Update buyer profile failed');
  }
  return data;
}

import { get } from './appClient';

export async function getPublicArtistProfile(userId: string) {
  // Use the real API endpoint, not the local proxy
  return get(`/profiles/artist/${encodeURIComponent(userId)}/`);
}

export async function logout() {
  // Clear server-side cookies
  await fetch('/api/auth/logout/', { method: 'DELETE' });
  // Clear client-side markers or refresh token storage
  try {
    localStorage.removeItem('refresh');
    localStorage.removeItem('auth_ok');
    localStorage.removeItem('user');
  } catch {}
}
