"use client";

import React, { useEffect, useState } from 'react';
import { artworkService, artistService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import StatsCard from '@/components/dashboard/StatsCard';
import { Image, TrendingUp, Eye, Heart, DollarSign } from 'lucide-react';

type ColorType = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'emerald';

interface StatsCardData {
  title: string;
  value: string | number;
  icon: any;
  color: ColorType;
  description: string;
  trend?: { value: number; isPositive: boolean };
}

export default function ArtistDashboardView({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch only the current user's artworks
      const myArtworksResponse = await artistService.getMyArtworks();
      const artworksList = (myArtworksResponse as any).results || myArtworksResponse || [];

      const totalRevenue = artworksList.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0);
      const soldArtworks = artworksList.filter((a: any) => a.status === 'sold');
      const totalSoldRevenue = soldArtworks.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0);

      setStats({
        total_artworks: artworksList.length,
        total_revenue: totalRevenue,
        approved_artworks: artworksList.filter((a: any) => a.status === 'approved').length,
        pending_artworks: artworksList.filter((a: any) => a.status === 'pending').length,
        sold_artworks: soldArtworks.length,
        sold_revenue: totalSoldRevenue,
      });

      setArtworks(artworksList.slice(0, 6));
    } catch (error) { 
      console.error('Error loading artist dashboard:', error);
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto animate-pulse">Loading artist dashboard...</div>
      </div>
    );
  }

  const statsCards: StatsCardData[] = [
    {
      title: "Total Artworks",
      value: stats?.total_artworks || 0,
      icon: Image,
      color: "blue",
      description: "Your artworks",
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Inventory Value",
      value: `$${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "emerald",
      description: "Earnings",
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Approved Artworks",
      value: stats?.approved_artworks || 0,
      icon: TrendingUp,
      color: "green",
      description: "Published pieces",
      trend: { value: 3, isPositive: true }
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.sold_revenue || 0).toLocaleString()}`,
      icon: Heart,
      color: "red",
      description: "Total price of sold pieces",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Pending Review",
      value: stats?.pending_artworks || 0,
      icon: TrendingUp,
      color: "orange",
      description: "Awaiting approval",
    }
  ];

  return (
    <div className="space-y-6 bg-[#f7f7f8] dark:bg-black">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 mb-8 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artist Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.first_name}! Manage your artworks and track your success.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

        {/* Your Artworks */}
        <div className="bg-white dark:bg-white/5 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Artworks</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artworks.map((artwork: any) => (
              <div key={artwork.id} className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-lg transition-shadow">
                <img
                  src={artwork.main_image || '/placeholder.jpg'}
                  alt={artwork.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <div className="p-3 w-full text-white">
                    <p className="font-medium text-sm truncate">{artwork.title}</p>
                    <p className="text-xs text-gray-200">${Number(artwork.price).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
