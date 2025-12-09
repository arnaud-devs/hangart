"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Cookie,
  Database,
  Bell,
  Mail,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Fingerprint,
  Globe
} from "lucide-react";

export default function PrivacyPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "overview",
      title: "What We Collect & Why",
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            We collect information to provide a better experience on HangArt. Here's a straightforward breakdown of what we gather and why:
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Account Information
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                When you sign up, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Name and email address</li>
                <li>Password (encrypted)</li>
                <li>Profile details you choose to add</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Why:</strong> To create your account and let you log in
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Purchase Information
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                When you buy artwork:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Shipping address</li>
                <li>Payment details (processed securely by our payment partners)</li>
                <li>Order history</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Why:</strong> To complete and ship your orders
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Usage Data
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                We track how people use the site:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Pages you visit</li>
                <li>Artworks you view and favorite</li>
                <li>Device and browser information</li>
                <li>IP address and location (city/country level)</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Why:</strong> To improve the site and show you relevant artwork
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <Cookie className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Like most websites, we use cookies and similar technologies. Here's what you should know:
          </p>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Essential Cookies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These are required for the site to work. They remember your login, cart items, and preferences. 
                You can't turn these off without breaking the site.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Cookies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Help us understand how people use HangArt so we can make improvements. We use tools like Google Analytics.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Marketing Cookies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Show you relevant ads for artwork you might like. You can opt out of these in your browser settings.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Most browsers let you control cookies through settings. Blocking all cookies may affect site functionality.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "Who We Share Data With",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            We don't sell your personal information. Period. But we do share data with certain partners to run the business:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Artists</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When you buy artwork, the artist receives your shipping info to fulfill the order
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Payment Processors</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We use trusted payment partners (like Stripe) to handle transactions securely
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Shipping Companies</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Couriers need your address to deliver artwork
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Service Providers</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Companies that help us with email, analytics, and hosting (all bound by strict agreements)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Legal Requirements</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We may disclose data if required by law or to protect our rights
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "How We Protect Your Data",
      icon: <ShieldCheck className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Security is important to us. Here's how we keep your information safe:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Encryption</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All data is encrypted in transit and at rest
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <Fingerprint className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Limited employee access with authentication
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <Database className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Regular Backups</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data backed up regularly to prevent loss
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Monitoring</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                24/7 monitoring for suspicious activity
              </p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Note:</strong> No system is 100% secure. While we take every precaution, we can't guarantee absolute security.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      icon: <Fingerprint className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            You have control over your personal information. Here's what you can do:
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Access Your Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Request a copy of all the personal data we have about you
              </p>
            </div>

            <div className="border-l-4 border-emerald-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Correct Information</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update or fix any incorrect information in your account
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Delete Your Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Request deletion of your account and associated data (some transaction records may be retained for legal reasons)
              </p>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Opt Out of Marketing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unsubscribe from promotional emails at any time (we'll still send order confirmations)
              </p>
            </div>

            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Data Portability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Export your data in a machine-readable format
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              To exercise any of these rights, email us at <a href="mailto:privacy@hangart.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">privacy@hangart.com</a>. 
              We'll respond within 30 days.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "children",
      title: "Children's Privacy",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            HangArt is not intended for children under 13. We don't knowingly collect information from kids.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If you're a parent and believe your child has provided us with personal information, please contact us 
            and we'll delete it promptly.
          </p>
        </div>
      ),
    },
    {
      id: "international",
      title: "International Users",
      icon: <Globe className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            HangArt operates globally, and your data may be transferred to and stored in the United States or other countries 
            where our service providers operate.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By using our platform, you consent to this transfer. We ensure all transfers comply with applicable data 
            protection laws and use appropriate safeguards.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>EU Users:</strong> We comply with GDPR requirements. You have additional rights under European law, 
              including the right to lodge a complaint with your local data protection authority.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            We may update this privacy policy from time to time. When we do, we'll:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Update the "Last Updated" date at the top</li>
            <li>Notify you via email for significant changes</li>
            <li>Post a notice on the site</li>
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Continued use of HangArt after changes means you accept the updated policy.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Questions about this privacy policy or how we handle your data? We're here to help.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3">
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">Email:</span>
              <a href="mailto:privacy@hangart.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                privacy@hangart.com
              </a>
            </p>
            <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <span>
                <span className="font-medium">Address:</span><br />
                HangArt Inc.<br />
                123 Art Street, Suite 100<br />
                Brooklyn, NY 10001
              </span>
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Your Privacy Matters</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-indigo-50 leading-relaxed">
              We're committed to protecting your personal information. This policy explains what data we collect, 
              how we use it, and what rights you have.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-indigo-100">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: December 9, 2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">We Don't Sell Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your information stays private and is never sold to third parties
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Storage</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All data is encrypted and protected with industry standards
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Fingerprint className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">You're in Control</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access, update, or delete your data anytime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Jump to Section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setExpandedSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              >
                <span className="text-indigo-600 dark:text-indigo-400">{section.icon}</span>
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
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
                <div className="text-indigo-600 dark:text-indigo-400">
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

        {/* Bottom Notice */}
        <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-900 dark:text-indigo-100">
              <p className="font-semibold mb-2">Stay Informed</p>
              <p>
                We'll notify you by email if we make significant changes to this privacy policy. Check back occasionally 
                to stay up to date with how we're protecting your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
