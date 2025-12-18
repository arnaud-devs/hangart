"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getOrder, initiatePayment, checkPaymentStatus, getPayment } from '@/lib/appClient';
import { useAuth } from '@/lib/authProvider';
import Image from 'next/image';

// Fallback i18n and toast hooks
const useI18n = () => ({ t: (key: string, vars?: any) => key });
const useToast = () => ({ toast: (msg: any) => console.log(msg?.title || msg?.description || 'Action') });

// Define types
type Order = any;
type PaymentMethod = 'stripe' | 'paypal' | 'momo';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Payment method configuration
const paymentMethods = [
  { 
    id: 'stripe' as PaymentMethod, 
    name: 'Credit/Debit Card', 
    icon: '/card.png',
    description: 'Pay securely with your card via Stripe',
    supported: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true'
  },
  { 
    id: 'paypal' as PaymentMethod, 
    name: 'PayPal', 
    icon: '/paypal.png',
    description: 'Pay with your PayPal account',
    supported: process.env.NEXT_PUBLIC_ENABLE_PAYPAL === 'true'
  },
  { 
    id: 'momo' as PaymentMethod, 
    name: 'Mobile Money (MTN)', 
    icon: '/momo.png',
    description: 'Pay via MTN Mobile Money Rwanda',
    supported: true // MTN MoMo is always supported
  }
];

// Stripe Payment Form Component
function StripePaymentForm({ 
  order, 
  onSuccess 
}: { 
  order: Order; 
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useI18n();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Initiate payment through backend API
      const paymentInit = await initiatePayment(order.id, {
        payment_method: 'card',
        currency: order.currency || 'EUR'
      });

      if (paymentInit?.client_secret) {
        // Confirm payment with Stripe using the client secret from backend
        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment/success?orderId=${order.id}`,
          },
          redirect: 'if_required',
          clientSecret: paymentInit.client_secret
        });

        if (stripeError) {
          setError(stripeError.message || t("payNow.paymentFailed"));
          toast({
            type: 'error',
            title: t("payNow.paymentFailed"),
            description: stripeError.message || t("payNow.paymentCouldNotBeProcessed")
          });
        } else if (paymentIntent?.status === 'succeeded') {
          toast({
            type: 'success',
            title: t("payNow.paymentSuccessful"),
            description: t("payNow.paymentProcessedSuccessfully")
          });
          onSuccess();
        }
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || t("payNow.unexpectedError"));
      toast({
        type: 'error',
        title: t("payNow.paymentError"),
        description: error.message || t("payNow.unexpectedError")
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>{t("payNow.sandboxMode")}:</strong> {t("payNow.useTestCard")}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <details className="text-yellow-800 text-sm">
          <summary className="cursor-pointer font-medium">{t("payNow.testCardDetails")}</summary>
          <div className="mt-2 space-y-1 text-xs">
            <div><strong>{t("payNow.visa")}:</strong> 4242424242424242</div>
            <div><strong>{t("payNow.mastercard")}:</strong> 5555555555554444</div>
            <div><strong>{t("payNow.amex")}:</strong> 378282246310005</div>
            <div><strong>{t("payNow.expiry")}:</strong> {t("payNow.anyFutureDate")}</div>
            <div><strong>{t("payNow.cvc")}:</strong> {t("payNow.anyThreeDigits")}</div>
            <div><strong>{t("payNow.zip")}:</strong> {t("payNow.anyFiveDigits")}</div>
          </div>
        </details>
      </div>

      <div className="space-y-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }} 
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{t("payNow.processingPayment")}</span>
          </>
        ) : (
          <>
            <span>{t("payNow.payAmount", { amount: Number(order.totalAmount).toFixed(2) })}</span>
          </>
        )}
      </button>
    </form>
  );
}

// Mobile Money Payment Component
function MobileMoneyPayment({ order, onSuccess }: { order: Order; onSuccess: () => void }) {
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  // Poll payment status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const pollPaymentStatus = async () => {
      if (!paymentId || !polling) return;

      try {
        const status = await checkPaymentStatus(paymentId);
        
        if (status.status === 'successful') {
          // Payment successful
          clearInterval(pollInterval);
          setPolling(false);
          toast({
            type: 'success',
            title: t("payNow.paymentSuccessful"),
            description: t("payNow.mobileMoneyPaymentProcessed")
          });
          onSuccess();
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          // Payment failed
          clearInterval(pollInterval);
          setPolling(false);
          toast({
            type: 'error',
            title: t("payNow.paymentFailed"),
            description: status.message || t("payNow.paymentCouldNotBeProcessed")
          });
        }
        // If still pending, continue polling
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    if (polling && paymentId) {
      pollInterval = setInterval(pollPaymentStatus, 10000); // Poll every 10 seconds
      // Initial poll
      pollPaymentStatus();
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [paymentId, polling, toast, t, onSuccess]);

  const handleMomoPayment = async () => {
    // Validate phone number format
    if (!phoneNumber.trim()) {
      toast({
        type: 'error',
        title: t("payNow.phoneNumberRequired"),
        description: t("payNow.pleaseEnterPhoneNumber")
      });
      return;
    }

    // Clean phone number (remove spaces, plus sign)
    const cleanedPhoneNumber = phoneNumber.replace(/[\s+]/g, '');
    
    // Validate Rwandan MTN number format
    const rwandaMtnRegex = /^2507[0-9]{8}$/;
    if (!rwandaMtnRegex.test(cleanedPhoneNumber)) {
      toast({
        type: 'error',
        title: t("payNow.invalidPhoneNumber"),
        description: t("payNow.phoneNumberFormat") + " 2507xxxxxxxx (e.g., 250788123456)"
      });
      return;
    }

    setProcessing(true);
    
    try {
      // Initiate MTN MoMo payment through backend API
      const paymentResponse = await initiatePayment(order.id, {
        payment_method: 'momo',
        phone_number: cleanedPhoneNumber,
        currency: order.currency || (process.env.NODE_ENV === 'production' ? 'RWF' : 'EUR'),
        payer_message: `Payment for order ${order.orderNumber}`
      });

      if (paymentResponse?.payment?.id) {
        setPaymentId(paymentResponse.payment.id.toString());
        
        toast({
          type: 'success',
          title: t("payNow.paymentRequestSent"),
          description: t("payNow.checkPhoneForUSSD")
        });
        
        // Start polling for payment status
        setPolling(true);
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('MoMo payment error:', error);
      let errorMessage = t("payNow.failedToProcessMobileMoney");
      
      if (error.message?.includes('Invalid phone number')) {
        errorMessage = t("payNow.invalidPhoneNumberFormat");
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = t("payNow.insufficientFunds");
      }
      
      toast({
        type: 'error',
        title: t("payNow.paymentError"),
        description: errorMessage
      });
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-800 text-sm">
          <strong>Important:</strong> Enter your MTN Rwanda phone number starting with 2507 (e.g., 250788123456)
        </p>
        <p className="text-purple-800 text-sm mt-2">
          {process.env.NODE_ENV === 'production' 
            ? 'You will receive a USSD prompt on your phone to approve the payment'
            : 'Sandbox mode: Payment will auto-approve after 30-60 seconds'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            MTN Mobile Money Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="250788123456"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: 2507xxxxxxxx (e.g., 250788123456, 250728123456)
          </p>
        </div>
      </div>

      {polling && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-blue-800 font-medium">Checking payment status...</p>
              <p className="text-blue-600 text-sm">
                Please approve the payment on your phone. Polling every 10 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleMomoPayment}
        disabled={processing || polling || !phoneNumber.trim()}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {processing || polling ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{polling ? 'Waiting for approval...' : 'Initiating payment...'}</span>
          </>
        ) : (
          <>
            <span>Pay ${Number(order.totalAmount).toFixed(2)} with Mobile Money</span>
          </>
        )}
      </button>

      <div className="text-center text-xs text-gray-500 space-y-2">
        <p>🔒 Secure payment via MTN Mobile Money Rwanda</p>
        <p>You will receive a USSD prompt on your phone to complete the payment</p>
      </div>
    </div>
  );
}

// PayPal Payment Component
function PayPalPayment({ order, onSuccess }: { order: Order; onSuccess: () => void }) {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const handlePayPalPayment = async () => {
    setProcessing(true);
    try {
      // Initiate PayPal payment through backend API
      const paymentResponse = await initiatePayment(order.id, {
        payment_method: 'paypal',
        currency: order.currency || 'USD'
      });

      if (paymentResponse?.approval_url) {
        // Redirect to PayPal for approval
        window.location.href = paymentResponse.approval_url;
      } else {
        throw new Error('Failed to initialize PayPal payment');
      }
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      toast({
        type: 'error',
        title: t("payNow.paymentError"),
        description: error.message || t("payNow.failedToInitializePayPal")
      });
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          You will be redirected to PayPal to complete your payment
        </p>
      </div>

      <button 
        onClick={handlePayPalPayment}
        disabled={processing}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Redirecting to PayPal...</span>
          </>
        ) : (
          <>
            <span>Pay ${Number(order.totalAmount).toFixed(2)} with PayPal</span>
          </>
        )}
      </button>
    </div>
  );
}

// Payment Method Button Component
function PaymentMethodButton({ 
  method, 
  isSelected, 
  onSelect 
}: { 
  method: typeof paymentMethods[0]; 
  isSelected: boolean; 
  onSelect: () => void; 
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!method.supported}
      className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50' 
          : method.supported
          ? 'border-gray-300 bg-white hover:border-gray-400'
          : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {method.icon ? (
            <div className="w-8 h-8 relative">
              <Image
                src={method.icon}
                alt={method.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <span className="text-lg font-semibold text-gray-600">
              {method.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{method.name}</div>
          <div className="text-sm text-gray-500">{method.description}</div>
          {!method.supported && (
            <div className="text-xs text-orange-600 mt-1">Coming soon</div>
          )}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
        }`}>
          {isSelected && (
            <div className="w-2 h-2 bg-white rounded-full"></div>
          )}
        </div>
      </div>
    </button>
  );
}

// Main Payment Page Component
interface PaymentPageProps {
  orderId: string;
}

export default function PaymentPage({ orderId }: PaymentPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('momo');
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string>('');
  const router = useRouter();
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        toast({
          type: 'error',
          title: 'Order Required',
          description: 'No order specified for payment'
        });
        router.push('/orders');
        return;
      }

      try {
        // Get order details
        const orderData = await getOrder(Number(orderId));
        setOrder(orderData);

        // Check if order is already paid
        if (orderData.status === 'paid' || orderData.status === 'COMPLETED') {
          setPaymentSuccess(true);
          return;
        }

        // Check if order is pending payment
        if (orderData.status !== 'pending_payment') {
          toast({
            type: 'error',
            title: 'Invalid Order Status',
            description: 'This order cannot be paid at this time'
          });
          router.push('/orders');
          return;
        }

      } catch (error: any) {
        console.error('Failed to load order:', error);
        toast({
          type: 'error',
          title: 'Order Not Found',
          description: error.message || 'Failed to load order details'
        });
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrder();
    }
  }, [orderId, user, router, toast]);

  const handlePaymentMethodChange = async (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  const handleViewPayments = () => {
    router.push('/payments');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to make a payment</p>
          <button 
            onClick={() => router.push('/login')}
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're trying to pay for doesn't exist</p>
          <button 
            onClick={() => router.push('/orders')}
            className="bg-[#634bc1] text-white px-6 py-3 rounded-lg hover:bg-[#5340a0] transition-colors"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md w-full bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow-lg p-8 text-center border border-black/5 dark:border-white/10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">Payment Successful!</h1>
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                {selectedMethod === 'stripe' && (
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                )}
                {selectedMethod === 'paypal' && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">PP</div>
                )}
                {selectedMethod === 'momo' && (
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">MM</div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Paid with</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {selectedMethod === 'stripe' && 'Credit/Debit Card'}
                  {selectedMethod === 'paypal' && 'PayPal'}
                  {selectedMethod === 'momo' && 'Mobile Money (MTN)'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400">Order Number</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Amount Paid</p>
                <p className="font-bold text-green-600 dark:text-green-400">
                  ${Number(order.total_amount).toFixed(2)} {order.currency || 'USD'}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your payment! Your order is now confirmed and will be processed shortly.
            {selectedMethod === 'momo' && ' You will receive a payment confirmation message on your phone.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleViewPayments}
              className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Payment History
            </button>
            <button
              onClick={handleBackToHome}
              className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A confirmation email has been sent to your registered email address.
              Need help? Contact us at{' '}
              <a href="mailto:support@hangart.com" className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 underline">
                support@hangart.com
              </a>
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Order Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Order: {order.orderNumber}</p>
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 inline-block">
            <p className="text-yellow-800 text-sm font-medium">
              {process.env.NODE_ENV === 'production' ? '💳 Live Payment Mode' : '🧪 Sandbox Mode - Testing Only'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-t-blue-500">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h3>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {order.items && order.items.map((item: any, index: number) => {
                const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
                const unitPrice = Number(item.price);
                const artwork = item.artwork || {};
                return (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 flex-1">
                      {artwork.main_image && (
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={artwork.main_image}
                            alt={artwork.title || `Artwork ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {artwork.title || `Artwork ${index + 1}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {quantity} × ${unitPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${(unitPrice * quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${Number(order.subtotal).toFixed(2)}</span>
              </div>
              {Number(order.shipping_fee) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">${Number(order.shipping_fee).toFixed(2)}</span>
                </div>
              )}
              {Number(order.commission) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Commission:</span>
                  <span className="text-gray-900">${Number(order.commission).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <span className="text-gray-900">Total:</span>
                <span className="text-blue-600">${Number(order.total_amount).toFixed(2)} {order.currency || 'USD'}</span>
              </div>
            </div>

            {/* Order Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'pending_payment' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status === 'pending_payment' ? 'Pending Payment' : order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-t-green-500">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Payment Method</h3>
            
            {/* Payment Method Selection */}
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <PaymentMethodButton
                  key={method.id}
                  method={method}
                  isSelected={selectedMethod === method.id}
                  onSelect={() => handlePaymentMethodChange(method.id)}
                />
              ))}
            </div>

            {/* Payment Form */}
            <div className="mt-6">
              {/* Stripe payment form */}
              {selectedMethod === 'stripe' && stripeClientSecret && (
                <Elements 
                  stripe={stripePromise}
                  options={{
                    clientSecret: stripeClientSecret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <StripePaymentForm 
                    order={order} 
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              )}
              
              {/* Mobile Money payment form */}
              {selectedMethod === 'momo' && (
                <MobileMoneyPayment 
                  order={order} 
                  onSuccess={handlePaymentSuccess}
                />
              )}
              
              {/* PayPal payment form */}
              {selectedMethod === 'paypal' && (
                <PayPalPayment 
                  order={order} 
                  onSuccess={handlePaymentSuccess}
                />
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                🔒 All payments are processed securely. {process.env.NODE_ENV === 'production' ? 'Live payment mode' : 'Sandbox mode for testing'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}