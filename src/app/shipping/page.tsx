"use client";

import React, { useState } from "react";
import { 
  Package, 
  Truck, 
  Globe, 
  Shield, 
  Clock, 
  MapPin,
  CheckCircle,
  AlertCircle,
  RefreshCcw,
  DollarSign,
  PackageCheck,
  Plane,
  Ship,
  Home,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ShippingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const shippingMethods = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Standard Shipping",
      time: "5-7 business days",
      price: "Free over $100",
      description: "Most popular option for domestic orders",
      color: "bg-blue-500"
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Express Shipping",
      time: "2-3 business days",
      price: "From $25",
      description: "Faster delivery with priority handling",
      color: "bg-emerald-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "International",
      time: "10-21 business days",
      price: "Calculated at checkout",
      description: "Worldwide shipping available",
      color: "bg-purple-500"
    }
  ];

  const trackingSteps = [
    { step: "Order Placed", icon: <CheckCircle className="w-5 h-5" />, status: "complete" },
    { step: "Artist Preparing", icon: <Package className="w-5 h-5" />, status: "complete" },
    { step: "Shipped", icon: <Truck className="w-5 h-5" />, status: "complete" },
    { step: "In Transit", icon: <MapPin className="w-5 h-5" />, status: "current" },
    { step: "Delivered", icon: <Home className="w-5 h-5" />, status: "pending" }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Domestic orders typically arrive in 5-7 business days with standard shipping. Express options are available at checkout. International orders can take 10-21 days depending on your location and customs processing."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We ship artwork worldwide. Shipping costs and delivery times vary by destination. International customers are responsible for any customs duties or import taxes."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this to monitor your package's journey. Most carriers provide real-time updates."
    },
    {
      question: "What if my artwork arrives damaged?",
      answer: "We pack everything carefully, but accidents happen. If your artwork arrives damaged, email us photos within 48 hours and we'll arrange a replacement or refund."
    },
    {
      question: "Can I return artwork?",
      answer: "Original artwork sales are generally final due to their unique nature. However, if the piece is significantly different from its description or arrives damaged, we'll work with you on a solution within 7 days of delivery."
    },
    {
      question: "Who handles the shipping?",
      answer: "Artists typically ship their own work within 3-5 days of your order. Some larger pieces or framed artwork may take a bit longer to package safely."
    },
    {
      question: "Do you offer local pickup?",
      answer: "Some artists offer local pickup in their area. You'll see this option at checkout if it's available for your selected artwork."
    },
    {
      question: "What about insurance?",
      answer: "All shipments include basic insurance coverage. For high-value pieces over $500, we recommend additional insurance which can be added at checkout."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">Shipping & Delivery</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get Your Art Safely
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            We work with artists to ensure your artwork arrives in perfect condition. Here's everything you need to know about shipping and returns.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        {/* Shipping Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {shippingMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow"
            >
              <div className={`${method.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}>
                {method.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {method.title}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-emerald-400">
                  {method.price}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {method.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>{method.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* How It Works */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <PackageCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  How It Works
                </h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Place Your Order
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Complete checkout and receive an order confirmation email immediately.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Artist Prepares
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      The artist carefully packages your artwork within 3-5 business days.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Shipment & Tracking
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Once shipped, you'll get a tracking number to follow your package.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Delivery & Enjoyment
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your artwork arrives safely and you can start enjoying it right away.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns & Refunds */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <RefreshCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Returns & Refunds
                </h2>
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Because each artwork is unique and often made to order, we have a limited return policy. Here's what you should know:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Damaged or Defective</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Full refund or replacement if artwork arrives damaged or significantly different from description
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">7-Day Window</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Contact us within 7 days of delivery with photos for eligibility
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Original Condition</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Artwork must be returned in its original condition with all packaging
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm">
                  <strong>Note:</strong> Custom commissions and personalized artwork are not eligible for returns unless damaged or defective.
                </p>
              </div>
            </div>

            {/* International Shipping */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  International Orders
                </h2>
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We ship artwork to collectors around the world. Here's what international buyers need to know:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Ship className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Delivery Time</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">10-21 business days typically</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Customs & Duties</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Buyer's responsibility</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Tracking</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Full tracking provided</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Packaging</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Extra secure for distance</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Import fees:</strong> Customs duties and taxes vary by country and are not included in your purchase price. You may be contacted by your local customs office for payment before delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Quick Tips</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Orders over $100 get free standard shipping</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Most artists ship within 3-5 business days</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>You'll receive tracking info via email</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Insurance available for high-value pieces</p>
                </div>
              </div>
            </div>

            {/* Example Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Track Your Order
              </h3>
              <div className="space-y-4">
                {trackingSteps.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'complete' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                        : item.status === 'current'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        item.status === 'complete' || item.status === 'current'
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                      }`}>
                        {item.step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Questions about your shipment? We're here to help.
              </p>
              <a
                href="/contact"
                className="block w-full text-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Everything you need to know about shipping and delivery
            </p>
          </div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Browse thousands of unique artworks from talented artists around the world. We'll handle the rest.
          </p>
          <a
            href="/gallery"
            className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Explore Gallery
          </a>
        </div>
      </div>
    </main>
  );
}
