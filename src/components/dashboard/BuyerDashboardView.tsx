"use client";

import React, { useEffect, useState } from 'react';
import { artworkService } from '@/services/apiServices';
import StatsCard from '@/components/dashboard/StatsCard';
import { ShoppingBag, Heart, TrendingUp, Clock, DollarSign, Star } from 'lucide-react';

type ColorType = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'emerald';

interface StatsCardData {
  title: string;
  value: string | number;
  icon: any;
  color: ColorType;
  description: string;
  trend?: { value: number; isPositive: boolean };
}

export default function BuyerDashboardView({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteArtworks, setFavoriteArtworks] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const artworks = await artworkService.listArtworks();
      const artworksList = (artworks as any).results || [];

      // Mock data for buyer stats
      setStats({
        total_purchases: 12,
        total_spent: 3450,
        favorite_artworks: 24,
        pending_orders: 2,
        completed_orders: 10,
        average_rating: 4.5
      });

      setFavoriteArtworks(artworksList.slice(0, 6));
    } catch (error) {
      console.error('Error loading buyer dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto animate-pulse">Loading buyer dashboard...</div>
      </div>
    );
  }

  const statsCards: StatsCardData[] = [
    {
      title: "Total Purchases",
      value: stats?.total_purchases || 0,
      icon: ShoppingBag,
      color: "blue",
      description: "Items bought",
      trend: { value: 3, isPositive: true }
    },
    {
      title: "Total Spent",
      value: `$${(stats?.total_spent || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "green",
      description: "Investment in art",
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Favorite Artworks",
      value: stats?.favorite_artworks || 0,
      icon: Heart,
      color: "red",
      description: "Wishlist items",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Pending Orders",
      value: stats?.pending_orders || 0,
      icon: Clock,
      color: "orange",
      description: "In transit",
    },
    {
      title: "Completed Orders",
      value: stats?.completed_orders || 0,
      icon: TrendingUp,
      color: "emerald",
      description: "Delivered items",
      trend: { value: 2, isPositive: true }
    },
    {
      title: "Average Rating",
      value: `${stats?.average_rating || 0}/5`,
      icon: Star,
      color: "purple",
      description: "Your feedback score",
    }
  ];

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 mb-8 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Buyer Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.first_name}! Explore your purchases and favorites.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((card, index) => (
            <StatsCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              description={card.description}
              trend={card.trend}
            />
          ))}
        </div>

        {/* Favorite Artworks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Favorite Artworks</h3>
            <a href="/gallery" className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium">
              Browse More
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteArtworks.map((artwork: any) => (
              <div key={artwork.id} className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={artwork.main_image || '/placeholder.jpg'}
                  alt={artwork.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col items-end justify-between p-3">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-full text-white">
                    <p className="font-medium text-sm truncate">{artwork.title}</p>
                    <p className="text-xs text-gray-200">${Number(artwork.price).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-600" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Order #{2024001 + index}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {index === 0 ? 'Delivered' : 'In Transit'}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 ml-2">
                  ${(Math.random() * 1000).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
