// services/apiService.ts
import appClient from '@/lib/appClient';

// User Management
export const userService = {
  // Get current user
  getCurrentUser: () => appClient.get('/auth/me/'),
  
  // Update current user
  updateCurrentUser: (data: any) => appClient.patch('/auth/me/', data),
  
  // Change password
  changePassword: (data: { old_password: string; new_password: string; new_password2: string }) =>
    appClient.post('/auth/change-password/', data),
};

// Artist Management
export const artistService = {
  // Get current artist's profile
  getMyProfile: () => appClient.get('/profiles/artist/'),
  
  // Update artist profile
  updateProfile: (data: any) => appClient.patch('/profiles/artist/', data),
  
  // Get public artist profile
  getPublicProfile: (userId: number) => appClient.get(`/profiles/artist/${userId}/`),
  
  // List all verified artists
  listArtists: (params?: any) => appClient.get('/artists/', params),
  
  // Get artist's artworks
  getMyArtworks: () => appClient.get('/artworks/my-artworks/'),
};

// Buyer Management
export const buyerService = {
  // Get current buyer's profile
  getMyProfile: () => appClient.get('/profiles/buyer/'),
  
  // Update buyer profile
  updateProfile: (data: any) => appClient.patch('/profiles/buyer/', data),
};

// Artwork Management
export const artworkService = {
  // List artworks (public or filtered)
  listArtworks: (params?: {
    category?: string;
    medium?: string;
    artist?: number;
    search?: string;
    ordering?: string;
    page?: number;
  }) => appClient.get('/artworks/', params),
  
  // Get artwork details
  getArtwork: (id: number) => appClient.get(`/artworks/${id}/`),
  
  // Create artwork
  createArtwork: (data: FormData) => appClient.post('/artworks/', data),
  
  // Update artwork
  updateArtwork: (id: number, data: any) => appClient.patch(`/artworks/${id}/`, data),
  
  // Delete artwork
  deleteArtwork: (id: number) => appClient.del(`/artworks/${id}/`),
  
  // Submit for review
  submitForReview: (id: number) => appClient.post(`/artworks/${id}/submit/`),
  
  // Update status (admin only)
  updateStatus: (id: number, data: { status: string; admin_comment?: string }) =>
    appClient.patch(`/artworks/${id}/update-status/`, data),
};

// Order Management
export const orderService = {
  // List orders
  listOrders: (params?: any) => appClient.get('/orders/', params),
  
  // Get my orders
  getMyOrders: () => appClient.get('/orders/my-orders/'),
  
  // Get order details
  getOrder: (id: number) => appClient.get(`/orders/${id}/`),
  
  // Create order
  createOrder: (data: {
    items: Array<{ artwork_id: number; quantity: number }>;
    shipping_address: string;
    shipping_fee?: number;
  }) => appClient.post('/orders/', data),
  
  // Update order status (admin only)
  updateOrderStatus: (id: number, data: { status: string; tracking_number?: string; admin_notes?: string }) =>
    appClient.patch(`/orders/${id}/update-status/`, data),
};

// Payment Management
export const paymentService = {
  // Initiate payment
  initiatePayment: (orderId: number, data: { payment_method: string }) =>
    appClient.post(`/payments/initiate/${orderId}/`, data),
  
  // Get my payments
  getMyPayments: () => appClient.get('/payments/my-payments/'),
  
  // Get payment details
  getPayment: (id: number) => appClient.get(`/payments/${id}/`),
};

// Admin Management
export const adminService = {
  // Get all users (admin only)
  // The backend may not expose `/admin/users/`. Try admin endpoint first, fall back to public endpoints.
  getUsers: async (params?: any) => {
    // If caller is asking for artists, use the public `/artists/` endpoint (per Swagger)
    const role = params?.role;
    if (role === 'artist') {
      return await appClient.get('/artists/', params);
    }

    // For other roles, prefer admin endpoint only if current user is admin
    try {
      const current = appClient.getStoredUser && appClient.getStoredUser();
      if (current?.role === 'admin') {
        return await appClient.get('/admin/users/', params);
      }
      // Non-admins cannot list users; return empty paginated response
      return { count: 0, next: null, previous: null, results: [] };
    } catch (e: any) {
      return { count: 0, next: null, previous: null, results: [] };
    }
  },

  // Get user details (admin endpoint preferred)
  getUser: async (id: number) => {
    try {
      return await appClient.get(`/admin/users/${id}/`);
    } catch (e) {
      // fallback: try to fetch public artist profile by user id
      try { return await appClient.get(`/profiles/artist/${id}/`); } catch { throw e; }
    }
  },

  // Update user (admin)
  updateUser: async (id: number, data: any) => {
    try {
      return await appClient.patch(`/admin/users/${id}/`, data);
    } catch (e) {
      // fallback: if updating own profile, use /auth/me/
      throw e;
    }
  },

  // Create user (admin)
  createUser: async (data: any) => {
    try {
      return await appClient.post('/admin/users/', data);
    } catch (e) {
      throw e;
    }
  },

  // Verify/unverify artist: accepts { verified_by_admin: boolean }
  verifyArtist: async (userId: number, verified: boolean) => {
    try {
      return await appClient.patch(`/admin/artists/${userId}/verify/`, { verified_by_admin: verified });
    } catch (e) {
      // try to patch artist profile as a fallback
      try {
        return await appClient.patch(`/profiles/artist/${userId}/`, { verified_by_admin: verified });
      } catch (inner) {
        throw e;
      }
    }
  },
  
  // Get dashboard stats
  getDashboardStats: () => appClient.get('/admin/dashboard/stats/'),
};