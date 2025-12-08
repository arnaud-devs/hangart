"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star, Shield, Lock, DollarSign, X, Bookmark, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, subtotal } = useCart();
  const isEmpty = items.length === 0;
  const [promoExpanded, setPromoExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Cart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                Cart
              </h1>

              {isEmpty ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                      <ShoppingBag className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
                    Your Cart Is Empty.
                  </p>
                  <Link
                    href="/gallery"
                    className="inline-block px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    BROWSE ART
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {items.map((item) => {
                      const imageSrc = (item as any).image || (item as any).main_image || '';
                      const artistDisplay = (item as any).artistName || (item as any).artist_name || '';
                      const currencySymbol = (item as any).currency || '$';
                      return (
                      <div
                        key={item.id}
                        className="flex gap-4 sm:gap-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        {/* Artwork Image */}
                        <div className="relative w-24 h-32 sm:w-32 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded-md shrink-0 overflow-hidden">
                          {imageSrc && (
                            <Image
                              src={imageSrc}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 96px, 128px"
                            />
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg mb-1">
                                {item.title}
                              </h3>
                              {artistDisplay && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {artistDisplay}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Photography
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 h-6 w-6 shrink-0"
                              aria-label="Remove item"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                              <span className="text-gray-900 dark:text-gray-100 font-medium">Included</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold">
                              <span className="text-gray-900 dark:text-gray-100">ARTWORK TOTAL</span>
                              <span className="text-gray-900 dark:text-gray-100">
                                {currencySymbol}{item.price?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                            <div className="pt-2">
                              <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium rounded">
                                FINAL SALE
                              </span>
                            </div>
                          </div>

                          <button className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                            <Bookmark className="w-4 h-4" />
                            Save for Later
                          </button>
                        </div>
                      </div>
                    );
                    })}
                  </div>

                  {/* Promo Code Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setPromoExpanded(!promoExpanded)}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <span>APPLY PROMO CODE / GIFT CARD</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${promoExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {promoExpanded && (
                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                        <button className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 font-medium">
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              {!isEmpty && (
                <>
                  {/* Order Summary */}
                  <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Order Summary
                    </h2>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ESTIMATED TOTAL
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-6">
                      1. The purchase of photography and limited edition artworks as shipped by the artist is final sale.
                    </p>

                    <Link
                      href="/checkout"
                      className="block w-full py-3 bg-yellow-600 hover:bg-green-700 text-white text-center font-semibold rounded-md transition-colors"
                    >
                      CHECKOUT
                    </Link>
                  </div>
                </>
              )}

              {/* Trust Badges */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-gray-900 dark:text-gray-100 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      Thousands Of Five-Star Reviews
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      We deliver world-class customer service to all of our art buyers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-900 dark:text-gray-100 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      Satisfaction Guaranteed
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Our 14-day satisfaction guarantee allows you to buy with confidence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-gray-900 dark:text-gray-100 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      Safe & Secure Shopping
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      All payments and transactions are secure and encrypted.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-900 dark:text-gray-100 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      Support An Artist With Every Purchase
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      We pay our artists more on every sale than other galleries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Need More Help?
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    ENJOY COMPLIMENTARY
                    <br />
                    ART ADVISORY
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    CONTACT CUSTOMER
                    <br />
                    SUPPORT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
