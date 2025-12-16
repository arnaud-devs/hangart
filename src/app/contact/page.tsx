"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, User, AtSign, MessageSquare, Building, CheckCircle, MessageCircle, Globe, Linkedin, Instagram, Twitter, Facebook, Sparkles, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus("success");
    setFormData({ name: "", email: "", subject: "", category: "general", message: "" });
    
    setTimeout(() => setStatus("idle"), 5000);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      content: "hello@hangart.com",
      description: "Reply within a day",
      link: "mailto:hello@hangart.com",
      color: "bg-yellow-500 dark:bg-yellow-500"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      content: "+1 (555) 234-5678",
      description: "Mon-Fri, 9am-5pm EST",
      link: "tel:+15552345678",
      color: "bg-yellow-500 dark:bg-yellow-500"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Office",
      content: "Brooklyn, New York",
      description: "By appointment only",
      link: "#",
      color: "bg-yellow-500 dark:bg-yellow-500"
    }
  ];

  const categories = [
    { value: "general", label: "General Question" },
    { value: "artist", label: "I'm an Artist" },
    { value: "buyer", label: "Buying Art" },
    { value: "technical", label: "Technical Problem" },
  ];

  const faqs = [
    {
      question: "How do I submit my artwork?",
      answer: "Fill out the contact form and select 'I'm an Artist' as your topic. We'll get back to you with next steps."
    },
    {
      question: "Can I buy art directly from the website?",
      answer: "Yes! Browse our collection and use the contact form for any questions about purchasing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, PayPal, and bank transfers."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by location, but most orders are delivered within 7-14 business days."
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative text-white py-20 overflow-hidden">
        {/* Grid overlay matches global style; rely on body background */}
        <div className="absolute inset-0 -z-10 hidden dark:block" style={{
          backgroundColor: '#000000',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 40px 40px',
          backgroundPosition: '0 0, 0 0',
        }} />
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:text-white text-black">
          <div className="text-center max-w-3xl mx-auto ">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">We'd love to hear from you</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl  leading-relaxed dark:text-white text-black">
              Questions about selling your art? Need help with an order? Just want to say hi? Drop us a line and we'll get back to you soon.
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              target={method.link.startsWith("http") ? "_blank" : undefined}
              rel={method.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-black/5 dark:border-white/10"
            >
              <div className="w-12 h-12 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center mb-4 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/50 transition-colors">
                <div className="text-yellow-600 dark:text-yellow-400">
                  {method.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {method.title}
              </h3>
              <p className="text-gray-900 dark:text-yellow-400 font-medium mb-1">
                {method.content}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {method.description}
              </p>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-black/5 dark:border-white/10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Send us a message
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Jane Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Topic
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {status === "success" && (
                <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">
                      Message sent!
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      {"We'll get back to you soon."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            {/* Office Hours */}
            <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Office Hours
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                  <span className="font-medium text-gray-900 dark:text-white">9am - 5pm EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                  <span className="font-medium text-gray-900 dark:text-white">Closed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                  <span className="font-medium text-gray-900 dark:text-white">Closed</span>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-black/5 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Common Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-900 dark:text-white mb-1 text-sm">
                      {faq.question}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Find Us Online</h3>
              <p className="text-emerald-50 text-sm mb-4">
                Follow for artist features and new artwork drops
              </p>
              <div className="grid grid-cols-4 gap-3">
                <a
                  href="#"
                  className="w-full aspect-square bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-full aspect-square bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-full aspect-square bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-full aspect-square bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Banner */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-600 rounded-xl mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
                <p className="text-gray-400 text-sm">
                  Most messages get a reply within 24 hours
                </p>
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justifycenter w-12 h-12 bg-yellow-600 rounded-xl mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real People</h3>
                <p className="text-gray-400 text-sm">
                  No bots here—you'll talk to actual humans on our team
                </p>
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-600 rounded-xl mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Worldwide</h3>
                <p className="text-gray-400 text-sm">
                  Supporting artists and collectors around the globe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}