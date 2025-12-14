"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Calendar, Shield, CreditCard, Palette, Users, AlertCircle, Home, Building } from "lucide-react";

export default function TermsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            By accessing and using HangArt ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            These Terms of Service ("Terms") govern your access to and use of HangArt's website, mobile applications, and services. 
            We reserve the right to update these Terms at any time, and your continued use of the Platform constitutes acceptance of any changes.
          </p>
        </div>
      ),
    },
    {
      id: "accounts",
      title: "User Accounts & Registration",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Account Creation</h3>
          <p className="text-gray-700 dark:text-gray-300">
            To access certain features of the Platform, you must register for an account. You agree to provide accurate, 
            current, and complete information during the registration process and to update such information to keep it accurate, 
            current, and complete.
          </p>
          
          <h3 className="font-semibold text-gray-900 dark:text-white">Account Security</h3>
          <p className="text-gray-700 dark:text-gray-300">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that 
            occur under your account. You must immediately notify us of any unauthorized use of your account or any other 
            breach of security.
          </p>
        </div>
      ),
    },
    {
      id: "artist-terms",
      title: "Artist Terms & Obligations",
      icon: <Palette className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Artwork Submission</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Artists may upload original artwork to the Platform. By uploading artwork, you represent and warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
            <li>You are the original creator and copyright owner of the artwork.</li>
            <li>The artwork does not infringe on any third-party intellectual property rights.</li>
            <li>The artwork does not contain illegal, offensive, or inappropriate content.</li>
            <li>All information provided about the artwork is accurate.</li>
          </ul>

          <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Commission Structure</h3>
          <p className="text-gray-700 dark:text-gray-300">
            HangArt charges a commission on each sale made through the Platform. The current commission rate is 15% of the 
            sale price. Artists receive 85% of the sale price after the transaction is completed and verified.
          </p>
        </div>
      ),
    },
    {
      id: "purchases",
      title: "Purchases & Payments",
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Making Purchases</h3>
          <p className="text-gray-700 dark:text-gray-300">
            All purchases made through the Platform are subject to acceptance by the Artist and HangArt. We reserve the right 
            to refuse or cancel any order for any reason.
          </p>

          <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Payment Processing</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Payments are processed securely through our third-party payment processors. We accept major credit cards, debit 
            cards, and other payment methods as indicated during checkout.
          </p>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Shipping Policy</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Shipping is handled by the Artist or HangArt, depending on the arrangement. Estimated delivery times are provided 
            at checkout but are not guaranteed.
          </p>

          <h3 className="font-semibold text-gray-900 dark:text-white mt-4">International Shipping</h3>
          <p className="text-gray-700 dark:text-gray-300">
            International orders may be subject to customs duties, taxes, and fees imposed by the destination country. 
            These charges are the responsibility of the buyer.
          </p>
        </div>
      ),
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Return Policy</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Due to the unique nature of original artwork, returns are generally not accepted unless the item is significantly 
            different from its description or arrives damaged.
          </p>

          <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Refund Process</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Approved returns will be refunded using the original payment method within 10-14 business days after we receive 
            and inspect the returned item.
          </p>
        </div>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Ownership of Content</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Artists retain all intellectual property rights to their artwork. By uploading artwork to the Platform, you grant 
            HangArt a non-exclusive, worldwide, royalty-free license to display, reproduce, and promote your artwork.
          </p>

          <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Buyer Rights</h3>
          <p className="text-gray-700 dark:text-gray-300">
            When you purchase artwork, you acquire ownership of the physical artwork but not the copyright or reproduction rights 
            unless explicitly stated by the Artist.
          </p>
        </div>
      ),
    },
    {
      id: "prohibited",
      title: "Prohibited Activities",
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
            <li>Uploading content that infringes on third-party intellectual property rights</li>
            <li>Using the Platform for any illegal or unauthorized purpose</li>
            <li>Attempting to gain unauthorized access to other user accounts</li>
            <li>Harassing, threatening, or defaming other users</li>
            <li>Engaging in fraudulent transactions</li>
          </ul>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg space-y-2 border border-yellow-100 dark:border-yellow-800">
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Email:</span>
              <a href="mailto:support@hangart.com" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                support@hangart.com
              </a>
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Legal:</span>
              <a href="mailto:legal@hangart.com" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                legal@hangart.com
              </a>
            </p>
            <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Address:</span>
              <span>
                HangArt Inc.<br />
                123 Art Street, Suite 100<br />
                New York, NY 10001
              </span>
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Simple Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-3">
                <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Terms of Service
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Terms & Conditions
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please read these terms carefully before using HangArt. By accessing our platform, you agree to be bound by these terms.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: December 9, 2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Quick Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setExpandedSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
              >
                <span className="text-yellow-600 dark:text-yellow-400">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
            <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Legal Agreement</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By using our platform, you enter into a legally binding agreement with HangArt.
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
            <Palette className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Artist Rights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Artists retain full copyright to their artwork while granting us display rights.
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
            <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Secure Transactions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All payments are processed securely through trusted payment providers.
            </p>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                    {section.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="text-yellow-600 dark:text-yellow-400">
                  {expandedSection === section.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              {expandedSection === section.id && (
                <div className="px-4 pb-4">
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legal Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-900 dark:text-yellow-100">
              <p className="font-medium mb-1">Important Legal Notice</p>
              <p>
                These Terms of Service constitute a legally binding agreement between you and HangArt. Please ensure you read 
                and understand all sections. If you have any questions, please contact our legal team.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            By continuing to use HangArt, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Return to Home
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
            >
              <Building className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}