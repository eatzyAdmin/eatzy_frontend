"use client";

import React from "react";
import { Skeleton, SkeletonGroup } from "@repo/ui";
import { motion } from "@repo/ui/motion";

export const ProfileSectionShimmer = ({ type }: { type: 'personal' | 'vehicle' | 'bank' | 'notifications' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const HeaderShimmer = ({ badgeColor }: { badgeColor: string }) => (
    <div className="flex flex-col gap-2 mb-8">
      <div className="flex items-center gap-2">
        <div className={`px-2.5 py-0.5 rounded-lg ${badgeColor} w-24 h-4 overflow-hidden relative opacity-60`}>
           <Skeleton width="w-full" height="h-full" rounded="sm" />
        </div>
      </div>
      <Skeleton width="w-[400px] max-w-full" height="h-10 md:h-14" rounded="xl" />
      <Skeleton width="w-64 max-w-full" height="h-5" rounded="md" />
    </div>
  );

  if (type === 'personal') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <HeaderShimmer badgeColor="bg-lime-100" />
          <div className="hidden md:block">
            <Skeleton width="w-48" height="h-14" rounded="3xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 lg:gap-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="group relative">
               <Skeleton width="w-20" height="h-3" rounded="full" className="mb-1 ml-1" />
               <Skeleton height="h-14 md:h-[68px]" rounded="3xl" className="bg-slate-50 border-2 border-transparent" />
            </div>
          ))}
          <div className="group relative md:col-span-2">
             <Skeleton width="w-24" height="h-3" rounded="full" className="mb-1 ml-1" />
             <Skeleton height="h-[100px] md:h-[120px]" rounded="3xl" className="bg-slate-50 border-2 border-transparent" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'vehicle') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <HeaderShimmer badgeColor="bg-blue-100" />
        <div className="relative overflow-hidden rounded-[32px] bg-white border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <Skeleton width="w-full md:w-1/3" height="aspect-[4/3]" rounded="2xl" className="bg-slate-50" />
             <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4 md:mt-0">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="space-y-2">
                    <Skeleton width="w-20" height="h-3" rounded="full" />
                    <Skeleton width="w-3/4" height="h-7" rounded="md" />
                 </div>
               ))}
             </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-slate-50 rounded-[28px] p-6 border border-transparent">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton width="w-10" height="h-10" rounded="xl" />
                  <Skeleton width="w-32" height="h-5" rounded="md" />
                </div>
                <Skeleton width="w-16" height="h-6" rounded="lg" />
              </div>
              <Skeleton height="aspect-video" rounded="2xl" className="bg-white border-2 border-dashed border-gray-100" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === 'bank') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <HeaderShimmer badgeColor="bg-indigo-100" />
        <div className="relative overflow-hidden rounded-[36px] bg-[#1A1A1A] p-8 md:p-10 h-[280px] md:h-[340px]">
           <div className="flex justify-between items-start mb-12">
              <div className="flex items-center gap-4">
                <Skeleton width="w-14" height="h-14" rounded="2xl" className="bg-white/10" />
                <div className="space-y-2">
                   <Skeleton width="w-24" height="h-3" rounded="full" className="bg-white/10" />
                   <Skeleton width="w-48" height="h-6" rounded="md" className="bg-white/10" />
                </div>
              </div>
              <Skeleton width="w-24" height="h-8" rounded="xl" className="bg-white/10" />
           </div>
           <div className="space-y-8">
              <div className="space-y-2">
                 <Skeleton width="w-20" height="h-3" rounded="full" className="bg-white/10" />
                 <Skeleton width="w-3/4" height="h-8" rounded="md" className="bg-white/10" />
              </div>
              <div className="flex justify-between items-end">
                 <div className="space-y-2">
                    <Skeleton width="w-20" height="h-3" rounded="full" className="bg-white/10" />
                    <Skeleton width="w-40" height="h-6" rounded="md" className="bg-white/10" />
                 </div>
                 <Skeleton width="w-16" height="h-10" rounded="lg" className="bg-white/10" />
              </div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Skeleton height="h-24" rounded="3xl" className="bg-slate-50" />
           <Skeleton height="h-48" rounded="3xl" className="bg-slate-50" />
        </div>
      </motion.div>
    );
  }

  if (type === 'notifications') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {[1, 2].map(section => (
          <div key={section} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
              <Skeleton width="w-32" height="h-4" rounded="md" />
            </div>
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map(i => (
                <div key={i} className="px-6 py-5 flex items-center justify-between">
                  <div className="flex gap-4">
                    <Skeleton width="w-10" height="h-10" rounded="2xl" />
                    <div className="space-y-2">
                       <Skeleton width="w-24" height="h-4" rounded="md" />
                       <Skeleton width="w-48" height="h-3" rounded="full" />
                    </div>
                  </div>
                  <Skeleton width="w-12" height="h-6" rounded="full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return null;
};
