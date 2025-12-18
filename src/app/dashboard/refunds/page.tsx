"use client";
import React, { useEffect, useState } from "react";
import { appClient } from "@/lib/appClient";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authProvider";
import { 
  FiFilter, 
  FiSearch, 
  FiRefreshCw, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiDollarSign,
  FiEye,
  FiEdit,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import Link from "next/link";
import UpdateRefundModal from "@/components/dashboard/UpdateRefundModal";

// Define types based on the API response
interface AdminRefundDTO {
  id: number;
  order_number: string;
  buyer_name: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  refund_amount: string;
  created_at: string;
}

interface PaginatedRefundResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminRefundDTO[];
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "processed", label: "Processed", color: "bg-blue-100 text-blue-800" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All", color: "bg-gray-100 text-gray-800" },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "processed", label: "Processed", color: "bg-blue-100 text-blue-800" },
];

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<AdminRefundDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<AdminRefundDTO | null>(null);
  const [status, setStatus] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    approved: 0, 
    rejected: 0, 
    processed: 0,
    totalAmount: 0 
  });
  const [expandedRefunds, setExpandedRefunds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { showToast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (user && (user.role || '').toString().toLowerCase() !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadRefunds();
    }
  }, [filterStatus, page]);

  async function loadRefunds() {
    setLoading(true);
    try {
      const params: any = {};
      if (filterStatus !== "all") params.status = filterStatus;
      params.ordering = "-created_at";
      params.page = page;
      
      const response = await appClient.listRefundRequests(params) as PaginatedRefundResponse;
      setRefunds(response.results || []);
      
      // Calculate stats from the current page data
      // Note: For accurate stats, you might want a separate stats endpoint
      const allRefunds = response.results || [];
      const totalAmount = allRefunds.reduce((sum, refund) => {
        return sum + parseFloat(refund.refund_amount || '0');
      }, 0);
      
      setStats({
        total: response.count || allRefunds.length,
        pending: allRefunds.filter(r => r.status === "pending").length,
        approved: allRefunds.filter(r => r.status === "approved").length,
        rejected: allRefunds.filter(r => r.status === "rejected").length,
        processed: allRefunds.filter(r => r.status === "processed").length,
        totalAmount
      });

      // Calculate total pages
      const perPage = 10; // Adjust based on your API
      setTotalPages(Math.ceil((response.count || 0) / perPage));
    } catch (e: any) {
      console.error("Failed to load refunds:", e);
      showToast("error", "Failed to load refunds", e?.message || "Please try again");
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRefund || !status || !adminResponse) {
      showToast("error", "All fields are required");
      return;
    }
    
    setSubmitting(true);
    try {
      // Update the refund status
      await appClient.reviewRefundRequest(selectedRefund.id, {
        status: status as any,
        admin_response: adminResponse
      });
      
      showToast("success", "Refund reviewed successfully");
      setSelectedRefund(null);
      setStatus("");
      setAdminResponse("");
      await loadRefunds();
    } catch (e: any) {
      showToast("error", "Failed to review refund", e?.message || "Please try again");
    } finally {
      setSubmitting(false);
    }
  }

  const handleCloseModal = () => {
    setSelectedRefund(null);
    setStatus("");
    setAdminResponse("");
  };

  const toggleExpand = (id: number) => {
    setExpandedRefunds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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

  // Filter refunds based on search
  const filteredRefunds = refunds.filter(refund => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      refund.order_number.toLowerCase().includes(searchLower) ||
      refund.buyer_name.toLowerCase().includes(searchLower) ||
      refund.reason.toLowerCase().includes(searchLower)
    );
  });

  if (!user || user.role !== 'admin') {
    return null; // Or show loading/redirect component
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-black p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Refund Requests</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and review customer refund requests</p>
            </div>
            <button
              onClick={loadRefunds}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.approved}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-500">{stats.rejected}</p>
                </div>
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Processed</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">{stats.processed}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(stats.totalAmount.toString())}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-purple-600 dark:text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-white/10 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Status Filters */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FiFilter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setFilterStatus(filter.value);
                        setPage(1); // Reset to first page when filter changes
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        filterStatus === filter.value
                          ? 'ring-2 ring-yellow-600 ring-offset-2 ' + filter.color
                          : filter.color + ' hover:opacity-90'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="lg:w-80">
                <div className="flex items-center gap-2 mb-2">
                  <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by order number, buyer name..."
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 focus:outline-none"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Buyer & Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading refund requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                          <FiDollarSign className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No refund requests found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {filterStatus !== 'all' 
                            ? `No ${filterStatus} refund requests`
                            : search
                            ? 'No refund requests match your search'
                            : 'No refund requests have been submitted yet'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRefunds.map(refund => {
                    const isExpanded = expandedRefunds.includes(refund.id);
                    return (
                      <React.Fragment key={refund.id}>
                        <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleExpand(refund.id)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                {isExpanded ? (
                                  <FiChevronUp className="w-5 h-5" />
                                ) : (
                                  <FiChevronDown className="w-5 h-5" />
                                )}
                              </button>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {refund.order_number}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {refund.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {refund.buyer_name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                                {refund.reason.replace('_', ' ')}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(refund.refund_amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              refund.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                                : refund.status === 'approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : refund.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {refund.status === 'pending' && <FiClock className="w-3 h-3" />}
                              {refund.status === 'approved' && <FiCheckCircle className="w-3 h-3" />}
                              {refund.status === 'rejected' && <FiXCircle className="w-3 h-3" />}
                              {refund.status === 'processed' && <FiCheckCircle className="w-3 h-3" />}
                              {refund.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(refund.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/refunds/${refund.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                              >
                                <FiEye className="w-3 h-3" />
                                View
                              </Link>
                              <button
                                onClick={() => {
                                  setSelectedRefund(refund);
                                  setStatus(refund.status);
                                  setAdminResponse('');
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={refund.status === 'processed'}
                                title={refund.status === 'processed' ? 'Processed refunds cannot be modified' : 'Update refund status'}
                              >
                                <FiEdit className="w-3 h-3" />
                                Update
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-50 dark:bg-white/5">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="pl-8 border-l-2 border-yellow-600">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Details</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Order: {refund.order_number}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Refund ID: {refund.id}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Refund Reason</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                      {refund.reason.replace('_', ' ')}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timeline</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Requested: {formatDate(refund.created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * 10, stats.total)}</span> of{' '}
                  <span className="font-medium">{stats.total}</span> refunds
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 border border-gray-300 dark:border-white/10 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                            page === pageNum
                              ? 'bg-yellow-600 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 border border-gray-300 dark:border-white/10 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Refund Modal */}
      <UpdateRefundModal
        open={!!selectedRefund}
        onClose={handleCloseModal}
        refund={selectedRefund}
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