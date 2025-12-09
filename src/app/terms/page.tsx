"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Calendar, Shield, CreditCard, Palette, Users, AlertCircle } from "lucide-react";

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
          <p>
            By accessing and using HangArt ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
          <p>
            These Terms of Service ("Terms") govern your access to and use of HangArt's website, mobile applications, and services. 
            We reserve the right to update these Terms at any time, and your continued use of the Platform constitutes acceptance of any changes.
          </p>
        </div>
      ),
    },
    {
      id: "definitions",
      title: "Definitions",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-3 list-none">
            <li className="flex gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 min-w-[100px]">Platform:</span>
              <span>Refers to HangArt's website, mobile applications, and all related services.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 min-w-[100px]">User:</span>
              <span>Any individual or entity that accesses or uses the Platform.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 min-w-[100px]">Artist:</span>
              <span>A User who creates and uploads artwork for sale on the Platform.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 min-w-[100px]">Buyer:</span>
              <span>A User who purchases artwork through the Platform.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 min-w-[100px]">Content:</span>
              <span>All text, images, artwork, graphics, and other materials uploaded to the Platform.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "accounts",
      title: "User Accounts & Registration",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Creation</h3>
          <p>
            To access certain features of the Platform, you must register for an account. You agree to provide accurate, 
            current, and complete information during the registration process and to update such information to keep it accurate, 
            current, and complete.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Security</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that 
            occur under your account. You must immediately notify us of any unauthorized use of your account or any other 
            breach of security.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Types</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Buyer Accounts:</strong> Allow you to browse, purchase, and review artwork.</li>
            <li><strong>Artist Accounts:</strong> Enable you to upload, manage, and sell your artwork on the Platform.</li>
            <li><strong>Admin Accounts:</strong> Reserved for Platform administrators with additional privileges.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "artist-terms",
      title: "Artist Terms & Obligations",
      icon: <Palette className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Artwork Submission</h3>
          <p>
            Artists may upload original artwork to the Platform. By uploading artwork, you represent and warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You are the original creator and copyright owner of the artwork.</li>
            <li>The artwork does not infringe on any third-party intellectual property rights.</li>
            <li>The artwork does not contain illegal, offensive, or inappropriate content.</li>
            <li>All information provided about the artwork (title, description, price, medium) is accurate.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Pricing & Availability</h3>
          <p>
            Artists have full control over the pricing and availability of their artwork. You may mark artwork as available 
            or unavailable for sale at any time. Once a sale is completed, the artwork must be delivered as described.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Commission Structure</h3>
          <p>
            HangArt charges a commission on each sale made through the Platform. The current commission rate is 15% of the 
            sale price. Artists receive 85% of the sale price after the transaction is completed and verified.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Content Moderation</h3>
          <p>
            We reserve the right to review, reject, or remove any artwork that violates these Terms or our content policies. 
            This includes but is not limited to artwork that is plagiarized, offensive, or misrepresented.
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Making Purchases</h3>
          <p>
            All purchases made through the Platform are subject to acceptance by the Artist and HangArt. We reserve the right 
            to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing 
            or product information, or suspected fraudulent activity.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Payment Processing</h3>
          <p>
            Payments are processed securely through our third-party payment processors. We accept major credit cards, debit 
            cards, and other payment methods as indicated during checkout. By providing payment information, you represent 
            that you are authorized to use the payment method.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Pricing</h3>
          <p>
            All prices are listed in USD unless otherwise stated. Prices are subject to change without notice. Additional 
            charges such as shipping, taxes, and handling fees may apply and will be clearly displayed before purchase completion.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Order Confirmation</h3>
          <p>
            After placing an order, you will receive an email confirmation with order details. This confirmation does not 
            signify acceptance of your order; it is merely a receipt of your order. Acceptance occurs when the Artist confirms 
            the order and begins processing.
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Policy</h3>
          <p>
            Shipping is handled by the Artist or HangArt, depending on the arrangement. Estimated delivery times are provided 
            at checkout but are not guaranteed. Actual delivery times may vary based on location, shipping method, and other factors.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">International Shipping</h3>
          <p>
            International orders may be subject to customs duties, taxes, and fees imposed by the destination country. 
            These charges are the responsibility of the buyer and are not included in the purchase price or shipping cost.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Lost or Damaged Items</h3>
          <p>
            If an item is lost or damaged during shipping, please contact us within 7 days of the expected delivery date. 
            We will work with you and the Artist to resolve the issue, which may include a replacement, refund, or insurance claim.
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Return Policy</h3>
          <p>
            Due to the unique nature of original artwork, returns are generally not accepted unless the item is significantly 
            different from its description or arrives damaged. Buyers must contact us within 7 days of delivery to initiate 
            a return request.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Refund Process</h3>
          <p>
            Approved returns will be refunded using the original payment method within 10-14 business days after we receive 
            and inspect the returned item. Shipping costs are non-refundable unless the return is due to our error or a 
            defective product.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Non-Returnable Items</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Custom or commissioned artwork</li>
            <li>Digital downloads or prints</li>
            <li>Items marked as "final sale"</li>
            <li>Artwork damaged due to buyer negligence</li>
          </ul>
        </div>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ownership of Content</h3>
          <p>
            Artists retain all intellectual property rights to their artwork. By uploading artwork to the Platform, you grant 
            HangArt a non-exclusive, worldwide, royalty-free license to display, reproduce, and promote your artwork on the 
            Platform and in marketing materials.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Buyer Rights</h3>
          <p>
            When you purchase artwork, you acquire ownership of the physical artwork but not the copyright or reproduction rights 
            unless explicitly stated by the Artist. You may not reproduce, distribute, or create derivative works from the artwork 
            without the Artist's permission.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Platform Content</h3>
          <p>
            All content on the Platform, including but not limited to text, graphics, logos, icons, and software, is the property 
            of HangArt or its licensors and is protected by copyright, trademark, and other intellectual property laws.
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
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Uploading content that infringes on third-party intellectual property rights</li>
            <li>Using the Platform for any illegal or unauthorized purpose</li>
            <li>Attempting to gain unauthorized access to other user accounts or Platform systems</li>
            <li>Transmitting viruses, malware, or other harmful code</li>
            <li>Harassing, threatening, or defaming other users</li>
            <li>Manipulating prices or engaging in fraudulent transactions</li>
            <li>Scraping or collecting user data without permission</li>
            <li>Impersonating another person or entity</li>
            <li>Interfering with the proper functioning of the Platform</li>
            <li>Circumventing security or authentication measures</li>
          </ul>
        </div>
      ),
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Disclaimer of Warranties</h3>
          <p>
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
            WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Limitation of Liability</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, HANGART SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE 
            LOSSES ARISING FROM YOUR USE OF THE PLATFORM.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless HangArt and its affiliates, officers, directors, employees, and agents 
            from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the 
            Platform or violation of these Terms.
          </p>
        </div>
      ),
    },
    {
      id: "termination",
      title: "Termination",
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, 
            including but not limited to violation of these Terms or engaging in fraudulent or illegal activity.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Effect of Termination</h3>
          <p>
            Upon termination, your right to use the Platform will immediately cease. Any pending transactions will be completed 
            or refunded as appropriate. Sections of these Terms that by their nature should survive termination will remain in effect.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Voluntary Closure</h3>
          <p>
            You may close your account at any time by contacting our support team. You remain responsible for any outstanding 
            obligations at the time of closure.
          </p>
        </div>
      ),
    },
    {
      id: "changes",
      title: "Changes to Terms",
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            We reserve the right to modify these Terms at any time. When we make changes, we will update the "Last Updated" 
            date at the top of this page and notify users via email or through a notice on the Platform.
          </p>
          <p>
            Your continued use of the Platform after any changes to these Terms constitutes your acceptance of the new Terms. 
            If you do not agree to the modified Terms, you must stop using the Platform.
          </p>
          <p>
            Material changes that significantly affect your rights or obligations will be prominently announced, and you may 
            be required to affirmatively accept the new Terms before continuing to use certain features.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-3">
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">Email:</span>
              <a href="mailto:support@hangart.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                support@hangart.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">Legal:</span>
              <a href="mailto:legal@hangart.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                legal@hangart.com
              </a>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">Address:</span>
              <span className="text-gray-700 dark:text-gray-300">
                HangArt Inc.<br />
                123 Art Street, Suite 100<br />
                New York, NY 10001<br />
                United States
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            We aim to respond to all inquiries within 2-3 business days.
          </p>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-emerald-600 dark:bg-emerald-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-emerald-50 text-lg max-w-3xl">
            Please read these terms carefully before using HangArt. By accessing our platform, you agree to be bound by these terms and conditions.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-emerald-100">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: December 9, 2025</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setExpandedSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
              >
                <span className="text-emerald-600 dark:text-emerald-400">{section.icon}</span>
                <span className="truncate">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    {section.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="text-emerald-600 dark:text-emerald-400">
                  {expandedSection === section.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              {expandedSection === section.id && (
                <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="mt-12 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-semibold mb-2">Important Legal Notice</p>
              <p>
                These Terms of Service constitute a legally binding agreement between you and HangArt. Please ensure you read 
                and understand all sections. If you have any questions or need clarification on any terms, please contact our 
                legal team before using the Platform.
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Acknowledgment */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            By continuing to use HangArt, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              Return to Home
            </a>
            <a
              href="/gallery"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
            >
              Browse Gallery
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
