"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authProvider';
import { useToast } from '@/components/ui/Toast';
import { appClient, RefundRequestDTO, OrderDTO } from '@/lib/appClient';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiFileText, 
  FiCheckCircle,
  FiAlertCircle,
  FiShoppingBag,
  FiClock,
  FiThumbsUp,
  FiX,
  FiRefreshCw,
  FiInfo
} from 'react-icons/fi';

import { Suspense } from 'react';

function RequestRefundPageInner() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [refunds, setRefunds] = useState<RefundRequestDTO[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id.toString() === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [orderId, orders]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load orders and refunds in parallel
      const [ordersResponse, refundsResponse] = await Promise.allSettled([
        appClient.listMyOrders(),
        appClient.getMyRefundRequests()
      ]);

      // Process orders
      if (ordersResponse.status === 'fulfilled') {
        const userOrders = Array.isArray(ordersResponse.value) ? ordersResponse.value : ordersResponse.value?.results || [];
        console.log('Loaded orders:', userOrders);
        setOrders(userOrders);
      } else {
        console.error('Failed to load orders:', ordersResponse.reason);
      }

      // Process refunds
      if (refundsResponse.status === 'fulfilled') {
        const refundsData = Array.isArray(refundsResponse.value) ? refundsResponse.value : refundsResponse.value?.results || [];
        console.log('Loaded refunds:', refundsData);
        setRefunds(refundsData);
      } else {
        console.error('Failed to load refunds:', refundsResponse.reason);
      }
      
    } catch (error: any) {
      console.error('Failed to load data:', error);
      showToast('error', "Failed to load data", error.message || "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  // Check if an order already has a refund request
  const getOrderRefundStatus = (orderId: number) => {
    const orderRefunds = refunds.filter(refund => refund.order.id === orderId);
    if (orderRefunds.length === 0) return null;
    
    // Return the most recent refund for this order
    const latestRefund = orderRefunds.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    
    return latestRefund;
  };

  // Check if order is eligible for refund
  const isOrderEligibleForRefund = (order: OrderDTO) => {
    if (!order.status) return false;
    
    const status = order.status.toLowerCase();
    
    // Orders that are paid, completed, or delivered can be refunded
    const eligibleStatuses = ['paid', 'completed', 'delivered', 'shipped', 'processing'];
    
    return eligibleStatuses.includes(status);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder || !reason || !description) {
      showToast('error', "Missing information", "Please fill in all required fields");
      return;
    }

    // Check if order already has a pending or approved refund
    const existingRefund = getOrderRefundStatus(selectedOrder.id);
    if (existingRefund && (existingRefund.status === 'pending' || existingRefund.status === 'approved')) {
      showToast('error', "Refund already requested", "This order already has an active refund request");
      return;
    }

    // Check if order is eligible
    if (!isOrderEligibleForRefund(selectedOrder)) {
      showToast('error', "Order not eligible", "This order is not eligible for a refund");
      return;
    }

    setSubmitting(true);
    try {
      console.log('Creating refund request with data:', {
        order: selectedOrder.id,
        reason: reason as any,
        description
      });
      
      // Use the new refund request endpoint
      const response = await appClient.createRefundRequest({
        order: selectedOrder.id, // This should be just the order ID number
        reason: reason as any,
        description
      });

      console.log('Refund request successful:', response);
      
      showToast('success', "Refund request submitted", "Your refund request has been submitted for review");

      // Reload data to update the status
      await loadData();
      router.push('/refunds');
    } catch (error: any) {
      console.error('Failed to create refund:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        body: error.body
      });
      
      // Show more specific error message
      let errorMessage = error.message || "Please try again later";
      if (error.body) {
        if (error.body.detail) {
          errorMessage = error.body.detail;
        } else if (error.body.error) {
          errorMessage = error.body.error;
        } else if (typeof error.body === 'string') {
          errorMessage = error.body;
        } else if (Array.isArray(error.body)) {
          errorMessage = error.body.map((err: any) => err.message || err).join(', ');
        } else if (error.body.non_field_errors) {
          errorMessage = Array.isArray(error.body.non_field_errors) 
            ? error.body.non_field_errors.join(', ')
            : error.body.non_field_errors;
        }
      }
      
      showToast('error', "Failed to submit refund request", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const refundReasons = [
    { value: 'damaged', label: 'Item arrived damaged' },
    { value: 'wrong_item', label: 'Incorrect item received' },
    { value: 'not_as_described', label: 'Item differs from description' },
    { value: 'changed_mind', label: 'Changed my mind' },
    { value: 'other', label: 'Other reasons' }
  ];

  const RefundStatusBadge = ({ refund }: { refund: RefundRequestDTO }) => {
    const statusConfig = {
      pending: { 
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: <FiClock className="w-3 h-3 mr-1" />,
        label: "Under Review"
      },
      approved: { 
        color: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: <FiThumbsUp className="w-3 h-3 mr-1" />,
        label: "Approved"
      },
      rejected: { 
        color: 'bg-red-50 text-red-800 border-red-200',
        icon: <FiX className="w-3 h-3 mr-1" />,
        label: "Declined"
      },
      processed: { 
        color: 'bg-green-50 text-green-800 border-green-200',
        icon: <FiCheckCircle className="w-3 h-3 mr-1" />,
        label: "Completed"
      },
    };
    
    const config = statusConfig[refund.status as keyof typeof statusConfig] || 
                  { color: 'bg-gray-50 text-gray-800 border-gray-200', icon: null, label: refund.status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getRefundStatusMessage = (refund: RefundRequestDTO) => {
    const messages = {
      pending: "Your refund request is under review by our team.",
      approved: "Your refund has been approved and will be processed soon.",
      rejected: "Your refund request has been declined. Please contact support for details.",
      processed: "Your refund has been completed and processed."
    };
    return messages[refund.status as keyof typeof messages] || "Status update available.";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to request a refund</p>
          <button 
            onClick={() => router.push('/login?redirect=/refunds/request')}
            className="bg-[#634bc1] text-white px-6 py-3 rounded-lg hover:bg-[#5340a0] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Check if user is a buyer
  const isBuyer = (user?.role || '').toString().toLowerCase() === 'buyer';
  if (!isBuyer) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only buyers can request refunds</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#634bc1] text-white px-6 py-3 rounded-lg hover:bg-[#5340a0] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const eligibleOrders = orders.filter(order => isOrderEligibleForRefund(order));

  return (
    <div className="min-h-screen w-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Request a Refund
          </h1>
          <p className="text-gray-600">
            Select an order and provide details for your refund request
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          {/* Left Column - Order Selection */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiPackage className="w-5 h-5 mr-2 text-blue-600" />
                Select Order for Refund
              </h2>
              <div className="space-y-3">
                {eligibleOrders.map((order) => {
                  const existingRefund = getOrderRefundStatus(order.id);
                  const hasRefundRequest = !!existingRefund;
                  const canRequestRefund = !hasRefundRequest || 
                    (existingRefund?.status === 'rejected' || existingRefund?.status === 'processed');
                  
                  return (
                    <button
                      key={order.id}
                      onClick={() => canRequestRefund && setSelectedOrder(order)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedOrder?.id === order.id
                          ? hasRefundRequest
                            ? 'border-amber-300 bg-amber-50 shadow-sm'
                            : 'border-blue-500 bg-blue-50 shadow-sm'
                          : hasRefundRequest
                          ? 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                          : canRequestRefund
                          ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                      } ${!canRequestRefund ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={!canRequestRefund}
                    >
                      <div className="font-medium text-gray-900 flex items-center justify-between">
                        <span>Order #{order.order_number}</span>
                        {hasRefundRequest && (
                          <FiInfo className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 mt-2">
                        ${typeof order.total_amount === 'number' ? 
                          order.total_amount.toFixed(2) : 
                          parseFloat(order.total_amount || '0').toFixed(2)}
                      </div>
                      <div className="text-xs flex items-center mt-1">
                        <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          {order.status || 'Unknown'}
                        </div>
                      </div>
                      {hasRefundRequest && (
                        <div className="mt-2">
                          <RefundStatusBadge refund={existingRefund!} />
                          <div className="text-xs text-gray-500 mt-1">
                            Requested on {existingRefund && existingRefund.created_at ? 
                              new Date(String(existingRefund.created_at)).toLocaleDateString() : ''}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
                {eligibleOrders.length === 0 && orders.length > 0 && (
                  <div className="text-center py-8">
                    <FiShoppingBag className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">No eligible orders available for refund</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Only paid, completed, or delivered orders can be refunded
                    </p>
                    <div className="mt-4 text-sm">
                      <p className="text-gray-500 mb-2">You have {orders.length} order(s):</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {orders.slice(0, 5).map(order => (
                          <div key={order.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                            <span>#{order.order_number}</span>
                            <span className={`px-2 py-1 rounded ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/orders')}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all orders
                    </button>
                  </div>
                )}
                {orders.length === 0 && (
                  <div className="text-center py-8">
                    <FiShoppingBag className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">No orders found</p>
                    <p className="text-gray-400 text-xs mt-1">
                      You haven't placed any orders yet
                    </p>
                    <button
                      onClick={() => router.push('/gallery')}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Browse artwork
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Refund Form or Status */}
          <div>
            {selectedOrder ? (
              (() => {
                const existingRefund = getOrderRefundStatus(selectedOrder.id);
                const hasRefundRequest = !!existingRefund;
                const canRequestNewRefund = !hasRefundRequest || 
                  (existingRefund?.status === 'rejected' || existingRefund?.status === 'processed');

                if (hasRefundRequest && !canRequestNewRefund) {
                  return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      {/* Header with friendly message */}
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiRefreshCw className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                          Refund Already Requested
                        </h2>
                        <p className="text-gray-600 text-lg">
                          You already have an active refund request for this order
                        </p>
                      </div>

                      {/* Current Status Card */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-amber-200">
                              {existingRefund.status === 'pending' && <FiClock className="w-6 h-6 text-amber-600" />}
                              {existingRefund.status === 'approved' && <FiThumbsUp className="w-6 h-6 text-blue-600" />}
                              {existingRefund.status === 'rejected' && <FiX className="w-6 h-6 text-red-600" />}
                              {existingRefund.status === 'processed' && <FiCheckCircle className="w-6 h-6 text-green-600" />}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {existingRefund.status === 'pending' && "Under Review"}
                                {existingRefund.status === 'approved' && "Approved"}
                                {existingRefund.status === 'rejected' && "Declined"}
                                {existingRefund.status === 'processed' && "Completed"}
                              </h3>
                              <RefundStatusBadge refund={existingRefund} />
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed mb-4">
                              {getRefundStatusMessage(existingRefund)}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="bg-white/50 rounded-lg p-3">
                                <div className="font-medium text-gray-900 mb-1">Requested Amount</div>
                                <div className="text-2xl font-bold text-gray-900">${typeof existingRefund.refund_amount === 'number' ? 
                                  existingRefund.refund_amount.toFixed(2) : 
                                  (typeof existingRefund.refund_amount === 'string' ? 
                                    (() => {
                                      const parsed = parseFloat(existingRefund.refund_amount);
                                      return !isNaN(parsed) ? parsed.toFixed(2) : '0.00';
                                    })() : 
                                    '0.00'
                                  )
                                }</div>
                              </div>
                              <div className="bg-white/50 rounded-lg p-3">
                                <div className="font-medium text-gray-900 mb-1">Request Date</div>
                                <div className="text-lg text-gray-700">{existingRefund.created_at ? 
                                  new Date(String(existingRefund.created_at)).toLocaleDateString() : ''}
                                </div>
                              </div>
                            </div>
                            {existingRefund.admin_response && (
                              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <FiInfo className="w-4 h-4 text-blue-600" />
                                  <div className="font-medium text-blue-900">Admin Message</div>
                                </div>
                                <p className="text-blue-800 leading-relaxed">
                                  {existingRefund.admin_response}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Order Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Order Number</span>
                            <span className="font-mono text-gray-900">#{selectedOrder.order_number}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <span className="font-medium text-green-600">{selectedOrder.status}</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-gray-900">${typeof selectedOrder.total_amount === 'number' ? 
                              selectedOrder.total_amount.toFixed(2) : 
                              (() => {
                                const parsed = parseFloat(selectedOrder.total_amount || '0');
                                return !isNaN(parsed) ? parsed.toFixed(2) : '0.00';
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => router.push('/refunds')}
                          className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                        >
                          <FiFileText className="w-5 h-5 mr-3" />
                          View All Refunds
                        </button>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Choose Different Order
                        </button>
                      </div>
                    </div>
                  );
                }

                // Show refund form if no existing refund or can request new one
                return (
                  <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <FiFileText className="w-5 h-5 mr-2 text-blue-600" />
                      Request Refund for Order #{selectedOrder.order_number}
                    </h2>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Order Status</span>
                          <span className="font-medium text-green-600">
                            {selectedOrder.status || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Order Date</span>
                          <span>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : ''}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total Amount</span>
                            <span>${typeof selectedOrder.total_amount === 'number' ? 
                              selectedOrder.total_amount.toFixed(2) : 
                              parseFloat(selectedOrder.total_amount || '0').toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Refund Reason */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Refund Reason *
                      </label>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a reason</option>
                        {refundReasons.map((reasonOption) => (
                          <option key={reasonOption.value} value={reasonOption.value}>
                            {reasonOption.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Additional Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please provide details about why you're requesting a refund..."
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          "Submit Refund Request"
                        )}
                      </button>
                    </div>
                  </form>
                );
              })()
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {eligibleOrders.length === 0 ? 'No Eligible Orders' : 'Select an Order'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {eligibleOrders.length === 0 
                    ? orders.length === 0
                      ? "You don't have any orders yet"
                      : "You don't have any orders eligible for refund" 
                    : "Please select an order from the left to request a refund"}
                </p>
                {eligibleOrders.length === 0 && orders.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => router.push('/orders')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all orders
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestRefundPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-gray-500">Loading refund request page...</p></div>}>
      <RequestRefundPageInner />
    </Suspense>
  );
}