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
  Shield,
  MessageCircle,
  Search,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function FaqPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Questions", icon: <HelpCircle className="w-5 h-5" /> },
    { id: "buying", label: "Buying Art", icon: <ShoppingCart className="w-5 h-5" /> },
    { id: "selling", label: "Selling Art", icon: <Palette className="w-5 h-5" /> },
    { id: "shipping", label: "Shipping", icon: <Package className="w-5 h-5" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="w-5 h-5" /> },
    { id: "account", label: "Account", icon: <Users className="w-5 h-5" /> },
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
      answer: "Most sales are online-only, but some artists offer local pickup where you can view the piece. If local pickup is available, you'll see that option at checkout. You can also message the artist directly to ask about viewings."
    },
    {
      category: "buying",
      question: "What if the artwork doesn't look like the photos?",
      answer: "Colors can vary slightly due to screen settings and lighting. If the artwork is significantly different from the description or photos, contact us within 7 days of delivery and we'll help resolve it."
    },
    {
      category: "buying",
      question: "Are all artworks original pieces?",
      answer: "Yes! Every piece on HangArt is an original work created by the artist. We don't sell mass-produced prints or reproductions unless specifically labeled as such."
    },
    {
      category: "buying",
      question: "Can I request custom artwork from an artist?",
      answer: "Many artists accept custom commissions. Check their profile for commission availability, or message them directly through the platform to discuss your ideas and pricing."
    },

    // Selling Questions
    {
      category: "selling",
      question: "How do I start selling my art on HangArt?",
      answer: "Sign up for an artist account, complete your profile, and start uploading your artwork. Add clear photos, descriptions, pricing, and details about medium and size. Once approved, your work will be visible to buyers."
    },
    {
      category: "selling",
      question: "What commission does HangArt take?",
      answer: "We take a 15% commission on each sale. You receive 85% of the sale price. This covers payment processing, platform maintenance, and customer support."
    },
    {
      category: "selling",
      question: "How and when do I get paid?",
      answer: "Payments are processed after the buyer confirms delivery or 14 days after shipping (whichever comes first). Funds are transferred to your connected bank account within 3-5 business days."
    },
    {
      category: "selling",
      question: "Who handles shipping when I sell artwork?",
      answer: "As the artist, you're responsible for packaging and shipping your work. We recommend using tracked shipping and insurance for valuable pieces. You'll receive the buyer's address once the order is confirmed."
    },
    {
      category: "selling",
      question: "Can I set my own prices?",
      answer: "Absolutely! You have full control over pricing your artwork. Consider factors like materials, time invested, size, and your experience level when setting prices."
    },
    {
      category: "selling",
      question: "What if a buyer wants to return my artwork?",
      answer: "Returns are rare since all sales include clear photos and descriptions. If there's an issue, we'll mediate between you and the buyer to find a fair solution. You're protected from fraudulent return claims."
    },

    // Shipping Questions
    {
      category: "shipping",
      question: "How long does shipping take?",
      answer: "Artists typically ship within 3-5 business days of your order. Domestic delivery is usually 5-7 business days with standard shipping. Express options are faster. International orders take 10-21 days."
    },
    {
      category: "shipping",
      question: "Do you ship internationally?",
      answer: "Yes! We ship artwork worldwide. Shipping costs and delivery times vary by destination. International buyers are responsible for any customs duties or import taxes."
    },
    {
      category: "shipping",
      question: "How much does shipping cost?",
      answer: "Shipping costs depend on the artwork's size, weight, and destination. Standard domestic shipping is free for orders over $100. Exact costs are calculated at checkout."
    },
    {
      category: "shipping",
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can use this to monitor your package's journey in real-time."
    },
    {
      category: "shipping",
      question: "What if my artwork arrives damaged?",
      answer: "We're sorry if that happens! Email us photos of the damage within 48 hours of delivery. We'll work with you and the artist to arrange a replacement or refund."
    },
    {
      category: "shipping",
      question: "Is insurance included?",
      answer: "Basic insurance is included for all shipments. For high-value pieces over $500, we recommend adding additional insurance at checkout for your peace of mind."
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
    {
      category: "payments",
      question: "Can I get a refund if I change my mind?",
      answer: "Due to the unique nature of original artwork, we can't offer refunds for change of mind. However, if the artwork is damaged, defective, or significantly different from its description, we'll provide a full refund or replacement."
    },
    {
      category: "payments",
      question: "Do prices include taxes?",
      answer: "Prices shown are before taxes. Applicable sales tax will be calculated and added at checkout based on your shipping address."
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
      question: "Can I change my email address?",
      answer: "Yes! Go to your account settings and update your email. You'll need to verify the new email address before the change takes effect."
    },
    {
      category: "account",
      question: "How do I delete my account?",
      answer: "We're sorry to see you go! Contact support at hello@hangart.com to request account deletion. Keep in mind that some transaction records may be retained for legal and accounting purposes."
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
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-800 dark:to-cyan-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Frequently Asked Questions</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How Can We Help?
          </h1>
          <p className="text-xl text-teal-50 max-w-2xl mx-auto mb-8">
            Find answers to common questions about buying, selling, and shipping artwork on HangArt.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20 mt-5">
        {/* Category Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category.icon}
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Questions</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{faqs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Categories</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{categories.length - 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Showing</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{filteredFaqs.length}</span>
                </div>
              </div>
            </div>

            {/* Still Need Help */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-2xl shadow-lg p-6 text-white">
              <MessageCircle className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Still Need Help?</h3>
              <p className="text-teal-50 text-sm mb-4">
                Can't find what you're looking for? Our support team is here for you.
              </p>
              <a
                href="/contact"
                className="block w-full text-center px-4 py-2 bg-white hover:bg-gray-100 text-teal-600 font-medium rounded-lg transition-colors"
              >
                Contact Support
              </a>
            </div>

            {/* Popular Resources */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Popular Resources</h3>
              <div className="space-y-3">
                <a href="/terms" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>Terms of Service</span>
                </a>
                <a href="/privacy" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </a>
                <a href="/shipping" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <Package className="w-4 h-4" />
                  <span>Shipping Info</span>
                </a>
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or browse a different category
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg"
                  >
                    <button
                      onClick={() => toggleFaq(faq.question)}
                      className="w-full flex items-start justify-between gap-4 p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {faq.question}
                          </h3>
                          {expandedFaq !== faq.question && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-teal-600 dark:text-teal-400">
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
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
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
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 text-center text-white">
          <CheckCircle className="w-16 h-16 text-teal-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Now that you have the answers, start discovering unique artwork from talented artists worldwide.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/gallery"
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Gallery
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
