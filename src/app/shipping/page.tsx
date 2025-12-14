"use client";

import React, { useState } from "react";
import { 
  Package, 
  Truck, 
  Globe, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  RefreshCcw,
  DollarSign,
  Plane,
  Home,
  ChevronDown,
  ChevronUp,
  MapPin,
  HeadphonesIcon as Support
} from "lucide-react";

export default function ShippingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const shippingMethods = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Standard Shipping",
      time: "5-7 business days",
      price: "Free over $100",
      description: "Most popular option for domestic orders",
      color: "bg-yellow-600"
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Express Shipping",
      time: "2-3 business days",
      price: "From $25",
      description: "Priority delivery for urgent orders",
      color: "bg-yellow-600"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "International",
      time: "10-21 business days",
      price: "Calculated at checkout",
      description: "Available worldwide",
      color: "bg-yellow-600"
    }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Domestic orders typically arrive in 5-7 business days with standard shipping. Express options are available at checkout. International orders can take 10-21 days depending on location."
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
      answer: "Original artwork sales are generally final due to their unique nature. However, if the piece is significantly different from its description or arrives damaged, we'll work with you on a solution."
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Order Placed",
      description: "You complete your purchase and receive confirmation",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      number: "02",
      title: "Artist Prepares",
      description: "Artist carefully packages your artwork within 3-5 days",
      icon: <Package className="w-5 h-5" />
    },
    {
      number: "03",
      title: "Shipment",
      description: "Artwork ships and you receive tracking information",
      icon: <Truck className="w-5 h-5" />
    },
    {
      number: "04",
      title: "Delivery",
      description: "Your artwork arrives safely at your doorstep",
      icon: <Home className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Simple Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
              <Package className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Shipping & Delivery
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get your art safely
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We work with artists to ensure your artwork arrives in perfect condition. Here's everything you need to know.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Shipping Methods */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Shipping Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors"
              >
                <div className={`${method.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {method.price}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {method.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{method.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* How It Works */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  How It Works
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {step.icon}
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Returns & Refunds */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <RefreshCcw className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Returns & Refunds
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Because each artwork is unique and often made to order, we have a limited return policy.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Damaged or defective</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Full refund or replacement if artwork arrives damaged
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">7-day window</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Contact us within 7 days of delivery with photos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Original condition</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Must be returned in original condition with packaging
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-yellow-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4">Quick Tips</h3>
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

            {/* International Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">International Orders</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">10-21 business days typically</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Customs duties are buyer's responsibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Full tracking provided</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Support className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Questions about your shipment? We're here to help.
              </p>
              <a
                href="/contact"
                className="inline-block w-full text-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-100 dark:border-yellow-800">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ready to start shopping?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Browse thousands of unique artworks from talented artists around the world.
            </p>
            <a
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            >
              <Package className="w-4 h-4" />
              Explore Gallery
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}