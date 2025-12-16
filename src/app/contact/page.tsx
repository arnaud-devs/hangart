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
      content: "+250 787 235 97",
      description: "Mon-Fri, 9am-5pm G.M.T",
      link: "tel:+250 787 235 97",
      color: "bg-yellow-500 dark:bg-yellow-500"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Office",
      content: "Gasabo, Kigali",
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
                  <span className="font-medium text-gray-900 dark:text-white">9am - 5pm G.M.T</span>
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
          </div>
        </div>

        {/* Additional Info Banner */}
      </div>
    </main>
  );
}