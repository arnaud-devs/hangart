"use client";

import { Card, CardContent } from "@/components/dashboard/ui/card";
import { TrendingUp, Users, BookOpen, Award } from "lucide-react";
import React from "react";

const iconComponents = {
  Users: Users,
  BookOpen: BookOpen,
  Award: Award,
  TrendingUp: TrendingUp
} as const;

type IconName = keyof typeof iconComponents;

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: IconName;
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon
}: StatsCardProps) => {
  const IconComponent = iconComponents[icon];
  const isPositive = changeType === 'positive';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {change}
            </p>
          </div>
          <div className={`p-3 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            <IconComponent className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};