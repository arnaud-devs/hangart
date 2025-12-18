"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Package,
  CreditCard,
  Users,
  Palette,
  Search,
  CheckCircle,
  AlertCircle,
  MessageCircle
} from "lucide-react";

export default function FaqPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Questions", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "buying", label: "Buying Art", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "selling", label: "Selling Art", icon: <Palette className="w-4 h-4" /> },
    { id: "shipping", label: "Shipping", icon: <Package className="w-4 h-4" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
    { id: "account", label: "Account", icon: <Users className="w-4 h-4" /> },
  ];

  const faqs = [
    // Buying Questions
    {
      category: "buying",
      question: "How do I purchase artwork on HangArt?",
      answer: "Browse the gallery, click on artwork you like, and add it to your cart. When ready, go to checkout, enter your shipping details and payment info, then confirm your order. You'll get an email confirmation right away."
    },
    {
      category: "buying",
      question: "Can I see the artwork in person before buying?",
      answer: "Most sales are online-only, but some artists offer local pickup where you can view the piece. If local pickup is available, you'll see that option at checkout."
    },
    {
      category: "buying",
      question: "Are all artworks original pieces?",
      answer: "Yes! Every piece on HangArt is an original work created by the artist. We don't sell mass-produced prints or reproductions unless specifically labeled as such."
    },
    {
      category: "buying",
      question: "Can I request custom artwork?",
      answer: "Many artists accept custom commissions. Check their profile for commission availability, or message them directly through the platform to discuss your ideas."
    },

    // Selling Questions
    {
      category: "selling",
      question: "How do I start selling my art on HangArt?",
      answer: "Sign up for an artist account, complete your profile, and start uploading your artwork. Add clear photos, descriptions, pricing, and details about medium and size."
    },
    {
      category: "selling",
      question: "What commission does HangArt take?",
      answer: "We take a 15% commission on each sale. You receive 85% of the sale price. This covers payment processing, platform maintenance, and customer support."
    },
    {
      category: "selling",
      question: "How and when do I get paid?",
      answer: "Payments are processed after the buyer confirms delivery or 14 days after shipping. Funds are transferred to your connected bank account within 3-5 business days."
    },
    {
      category: "selling",
      question: "Can I set my own prices?",
      answer: "Absolutely! You have full control over pricing your artwork. Consider factors like materials, time invested, size, and your experience level."
    },

    // Shipping Questions
    {
      category: "shipping",
      question: "How long does shipping take?",
      answer: "Artists typically ship within 3-5 business days. Domestic delivery is usually 5-7 business days with standard shipping. International orders take 10-21 days."
    },
    {
      category: "shipping",
      question: "Do you ship internationally?",
      answer: "Yes! We ship artwork worldwide. Shipping costs and delivery times vary by destination. International buyers are responsible for any customs duties or import taxes."
    },
    {
      category: "shipping",
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can use this to monitor your package's journey in real-time."
    },

    // Payment Questions
    {
      category: "payments",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), as well as other payment methods through our secure payment processor."
    },
    {
      category: "payments",
      question: "Is it safe to enter my payment information?",
      answer: "Absolutely. We use industry-standard encryption and work with trusted payment processors. We never store your full credit card details on our servers."
    },
    {
      category: "payments",
      question: "When will I be charged?",
      answer: "Your payment is processed immediately when you complete checkout. You'll see the charge on your statement within 1-2 business days."
    },

    // Account Questions
    {
      category: "account",
      question: "Do I need an account to buy artwork?",
      answer: "Yes, you need to create a free account to make purchases. This helps us track your orders, save your favorites, and provide better customer support."
    },
    {
      category: "account",
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link. Follow the instructions in the email to create a new password."
    },
    {
      category: "account",
      question: "Can I have both a buyer and artist account?",
      answer: "Yes! The same account can be used for both buying and selling artwork. Just enable artist features in your account settings and complete your artist profile."
    },
  ];

  const toggleFaq = (question: string) => {
    setExpandedFaq(expandedFaq === question ? null : question);
  };

  // Filter FAQs based on category and search
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-[#f7f7f8] dark:bg-black">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              Frequently Asked Questions
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions about buying, selling, and shipping artwork on HangArt.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category.icon}
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or browse a different category
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden transition-all hover:border-yellow-300 dark:hover:border-yellow-600"
                  >
                    <button
                      onClick={() => toggleFaq(faq.question)}
                      className="w-full flex items-start justify-between gap-4 p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-left">
                            {faq.question}
                          </h3>
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                            {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-gray-400">
                        {expandedFaq === faq.question ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                    
                    {expandedFaq === faq.question && (
                      <div className="px-6 pb-6">
                        <div className="pl-12 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">FAQ Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total questions</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">{faqs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Showing</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">{filteredFaqs.length}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: Today
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-yellow-600 rounded-xl p-6 text-white">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">Still need help?</h3>
              <p className="text-yellow-100 text-sm mb-4">
                Can't find what you're looking for? Our support team is here for you.
              </p>
              <a
                href="/contact"
                className="inline-block w-full text-center px-4 py-2 bg-white hover:bg-gray-100 text-yellow-600 font-medium rounded-lg transition-colors"
              >
                Contact support
              </a>
            </div>

            {/* Quick Tips */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick tips</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">✓</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Most questions are answered within 24 hours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">✓</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Check the category tabs for specific topics
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">✓</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Use specific keywords in your search
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gray-50 dark:bg-white/5 rounded-xl p-8 text-center">
          <CheckCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to explore?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Now that you have the answers, start discovering unique artwork from talented artists worldwide.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/gallery"
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse gallery
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}