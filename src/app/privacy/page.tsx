"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Cookie,
  Database,
  CheckCircle,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Fingerprint,
  Globe,
  Mail,
  Bell,
  Key,
  EyeOff,
  Building
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
          <p className="text-gray-700 dark:text-gray-300">
            We collect information to provide a better experience on HangArt. Here's a straightforward breakdown of what we gather and why:
          </p>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
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

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
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

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
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
          <p className="text-gray-700 dark:text-gray-300">
            Like most websites, we use cookies and similar technologies. Here's what you should know:
          </p>
          
          <div className="space-y-4">
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

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              Most browsers let you control cookies through settings. Blocking all cookies may affect site functionality.
            </p>
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
          <p className="text-gray-700 dark:text-gray-300">
            Security is important to us. Here's how we keep your information safe:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Encryption</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All data is encrypted in transit and at rest
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
              <Key className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Limited employee access with authentication
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
              <Database className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Regular Backups</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data backed up regularly to prevent loss
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
              <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Monitoring</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                24/7 monitoring for suspicious activity
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
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
          <p className="text-gray-700 dark:text-gray-300">
            You have control over your personal information. Here's what you can do:
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Access Your Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Request a copy of all the personal data we have about you
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Correct Information</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update or fix any incorrect information in your account
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Delete Your Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Request deletion of your account and associated data (some transaction records may be retained for legal reasons)
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Opt Out of Marketing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unsubscribe from promotional emails at any time (we'll still send order confirmations)
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Data Portability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Export your data in a machine-readable format
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              To exercise any of these rights, email us at <a href="mailto:privacy@hangart.com" className="text-yellow-600 dark:text-yellow-400 hover:underline">privacy@hangart.com</a>. 
              We'll respond within 30 days.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Questions about this privacy policy or how we handle your data? We're here to help.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 space-y-3 border border-yellow-100 dark:border-yellow-800">
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium">Email:</span>
              <a href="mailto:privacy@hangart.com" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                privacy@hangart.com
              </a>
            </p>
            <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <Building className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
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

  const privacyPrinciples = [
    {
      icon: <EyeOff className="w-6 h-6" />,
      title: "No Selling",
      description: "We never sell your personal data to third parties"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Storage",
      description: "All data encrypted with industry standards"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Transparency",
      description: "Clear policies on what we collect and why"
    },
    {
      icon: <Fingerprint className="w-6 h-6" />,
      title: "Your Control",
      description: "Access, update, or delete your data anytime"
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-black">
      {/* Simple Header */}
      <div className="border-b border-gray-200 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
                <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Privacy Policy
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Your Privacy Matters
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                We're committed to protecting your personal information and being transparent about how we handle your data.
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
        {/* Privacy Principles */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Our Privacy Principles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {privacyPrinciples.map((principle, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                  <div className="text-yellow-600 dark:text-yellow-400">
                    {principle.icon}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {principle.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white dark:bg-white/5 rounded-xl p-4 mb-8 border border-gray-200 dark:border-white/10">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setExpandedSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
              >
                <span className="text-yellow-600 dark:text-yellow-400">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {sections.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                  <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-900 dark:text-yellow-100">
              <p className="font-medium mb-1">Stay Informed</p>
              <p>
                We'll notify you by email if we make significant changes to this privacy policy. 
                Check back occasionally to stay up to date with how we're protecting your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}