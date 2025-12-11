"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { User, Loader, Edit, Package, ArrowLeft } from "lucide-react";
import { getOrder } from "@/lib/appClient";

const statusColors: Record<string, { bg: string; text: string; badge: string }> = {
  pending_payment: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-200", badge: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" },
  paid: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-200", badge: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" },
  processing: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-200", badge: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" },
  shipped: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-200", badge: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" },
  delivered: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-200", badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-200", badge: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" },
  refunded: { bg: "bg-gray-100 dark:bg-gray-800/20", text: "text-gray-700 dark:text-gray-300", badge: "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
};

const statusEmojis: Record<string, string> = {
  pending_payment: "⏳",
  paid: "✅",
  processing: "🔄",
  shipped: "📦",
  delivered: "🎉",
  cancelled: "❌",
  refunded: "💸",
};


// Use local Order interface from orders/page.tsx
interface BuyerProfile {
  id: number;
  user_id: number;
  username: string;
  email: string;
  profile_photo?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
}

interface Buyer {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  is_verified?: boolean;
  join_date?: string;
  artist_profile?: any;
  buyer_profile?: BuyerProfile;
  admin_profile?: any;
}

interface Artwork {
  id: number;
  artist_id: number;
  artist_name: string;
  title: string;
  slug: string;
  category: string;
  medium: string;
  price: string;
  is_available: boolean;
  main_image?: string;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: number;
  artwork: Artwork;
  price: string;
  quantity: number;
}

interface Order {
  id: number;
  buyer_name: string;
  buyer?: Buyer;
  order_number: string;
  status: "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  total_amount: string;
  subtotal?: string;
  shipping_fee?: string;
  commission?: string;
  shipping_address?: string;
  tracking_number?: string;
  payment_method?: string;
  payment_reference?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
  items_count: number;
  items?: OrderItem[];
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const data = await getOrder(Number(orderId));
        // Map API OrderDTO to local Order type
        const mappedOrder: Order = {
          ...data,
          buyer: data.buyer ? {
            ...data.buyer,
            email: data.buyer.email || '',
            first_name: data.buyer.first_name || '',
            last_name: data.buyer.last_name || '',
            role: data.buyer.role || '',
            phone: data.buyer.phone ?? undefined,
            join_date: data.buyer.join_date ?? undefined,
          } : undefined,
          buyer_name: data.buyer?.first_name && data.buyer?.last_name ? `${data.buyer.first_name} ${data.buyer.last_name}` : data.buyer?.username || '',
          items_count: data.items ? data.items.length : 0,
          status: data.status as Order["status"],
          total_amount: String(data.total_amount),
          subtotal: data.subtotal ? String(data.subtotal) : undefined,
          shipping_fee: data.shipping_fee ? String(data.shipping_fee) : undefined,
          shipping_address: data.shipping_address ?? undefined,
          commission: undefined, // Not present in API, set as needed
          tracking_number: data.tracking_number ?? undefined,
          payment_method: data.payment_method ?? undefined,
          payment_reference: data.payment_reference ?? undefined,
          admin_notes: data.admin_notes ?? undefined,
          created_at: data.created_at || '',
          updated_at: data.updated_at,
          items: data.items as any, // Accept as is for now
        };
        setOrder(mappedOrder);
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="text-center text-red-600 py-12">{error || "Order not found."}</div>
    );
  }

  return (
    <div className="p-8 space-y-8 w-full mx-auto bg-white dark:bg-gray-900 min-h-[90vh] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Orders</span>
        </button>
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold ${(statusColors[order.status] || statusColors.pending_payment).badge} border border-gray-200 dark:border-gray-700`}>
          <span className="text-lg">{statusEmojis[order.status] || '❓'}</span>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Info */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-7 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>Order</span>
              <span className="text-gray-400">#</span>{order.order_number}
            </h1>
            <div className="flex flex-col gap-3 text-gray-700 dark:text-gray-300 text-base">
              <div className="flex justify-between items-center"><span className="font-medium">Order Date</span><span>{new Date(order.created_at).toLocaleString()}</span></div>
              <div className="flex justify-between items-center"><span className="font-medium">Total Amount</span><span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">${order.total_amount}</span></div>
              <div className="flex justify-between items-center"><span>Subtotal</span><span>${order.subtotal || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Shipping Fee</span><span>${order.shipping_fee || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Commission</span><span>${order.commission || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Tracking Number</span><span>{order.tracking_number || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Payment Method</span><span>{order.payment_method || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Payment Reference</span><span>{order.payment_reference || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Admin Notes</span><span>{order.admin_notes || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Last Updated</span><span>{order.updated_at ? new Date(order.updated_at).toLocaleString() : '-'}</span></div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-base font-bold mb-3 text-gray-900 dark:text-white">Shipping Address</h3>
            <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-300 text-base">
              <div className="flex justify-between items-center"><span>Phone</span><span>{order.buyer?.phone || order.buyer?.buyer_profile?.phone || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Address</span><span>{order.buyer?.buyer_profile?.address || order.shipping_address || '-'}</span></div>
              <div className="flex justify-between items-center"><span>City</span><span>{order.buyer?.buyer_profile?.city || '-'}</span></div>
              <div className="flex justify-between items-center"><span>Country</span><span>{order.buyer?.buyer_profile?.country || '-'}</span></div>
            </div>
          </div>

          {/* Buyer Details */}
          {order.buyer && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-7 border border-gray-200 dark:border-gray-700 shadow-sm flex gap-4 items-center">
              {order.buyer.buyer_profile?.profile_photo ? (
                <img src={order.buyer.buyer_profile.profile_photo} alt="Buyer" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl text-gray-400 font-bold">{order.buyer.first_name?.[0] || ''}{order.buyer.last_name?.[0] || ''}</div>
              )}
              <div>
                <div className="font-bold text-base text-gray-900 dark:text-white">{order.buyer.first_name} {order.buyer.last_name} <span className="text-gray-400">({order.buyer.username})</span></div>
                <div className="text-sm text-gray-500">{order.buyer.email}</div>
                <div className="text-sm text-gray-500">{order.buyer.phone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Items */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-7 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white tracking-tight">Order Items</h3>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center border rounded-lg p-3 bg-white dark:bg-gray-900">
                    {item.artwork?.main_image ? (
                      <img src={item.artwork.main_image} alt={item.artwork.title} className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl text-gray-400 font-bold">
                        <Package className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-base text-gray-900 dark:text-white">{item.artwork?.title}</div>
                      <div className="text-sm text-gray-500">Artist: {item.artwork?.artist_name}</div>
                      <div className="text-sm text-gray-500">Category: {item.artwork?.category}</div>
                      <div className="text-sm text-gray-500">Medium: {item.artwork?.medium}</div>
                      <div className="text-sm text-gray-500">Price: <span className="font-semibold text-emerald-700 dark:text-emerald-400">${item.price}</span></div>
                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No items found.</div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Created</span>
              <span className="text-gray-900 dark:text-gray-100">
                {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {order.updated_at && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date(order.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
