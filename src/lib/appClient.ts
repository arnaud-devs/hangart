// Admin: List all payments (paginated, with filters)
export async function listPayments(params?: Record<string, any>): Promise<any> {
  return get('/payments/', params);
}
export { appClient };
// Check payment status by payment reference
// Duplicate checkPaymentStatus removed. Use the main implementation below.
// lib/appClient.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://hangart.pythonanywhere.com/api';

type FetchOpts = RequestInit & { retry?: boolean };

// Storage utilities
function storageGet(key: string) {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(key); } catch { return null; }
}

function storageSet(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, value); } catch {}
}

function storageRemove(key: string) {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(key); } catch {}
}

// Token refresh function
export async function refreshAccessToken(): Promise<boolean> {
  const refresh = storageGet('refreshToken');
  if (!refresh) return false;
  
  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    
    if (!res.ok) return false;
    
    const data = await res.json();
    if (data?.access) {
      storageSet('accessToken', data.access);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Token refresh failed:', e);
    return false;
  }
}

// Helper function to build URL with query parameters
function buildUrl(path: string, params?: Record<string, any>): string {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  
  if (!params) return url;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

// Main API fetch function
let redirectingToLogin = false;
async function apiFetch(path: string, opts: FetchOpts = {}, params?: Record<string, any>) {
  const url = buildUrl(path, params);
  const access = storageGet('accessToken');
  
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> || {}),
  };
  
  if (access) {
    headers['Authorization'] = `Bearer ${access}`;
  }
  
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...opts,
      headers,
    });

    // Handle token expiration
    if (response.status === 401 && !opts.retry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return apiFetch(path, { ...opts, retry: true }, params);
      } else {
        clearAuthStorage();
        // Avoid redirect loop when already on login page or during redirect
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname || '/';
          const isOnAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/signup');
          if (!isOnAuthPage && !redirectingToLogin) {
            redirectingToLogin = true;
            const params = new URLSearchParams();
            if (currentPath && currentPath !== '/login') {
              params.set('redirect', currentPath + (window.location.search || ''));
            }
            const target = '/login' + (params.toString() ? `?${params.toString()}` : '');
            try { window.location.assign(target); } catch { window.location.href = target; }
          }
        }
        throw new Error('Authentication failed');
      }
    }

    const text = await response.text();
    let json: any = null;
    try { 
      json = text ? JSON.parse(text) : null; 
    } catch { 
      json = text; 
    }

    if (!response.ok) {
      const error: any = new Error(
        json?.detail || 
        json?.message || 
        json?.error || 
        response.statusText || 
        'Request failed'
      );
      error.status = response.status;
      error.body = json;
      throw error;
    }

    return json;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Network error occurred');
  }
}

// HTTP methods with query parameter support
export const get = (path: string, params?: Record<string, any>) => 
  apiFetch(path, { method: 'GET' }, params);

export const post = (path: string, body?: any, params?: Record<string, any>) => 
  apiFetch(path, { 
    method: 'POST', 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }, params);

export const put = (path: string, body?: any, params?: Record<string, any>) => 
  apiFetch(path, { 
    method: 'PUT', 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }, params);

export const patch = (path: string, body?: any, params?: Record<string, any>) => 
  apiFetch(path, { 
    method: 'PATCH', 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }, params);

export const del = (path: string, params?: Record<string, any>) => 
  apiFetch(path, { method: 'DELETE' }, params);

// Auth utilities
export function clearAuthStorage() {
  storageRemove('accessToken');
  storageRemove('refreshToken');
  storageRemove('user');
}

export function saveTokens(access?: string, refresh?: string) {
  if (access) storageSet('accessToken', access);
  if (refresh) storageSet('refreshToken', refresh);
}

export function getStoredUser() {
  const userStr = storageGet('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function storeUser(user: any) {
  storageSet('user', JSON.stringify(user));
}

// ...existing code...

// Artwork helpers
import type {
  ArtworkListItem,
  ArtworkDTO,
  ArtworkCreatePayload,
  ArtworkStatusUpdate,
  Paginated,
  UserDTO,
  AdminUserCreatePayload,
  AdminUserUpdatePayload,
  ArtistProfileDTO,
  BuyerProfileDTO,
  AdminProfileDTO,
  RegisterPayload,
  LoginPayload,
  Tokens,
  OrderDTO,
  OrderCreatePayload,
} from './types/api';

export async function listArtworks(params?: Record<string, any>): Promise<ArtworkListItem[] | Paginated<ArtworkListItem>> {
  return get('/artworks/', params) as Promise<ArtworkListItem[] | Paginated<ArtworkListItem>>;
}

export async function getArtwork(id: number): Promise<ArtworkDTO> {
  return get(`/artworks/${id}/`) as Promise<ArtworkDTO>;
}

export async function createArtwork(payload: ArtworkCreatePayload | FormData): Promise<ArtworkDTO> {
  if (payload instanceof FormData) {
    return post('/artworks/', payload);
  }
  // convert to FormData because main_image must be uploaded
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
    else fd.append(k, String(v));
  });
  return post('/artworks/', fd);
}

export async function updateArtwork(id: number, payload: Partial<ArtworkCreatePayload> | FormData): Promise<ArtworkDTO> {
  // If payload is FormData (file upload / multipart), send as-is.
  if (payload instanceof FormData) {
    return patch(`/artworks/${id}/`, payload);
  }

  // For JSON payloads, ensure non-admin clients cannot change admin-only fields.
  // Remove fields that only admins should control: `status`, `admin_comment`, and `slug`.
  const user = getStoredUser && getStoredUser();
  const isAdmin = user?.role === 'admin';

  const safePayload: Record<string, any> = {};
  if (payload && typeof payload === 'object') {
    Object.entries(payload as Record<string, any>).forEach(([k, v]) => {
      // strip admin-only keys for non-admins
      if (!isAdmin && (k === 'status' || k === 'admin_comment' || k === 'slug')) return;
      safePayload[k] = v;
    });
  }

  return patch(`/artworks/${id}/`, safePayload as any);
}

export async function deleteArtwork(id: number): Promise<void> {
  await del(`/artworks/${id}/`);
}

export async function getMyArtworks(): Promise<Paginated<ArtworkListItem> | ArtworkListItem[]> {
  return get('/artworks/my-artworks/');
}

export async function submitArtworkForReview(id: number): Promise<ArtworkDTO> {
  return post(`/artworks/${id}/submit/`);
}

export async function updateArtworkStatus(id: number, payload: ArtworkStatusUpdate): Promise<ArtworkDTO> {
  return patch(`/artworks/${id}/update-status/`, payload);
}

export { apiFetch as rawFetch };

// Admin / User helpers
export async function listUsers(params?: Record<string, any>): Promise<UserDTO[] | Paginated<UserDTO>> {
  // If caller is requesting artists specifically, use the public artists endpoint
  if (params && params.role === 'artist') {
    // Return artist profiles (verified artists) from public endpoint
    return get('/artists/', params) as Promise<UserDTO[] | Paginated<UserDTO>>;
  }

  const user = getStoredUser && getStoredUser();
  if (user?.role === 'admin') {
    // Admin endpoints may exist on some deployments; prefer admin listing when admin
    return get('/admin/users/', params) as Promise<UserDTO[] | Paginated<UserDTO>>;
  }

  // For non-admins, only artist listing is allowed via public endpoint
  throw new Error('Forbidden: admin only');
}

export async function getUser(id: number): Promise<UserDTO> {
  const user = getStoredUser && getStoredUser();
  if (user?.role === 'admin') {
    return get(`/admin/users/${id}/`) as Promise<UserDTO>;
  }
  // Fallback: try to read public artist profile if available
  return get(`/profiles/artist/${id}/`) as Promise<any>;
}

export async function createUser(payload: AdminUserCreatePayload | FormData): Promise<UserDTO> {
  const user = getStoredUser && getStoredUser();
  if (user?.role !== 'admin') throw new Error('Forbidden: admin only');
  if (payload instanceof FormData) return post('/admin/users/', payload);
  return post('/admin/users/', payload);
}

export async function updateUser(id: number, payload: AdminUserUpdatePayload | FormData): Promise<UserDTO> {
  const user = getStoredUser && getStoredUser();
  if (user?.role !== 'admin') throw new Error('Forbidden: admin only');
  if (payload instanceof FormData) return patch(`/admin/users/${id}/`, payload);
  return patch(`/admin/users/${id}/`, payload as any) as Promise<UserDTO>;
}

export async function deleteUser(id: number): Promise<void> {
  const user = getStoredUser && getStoredUser();
  if (user?.role !== 'admin') throw new Error('Forbidden: admin only');
  await del(`/admin/users/${id}/`);
}

// Admin artist/buyer/admin-profile management
export async function listAdminArtists(params?: Record<string, any>): Promise<ArtistProfileDTO[] | Paginated<ArtistProfileDTO>> {
  return get('/artists/', params) as Promise<ArtistProfileDTO[] | Paginated<ArtistProfileDTO>>;
}

export async function getAdminArtist(id: number): Promise<ArtistProfileDTO> {
  return get(`/artists/${id}/`) as Promise<ArtistProfileDTO>;
}

export async function verifyArtistByAdmin(id: number, verified: boolean): Promise<ArtistProfileDTO> {
  return patch(`/artists/${id}/verify/`, { verified_by_admin: verified });
}

export async function listAdminBuyers(params?: Record<string, any>): Promise<BuyerProfileDTO[] | Paginated<BuyerProfileDTO>> {
  return get('/buyers/', params) as Promise<BuyerProfileDTO[] | Paginated<BuyerProfileDTO>>;
}

export async function listAdminAdmins(params?: Record<string, any>): Promise<AdminProfileDTO[] | Paginated<AdminProfileDTO>> {
  const user = getStoredUser && getStoredUser();
  if (user?.role === 'admin') {
    return get('/admin/admins/', params) as Promise<AdminProfileDTO[] | Paginated<AdminProfileDTO>>;
  }
  throw new Error('Forbidden: admin only');
}

// Authentication helpers (Auth endpoints)
export async function register(payload: RegisterPayload): Promise<{ user: UserDTO; tokens: Tokens }> {
  return post('/auth/register/', payload) as Promise<{ user: UserDTO; tokens: Tokens }>;
}

export async function login(payload: LoginPayload): Promise<Tokens> {
  return post('/auth/login/', payload) as Promise<Tokens>;
}

export async function tokenRefresh(refresh: string): Promise<{ access: string }> {
  return post('/auth/token/refresh/', { refresh }) as Promise<{ access: string }>;
}

export async function getMe(): Promise<UserDTO> {
  return get('/auth/me/') as Promise<UserDTO>;
}

export async function updateMe(payload: Partial<UserDTO>): Promise<UserDTO> {
  return patch('/auth/me/', payload as any) as Promise<UserDTO>;
}

export async function changePassword(old_password: string, new_password: string, new_password2: string) {
  return post('/auth/change-password/', { old_password, new_password, new_password2 });
}

// Profile endpoints
export async function getArtistProfile(): Promise<ArtistProfileDTO> {
  return get('/profiles/artist/') as Promise<ArtistProfileDTO>;
}

export async function updateArtistProfile(payload: FormData | Partial<ArtistProfileDTO>): Promise<ArtistProfileDTO> {
  if (payload instanceof FormData) return patch('/profiles/artist/', payload);
  return patch('/profiles/artist/', payload as any) as Promise<ArtistProfileDTO>;
}

export async function getPublicArtistProfile(userId: number): Promise<ArtistProfileDTO> {
  return get(`/profiles/artist/${userId}/`) as Promise<ArtistProfileDTO>;
}

export async function getBuyerProfile(): Promise<BuyerProfileDTO> {
  return get('/profiles/buyer/') as Promise<BuyerProfileDTO>;
}

export async function updateBuyerProfile(payload: Partial<BuyerProfileDTO>): Promise<BuyerProfileDTO> {
  return patch('/profiles/buyer/', payload as any) as Promise<BuyerProfileDTO>;
}

// Orders
export async function listOrders(params?: Record<string, any>): Promise<OrderDTO[] | Paginated<OrderDTO>> {
  return get('/orders/', params) as Promise<OrderDTO[] | Paginated<OrderDTO>>;
}

export async function getOrder(id: number): Promise<OrderDTO> {
  return get(`/orders/${id}/`) as Promise<OrderDTO>;
}

export async function createOrder(payload: OrderCreatePayload): Promise<OrderDTO> {
  return post('/orders/', payload) as Promise<OrderDTO>;
}

export async function listMyOrders(): Promise<OrderDTO[] | Paginated<OrderDTO>> {
  return get('/orders/my-orders/');
}

export async function updateOrderStatus(id: number, payload: any): Promise<OrderDTO> {
  return patch(`/orders/${id}/update-status/`, payload);
}


// Cart
export async function getCart(): Promise<any> {
  return get('/cart/') as Promise<any>;
}

export async function addToCart(artworkId: number, quantity: number = 1): Promise<any> {
  return post('/cart/add/', { artwork_id: artworkId, quantity }) as Promise<any>;
}

export async function updateCartItem(artworkId: number, quantity: number): Promise<any> {
  return patch(`/cart/items/${artworkId}/`, { quantity }) as Promise<any>;
}

export async function removeFromCart(artworkId: number): Promise<any> {
  return del(`/cart/items/${artworkId}/`) as Promise<any>;
}

export async function clearCart(): Promise<any> {
  return post('/cart/clear/', {}) as Promise<any>;
}


// Payment-related interfaces
export interface PaymentInitiatePayload {
  payment_method: 'momo' | 'card' | 'paypal';
  phone_number?: string;
  currency?: string;
  payer_message?: string;
}

export interface PaymentResponse {
  success: boolean;
  payment: {
    id: number;
    order: {
      id: number;
      order_number: string;
      total_amount: string;
      currency: string;
    };
    payment_method: string;
    amount: string;
    phone?: string;
    transaction_id?: string;
    status: 'pending' | 'successful' | 'failed' | 'cancelled';
    created_at: string;
  };
  message: string;
  instructions?: string;
  client_secret?: string; // For Stripe
  approval_url?: string; // For PayPal
}

export interface PaymentStatusResponse {
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  payment: {
    id: number;
    transaction_id?: string;
    amount: string;
    phone?: string;
    status: 'pending' | 'successful' | 'failed' | 'cancelled';
    provider_response?: any;
  };
  order_updated?: {
    order_id: number;
    status: string;
    artworks_updated: number;
  };
  message: string;
}

export interface PaymentDTO {
  id: number;
  order: {
    id: number;
    order_number: string;
    total_amount: string;
    currency: string;
    status: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
  };
  payment_method: string;
  amount: string;
  phone?: string;
  transaction_id?: string;
  provider_response?: any;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
  logs?: Array<{
    id: number;
    message: string;
    timestamp: string;
  }>;
}

// ==================== PAYMENT FUNCTIONS ====================

/**
 * Initiate a payment for an order
 * POST /api/payments/initiate/<order_id>/
 */
export async function initiatePayment(
  orderId: number, 
  payload: PaymentInitiatePayload
): Promise<PaymentResponse> {
  return post(`/payments/initiate/${orderId}/`, payload) as Promise<PaymentResponse>;
}

/**
 * Check payment status and poll MTN MoMo API for updates
 * GET /api/payments/check/<payment_id>/
 * IMPORTANT: Frontend MUST poll this endpoint every 10-15 seconds after payment initiation
 */
export async function checkPaymentStatus(paymentReference: string): Promise<PaymentStatusResponse> {
  return get(`/payments/check/${paymentReference}/`) as Promise<PaymentStatusResponse>;
}

/**
 * Get payment transaction details
 * GET /api/payments/<id>/
 */
export async function getPayment(id: number): Promise<PaymentDTO> {
  return get(`/payments/${id}/`) as Promise<PaymentDTO>;
}

/**
 * Get all payments for authenticated user
 * GET /api/payments/my-payments/
 */
export async function listMyPayments(): Promise<PaymentDTO[] | Paginated<PaymentDTO>> {
  return get('/payments/my-payments/');
}

/**
 * Receive payment confirmation from gateways (admin/webhook use)
 * POST /api/payments/webhook/
 */
export async function paymentsWebhook(payload: any): Promise<any> {
  return post('/payments/webhook/', payload);
}

/**
 * MTN MoMo specific webhook (called by MTN API)
 * POST /api/payments/momo-webhook/
 */
export async function momoWebhook(payload: any): Promise<any> {
  return post('/payments/momo-webhook/', payload);
}

// Payments (add these to your imports above if needed)
// ...existing code...

// REMOVE OR COMMENT OUT THE DUPLICATE checkPaymentStatus function at line 1-3

// Update the appClient object to include all payment functions
const appClient = {
  apiFetch,
  get,
  post,
  put,
  patch,
  del,
  saveTokens,
  clearAuthStorage,
  refreshAccessToken,
  getStoredUser,
  storeUser,
  
  // === PAYMENT FUNCTIONS ===
  listPayments,
  initiatePayment,
  checkPaymentStatus, // This should be the one from line 415, not line 1
  getPayment,
  listMyPayments,
  paymentsWebhook,
  momoWebhook,
  
  // ... your other existing functions
  getBuyerProfile,
  updateBuyerProfile,
  listOrders,
  getOrder,
  createOrder,
  listMyOrders,
  updateOrderStatus,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  listArtworks,
  getArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getMyArtworks,
  submitArtworkForReview,
  updateArtworkStatus,
  rawFetch: apiFetch,
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  listAdminArtists,
  getAdminArtist,
  verifyArtistByAdmin,
  listAdminBuyers,
  listAdminAdmins,
  register,
  login,
  tokenRefresh,
  getMe,
  updateMe,
  changePassword,
  getArtistProfile,
  updateArtistProfile,
  getPublicArtistProfile,
};
