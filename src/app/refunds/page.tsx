"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/lib/authProvider';
import { useToast } from '@/components/ui/Toast';
import { appClient, RefundRequestDTO } from '@/lib/appClient';
import { 
  FiSearch, 
  FiX, 
  FiPackage, 
  FiFileText,
  FiDollarSign,
  FiCalendar,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiX as FiXIcon,
  FiRefreshCw,
  FiChevronDown,
  FiAlertCircle,
  FiThumbsUp,
  FiCreditCard
} from 'react-icons/fi';
import Link from 'next/link';

export default function MyRefundsPage() {
  const [refunds, setRefunds] = useState<RefundRequestDTO[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await appClient.getMyRefundRequests();
      setRefunds(Array.isArray(response) ? response : response.results || []);
    } catch (error: any) {
      console.error('Failed to load refunds:', error);
      showToast('error', "Failed to load refunds", error.message || "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let filteredRefunds = refunds;
    const q = query.trim().toLowerCase();
    
    if (q) {
      filteredRefunds = filteredRefunds.filter(refund => 
        refund.order.order_number.toLowerCase().includes(q) ||
        refund.id.toString().includes(q) ||
        refund.reason.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      filteredRefunds = filteredRefunds.filter(refund => refund.status === statusFilter);
    }

    // Sort by creation date, newest first
    return filteredRefunds.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [refunds, query, statusFilter]);

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      pending: { 
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: <FiClock className="w-3 h-3 mr-1" />,
        message: "Waiting for admin review"
      },
      approved: { 
        color: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: <FiThumbsUp className="w-3 h-3 mr-1" />,
        message: "Refund approved, waiting for processing"
      },
      rejected: { 
        color: 'bg-red-50 text-red-800 border-red-200',
        icon: <FiXIcon className="w-3 h-3 mr-1" />,
        message: "Refund request declined"
      },
      processed: { 
        color: 'bg-green-50 text-green-800 border-green-200',
        icon: <FiCheckCircle className="w-3 h-3 mr-1" />,
        message: "Refund completed"
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'bg-gray-50 text-gray-800 border-gray-200', icon: null, message: '' };
    
    const labels = {
      pending: "Under Review",
      approved: "Approved",
      rejected: "Declined",
      processed: "Completed"
    };

    return (
      <div className="flex flex-col items-end">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color} mb-1`}>
          {config.icon}
          {labels[status as keyof typeof labels] || status}
        </span>
        <span className="text-xs text-gray-500 text-right max-w-[120px]">
          {config.message}
        </span>
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      all: <FiPackage className="w-4 h-4" />,
      pending: <FiClock className="w-4 h-4" />,
      approved: <FiThumbsUp className="w-4 h-4" />,
      rejected: <FiXIcon className="w-4 h-4" />,
      processed: <FiCheckCircle className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || <FiPackage className="w-4 h-4" />;
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: refunds.length };
    refunds.forEach(refund => {
      counts[refund.status] = (counts[refund.status] || 0) + 1;
    });
    return counts;
  }, [refunds]);

  const statusLabels: Record<string, string> = {
    all: "All",
    pending: "Under Review",
    approved: "Approved",
    rejected: "Declined",
    processed: "Completed"
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const reasonLabels: Record<string, string> = {
    wrong_item: "Wrong Item Received",
    damaged: "Item Damaged",
    not_as_described: "Not as Described",
    changed_mind: "Changed Mind",
    other: "Other Reason"
  };

  const getStatusDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      pending: "Your refund request is under review by our team. We'll get back to you soon.",
      approved: "Your refund has been approved. The amount will be processed shortly.",
      rejected: "Your refund request has been declined. Please contact support for more details.",
      processed: "Your refund has been completed. The amount should appear in your account within 3-5 business days."
    };
    return descriptions[status] || '';
  };

  const getRefundTimeline = (refund: RefundRequestDTO) => {
    const timeline = [
      {
        event: "Request Submitted",
        date: refund.created_at,
        icon: <FiFileText className="w-4 h-4 text-blue-600" />,
        color: 'bg-blue-600'
      }
    ];

    if (refund.reviewed_at) {
      timeline.push({
        event: refund.status === 'processed' ? "Refund Processed" : "Status Updated",
        date: refund.reviewed_at,
        icon: <FiCheckCircle className="w-4 h-4 text-green-600" />,
        color: 'bg-green-600'
      });
    } else if (refund.updated_at !== refund.created_at) {
      timeline.push({
        event: "Updated",
        date: refund.updated_at,
        icon: <FiRefreshCw className="w-4 h-4 text-gray-600" />,
        color: 'bg-gray-600'
      });
    }

    return timeline;
  };

  if (!user) {
    return (
      <div className="h-full mt-30 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your refund requests</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-[#634bc1] text-white px-6 py-3 rounded-lg hover:bg-[#5340a0] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <FiRefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading refunds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                My Refund Requests
              </h1>
              <p className="text-gray-600">
                Track and manage your refund requests
              </p>
            </div>
            <Link
              href="/refunds/request"
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Request Refund</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by order number, reason..."
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={loadRefunds}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected', 'processed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{getStatusIcon(status)}</span>
                {statusLabels[status]}
                <span className="ml-1.5 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                  {statusCounts[status] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Refunds Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filtered.length} refund request{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Refunds List */}
        <div className="space-y-4">
          {filtered.map((refund) => (
            <div key={refund.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Refund Header - Always Visible */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <FiFileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        Refund for Order {refund.order.order_number}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Requested on {formatDate(refund.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={refund.status} />
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">
                        ${parseFloat(refund.refund_amount).toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Refund Amount
                      </p>
                    </div>
                    <button 
                      onClick={() => setOpenId(openId === refund.id ? null : refund.id)}
                      className="cursor-pointer flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      {openId === refund.id ? "Hide" : "View"}
                      <FiChevronDown className={`ml-1 w-4 h-4 transition-transform ${openId === refund.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Summary - Always Visible */}
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FiPackage className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 capitalize">
                        {reasonLabels[refund.reason] || refund.reason}
                      </span>
                    </div>
                    <div className="text-gray-300">•</div>
                    <div className="text-gray-600">
                      Last updated {formatDate(refund.updated_at)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {openId === refund.id && (
                <div className="bg-white border-t-4 border-yellow-600">
                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Refund Details - Wider Column */}
                      <div className="xl:col-span-2">
                        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
                          <FiFileText className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Refund Details</h3>
                        </div>
                        
                        {/* Status Message */}
                        <div className={`rounded-lg border p-4 mb-4 ${
                          refund.status === 'pending' ? 'bg-amber-50 border-amber-200' :
                          refund.status === 'approved' ? 'bg-blue-50 border-blue-200' :
                          refund.status === 'rejected' ? 'bg-red-50 border-red-200' :
                          'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-start space-x-3">
                            {refund.status === 'pending' && <FiClock className="w-5 h-5 text-amber-600 mt-0.5" />}
                            {refund.status === 'approved' && <FiThumbsUp className="w-5 h-5 text-blue-600 mt-0.5" />}
                            {refund.status === 'rejected' && <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                            {refund.status === 'processed' && <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                {refund.status === 'pending' && "Under Review"}
                                {refund.status === 'approved' && "Approved"}
                                {refund.status === 'rejected' && "Declined"}
                                {refund.status === 'processed' && "Completed"}
                              </h4>
                              <p className="text-sm text-gray-700">
                                {getStatusDescription(refund.status)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Reason and Description */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Refund Reason</h4>
                            <p className="text-gray-700">
                              {reasonLabels[refund.reason] || refund.reason}
                            </p>
                          </div>

                          {refund.description && (
                            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                              <h4 className="font-medium text-gray-900 mb-2">Your Message</h4>
                              <p className="text-gray-700">{refund.description}</p>
                            </div>
                          )}

                          {refund.admin_response && (
                            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                              <h4 className="font-medium text-blue-900 mb-2">Admin Response</h4>
                              <p className="text-blue-800">{refund.admin_response}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Information & Timeline */}
                      <div className="space-y-6">
                        {/* Order Details Card */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                          <div className="flex items-center space-x-2 mb-4">
                            <FiPackage className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Order Information</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FiFileText className="w-4 h-4" />
                                <span className="font-medium">Order Number</span>
                              </div>
                              <span className="font-mono text-gray-900">{refund.order.order_number}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FiCalendar className="w-4 h-4" />
                                <span className="font-medium">Request Date</span>
                              </div>
                              <span className="text-gray-900">{formatDate(refund.created_at)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FiDollarSign className="w-4 h-4" />
                                <span className="font-medium">Refund Amount</span>
                              </div>
                              <span className="font-bold text-lg text-gray-900">${parseFloat(refund.refund_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FiCheckCircle className="w-4 h-4" />
                                <span className="font-medium">Status</span>
                              </div>
                              <StatusBadge status={refund.status} />
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                          <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
                          <div className="space-y-4">
                            {getRefundTimeline(refund).map((item, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className={`w-3 h-3 rounded-full mt-1.5 ${item.color}`}></div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {item.icon}
                                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                                  </div>
                                  <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        {refund.status === 'processed' && (
                          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <FiCheckCircle className="w-5 h-5 text-green-600" />
                              <h4 className="font-medium text-green-900">Refund Completed</h4>
                            </div>
                            <p className="text-sm text-green-800 mb-3">
                              Your refund has been successfully processed.
                            </p>
                            <div className="text-xs text-green-700">
                              {refund.reviewed_at && (
                                <p>
                                  Processed on: {formatDate(refund.reviewed_at)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
                <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No refund requests found</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {query || statusFilter !== 'all' 
                    ? "No refund requests match your filters. Try clearing them." 
                    : "You haven't requested any refunds yet."}
                </p>
                {(query || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Clear Filters
                  </button>
                )}
                {!query && statusFilter === 'all' && (
                  <Link
                    href="/shop/refunds/request"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Request Your First Refund</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}