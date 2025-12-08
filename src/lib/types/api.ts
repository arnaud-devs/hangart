export type Tokens = {
  access: string;
  refresh: string;
};

export type UserDTO = {
  id: number;
  username: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
  phone?: string | null;
  is_verified?: boolean;
  join_date?: string | null;
  // nested profiles may exist depending on endpoint
  artist_profile?: any;
  buyer_profile?: any;
};

export type ArtistProfileDTO = {
  id: number;
  bio?: string | null;
  profile_photo?: string | null;
  website?: string | null;
  specialization?: string | null;
  experience_years?: number | null;
  phone?: string | null;
  email?: string | null;
  country?: string | null;
  city?: string | null;
  verified_by_admin?: boolean;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  password2: string;
  role: 'artist' | 'buyer';
  first_name?: string;
  last_name?: string;
  phone?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type Paginated<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
};

export type ArtworkListItem = {
  id: number;
  artist_id: number;
  artist_name?: string;
  title: string;
  slug?: string;
  category?: string | null;
  medium?: string | null;
  price?: string | number;
  is_available?: boolean;
  main_image?: string | null;
  status?: string;
  created_at?: string;
};

export type ArtworkDTO = {
  id: number;
  artist: UserDTO;
  title: string;
  slug?: string;
  description?: string;
  category?: string | null;
  medium?: string | null;
  width_cm?: string | number | null;
  height_cm?: string | number | null;
  depth_cm?: string | number | null;
  creation_year?: number | null;
  price: string | number;
  is_available: boolean;
  main_image?: string | null;
  additional_images?: string[] | null;
  status?: string;
  admin_comment?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ArtworkCreatePayload = {
  title: string;
  description?: string;
  category?: string;
  medium?: string;
  width_cm?: number | string;
  height_cm?: number | string;
  depth_cm?: number | string;
  creation_year?: number;
  price: number | string;
  is_available?: boolean;
  main_image?: File | null; // Use FormData when posting
  additional_images?: string[] | null;
};

export type ArtworkStatusUpdate = {
  status: 'approved' | 'rejected' | 'archived';
  admin_comment?: string;
};

export type BuyerProfileDTO = {
  id: number;
  profile_photo?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  date_of_birth?: string | null;
};

export type AdminProfileDTO = {
  id: number;
  employee_id: string;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type AdminUserCreatePayload = {
  username: string;
  email?: string;
  password?: string;
  role: 'artist' | 'buyer' | 'admin';
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_staff?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
};

export type AdminUserUpdatePayload = Partial<AdminUserCreatePayload & { password?: string }>;

export type OrderItemDTO = {
  id: number;
  artwork: {
    id: number;
    title: string;
    artist_name?: string;
    price: string | number;
    main_image?: string | null;
    status?: string;
  };
  price: string | number;
  quantity: number;
};

export type OrderDTO = {
  id: number;
  buyer: UserDTO;
  order_number: string;
  payment_method?: string | null;
  payment_reference?: string | null;
  status: string;
  subtotal: string | number;
  shipping_fee?: string | number | null;
  total_amount: string | number;
  shipping_address?: string | null;
  tracking_number?: string | null;
  admin_notes?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: OrderItemDTO[];
};

export type OrderCreatePayload = {
  items: { artwork_id: number; quantity: number }[];
  shipping_address: string;
  shipping_fee?: number | string;
};

export type PaymentDTO = {
  id: number;
  order: { id: number; order_number: string; status: string; total_amount: string | number };
  user: UserDTO;
  payment_method: string;
  amount: string | number;
  transaction_id: string;
  provider_response?: any;
  status: string;
  created_at?: string;
  updated_at?: string;
  logs?: { id: number; message: string; timestamp: string }[];
};

export type PaymentInitiatePayload = {
  payment_method: string;
};

