"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { BarChart3, Award, Users, BookOpen, TrendingUp } from "lucide-react";
import { StatsCard } from "./stats-card";

export const AnalyticsPage = () => {
  return (
    <main className="flex-1 w-full h-full overflow-x-hidden overflow-y-auto bg-gray-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">Performance metrics and insights</p>
        </div> */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Completion Rate"
            value="87%"
            change="+5% this month"
            changeType="positive"
            icon="Award"
          />
          <StatsCard
            title="Student Engagement"
            value="92%"
            change="+3% this month"
            changeType="positive"
            icon="Users"
          />
          <StatsCard
            title="Average Grade"
            value="B+"
            change="Same as last month"
            changeType="positive"
            icon="BookOpen"
          />
          <StatsCard
            title="Satisfaction Rate"
            value="4.8/5"
            change="+0.2 this month"
            changeType="positive"
            icon="TrendingUp"
          />
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2">Enrollment chart visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completion Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2">Completion overview visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2">Detailed analytics visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};