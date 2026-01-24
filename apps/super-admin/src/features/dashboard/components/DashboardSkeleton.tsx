'use client';

import { motion } from "@repo/ui/motion";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-8 pb-32 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Left Column Skeleton */}
          <div className="space-y-6 xl:col-span-1">
            <div className="relative h-[220px]">
              <div className="absolute inset-0 bg-gray-200 rounded-[32px]"></div>
            </div>
            <div className="h-[200px] bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="h-4 w-32 bg-gray-100 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-100 rounded"></div>
                <div className="h-4 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
            <div className="h-[250px] bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="h-4 w-40 bg-gray-100 rounded mb-6"></div>
              <div className="h-[150px] bg-gray-50 rounded-xl"></div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="xl:col-span-2 space-y-8">
            <div className="h-[350px] bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between mb-8">
                <div className="h-6 w-48 bg-gray-100 rounded"></div>
                <div className="h-6 w-24 bg-gray-100 rounded"></div>
              </div>
              <div className="h-[200px] bg-gray-50 rounded-2xl"></div>
            </div>

            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded ml-2"></div>
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="min-w-[280px] h-[120px] bg-white rounded-3xl shadow-sm border border-gray-100"></div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="h-6 w-48 bg-gray-100 rounded"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-3 w-24 bg-gray-50 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
