"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { appClient } from "@/lib/appClient";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/authProvider";
import { 
  FiArrowLeft, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiDollarSign,
  FiUser,
  FiPackage,
  FiFileText,
  FiCalendar,
  FiEdit,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiMessageSquare,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag
} from "react-icons/fi";
import Link from "next/link";
import UpdateRefundModal from "@/components/dashboard/UpdateRefundModal";

// Define types based on API response
interface RefundDetailDTO {
  id: number;
  order: number;
  order_details: {
    id: number;
    buyer_name: string;
    order_number: string;
    status: string;
    total_amount: string;
    created_at: string;
    items_count: number;
  };
  buyer: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone: string;
    is_verified: boolean;
    join_date: string;
    buyer_profile: {
      id: number;
      user_id: number;
      username: string;
      email: string;
      profile_photo: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      date_of_birth: string;
    };
  };
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  admin_response: string | null;
  reviewed_by_name: string | null;
  refund_amount: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "processed", label: "Processed", color: "bg-blue-100 text-blue-800" },
];

export default function RefundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [refund, setRefund] = useState<RefundDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [adminResponse, setAdminResponse] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const refundId = params.id as string;

  useEffect(() => {
    if (user?.role === 'admin' && refundId) {
      loadRefundDetails();
    }
  }, [user, refundId]);

  async function loadRefundDetails() {
    setLoading(true);
    try {
      const data = await appClient.getRefundRequest(parseInt(refundId));
      setRefund(data);
      if (data.admin_response) {
        setAdminResponse(data.admin_response);
      }
    } catch (error: any) {
      console.error("Failed to load refund details:", error);
      showToast("error", "Failed to load refund details", error.message || "Please try again");
      router.push("/dashboard/refunds");
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (!refund || !status || !adminResponse.trim()) {
      showToast("error", "All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await appClient.reviewRefundRequest(refund.id, {
        status: status as any,
        admin_response: adminResponse.trim(),
      });
      
      showToast("success", "Refund updated successfully");
      await loadRefundDetails();
      setShowUpdateModal(false);
      setStatus("");
      // Keep admin response for display
    } catch (error: any) {
      console.error("Failed to update refund:", error);
      showToast("error", "Failed to update refund", error.message || "Please try again");
    } finally {
      setSubmitting(false);
    }
  }

  const handleOpenUpdateModal = () => {
    if (refund) {
      setStatus(refund.status);
      setAdminResponse(refund.admin_response || "");
      setShowUpdateModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setStatus("");
    if (refund?.admin_response) {
      setAdminResponse(refund.admin_response);
    } else {
      setAdminResponse("");
    }
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'processed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'approved':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <FiXCircle className="w-4 h-4" />;
      case 'processed':
        return <FiCheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Get reason label
  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      'damaged': 'Item arrived damaged',
      'wrong_item': 'Incorrect item received',
      'not_as_described': 'Item differs from description',
      'changed_mind': 'Changed my mind',
      'other': 'Other reasons'
    };
    return labels[reason] || reason;
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading refund details...</p>
        </div>
      </div>
    );
  }

  if (!refund) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Refund not found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The refund request you're looking for doesn't exist.</p>
          <Link
            href="/dashboard/refunds"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Refunds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/refunds"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back to Refunds</span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Refund Request #{refund.id}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={getStatusBadge(refund.status)}>
                {getStatusIcon(refund.status)}
                {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
              </span>
              <button
                onClick={loadRefundDetails}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`rounded-xl p-4 mb-8 ${
            refund.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20' :
            refund.status === 'approved' ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20' :
            refund.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20' :
            'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                refund.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                refund.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                refund.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
              }`}>
                {getStatusIcon(refund.status)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {refund.status === 'pending' && 'Awaiting Review'}
                  {refund.status === 'approved' && 'Refund Approved'}
                  {refund.status === 'rejected' && 'Refund Rejected'}
                  {refund.status === 'processed' && 'Refund Processed'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {refund.status === 'pending' && 'This refund request is waiting for your review and decision.'}
                  {refund.status === 'approved' && 'This refund has been approved and is ready for processing.'}
                  {refund.status === 'rejected' && 'This refund request has been declined.'}
                  {refund.status === 'processed' && 'This refund has been completed and processed.'}
                </p>
                {refund.admin_response && (
                  <div className="mt-3 p-3 bg-white dark:bg-black/20 rounded-lg border dark:border-white/10">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{refund.admin_response}</p>
                    {refund.reviewed_by_name && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">— Reviewed by {refund.reviewed_by_name}</p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleOpenUpdateModal}
                className={`px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium ${
                  refund.status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  refund.status === 'approved' ? 'bg-green-600 hover:bg-green-700' :
                  refund.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <FiEdit className="w-4 h-4 inline-block mr-2" />
                {refund.status === 'pending' ? 'Review Request' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order & Buyer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Refund Details Card */}
            <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiFileText className="w-5 h-5 text-yellow-600" />
                Refund Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reason for Refund</label>
                    <p className="text-gray-900 dark:text-white font-medium">{getReasonLabel(refund.reason)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{refund.description}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Requested Amount</label>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(refund.refund_amount)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Requested Date</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(refund.created_at)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(refund.updated_at)}</p>
                  </div>
                  
                  {refund.reviewed_at && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reviewed Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(refund.reviewed_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiShoppingBag className="w-5 h-5 text-yellow-600" />
                Order Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Number</label>
                    <p className="text-gray-900 dark:text-white font-medium font-mono">{refund.order_details.order_number}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      refund.order_details.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {refund.order_details.status}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Total</label>
                    <p className="text-gray-900 dark:text-white">{formatCurrency(refund.order_details.total_amount)}</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Date</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(refund.order_details.created_at)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Items Count</label>
                    <p className="text-gray-900 dark:text-white">{refund.order_details.items_count} item(s)</p>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      href={`/dashboard/orders/${refund.order}`}
                      className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 font-medium"
                    >
                      View Order Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Buyer Info & Actions */}
          <div className="space-y-6">
            {/* Buyer Info Card */}
            <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-yellow-600" />
                Buyer Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {refund.buyer.buyer_profile?.profile_photo ? (
                      <img
                        src={refund.buyer.buyer_profile.profile_photo}
                        alt={refund.buyer.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {refund.buyer.first_name} {refund.buyer.last_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">@{refund.buyer.username}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span>{refund.buyer.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <FiPhone className="w-4 h-4 text-gray-400" />
                    <span>{refund.buyer.phone}</span>
                  </div>
                  
                  {refund.buyer.buyer_profile?.address && (
                    <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p>{refund.buyer.buyer_profile.address}</p>
                        <p className="text-sm">
                          {refund.buyer.buyer_profile.city}, {refund.buyer.buyer_profile.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Member since</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(refund.buyer.join_date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={handleOpenUpdateModal}
                  className="w-full py-3 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FiEdit className="w-4 h-4" />
                  Update Refund Status
                </button>
                
                <button
                  onClick={() => router.push(`/dashboard/orders/${refund.order}`)}
                  className="w-full py-3 px-4 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FiPackage className="w-4 h-4" />
                  View Order Details
                </button>
                
                <Link
                  href={`/dashboard/users/${refund.buyer.id}`}
                  className="block w-full py-3 px-4 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FiUser className="w-4 h-4" />
                  View Buyer Profile
                </Link>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Refund Requested</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(refund.created_at)}</p>
                  </div>
                </div>
                
                {refund.reviewed_at && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Refund {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(refund.reviewed_at)}</p>
                      {refund.reviewed_by_name && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">By {refund.reviewed_by_name}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Refund Modal */}
      <UpdateRefundModal
        open={showUpdateModal}
        onClose={handleCloseModal}
        refund={refund}
        status={status}
        setStatus={setStatus}
        adminResponse={adminResponse}
        setAdminResponse={setAdminResponse}
        submitting={submitting}
        onSubmit={handleReview}
        statusOptions={STATUS_OPTIONS.map(opt => ({ 
          value: opt.value, 
          label: opt.label 
        }))}
      />
    </div>
  );
}