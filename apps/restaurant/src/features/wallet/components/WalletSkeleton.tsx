import { Skeleton } from "@repo/ui";

export default function WalletSkeleton() {
  return (
    <div className="min-h-screen pb-20 pr-8 pl-4 pt-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton width="w-48" height="h-10" rounded="lg" className="mb-2" />
        <Skeleton width="w-96" height="h-5" rounded="md" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Skeleton width="w-full" height="h-72" rounded="3xl" className="md:col-span-1" />
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Skeleton width="w-full" height="h-72" rounded="3xl" />
          <Skeleton width="w-full" height="h-72" rounded="3xl" />
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Table Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] p-6 border border-gray-100 h-[600px] shadow-sm">
            <div className="flex justify-between mb-8">
              <Skeleton width="w-48" height="h-8" rounded="lg" />
              <div className="flex gap-2">
                <Skeleton width="w-10" height="h-10" rounded="lg" />
                <Skeleton width="w-10" height="h-10" rounded="lg" />
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} width="w-full" height="h-16" rounded="xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-8">
          <Skeleton width="w-full" height="h-[240px]" rounded="3xl" />
          <Skeleton width="w-full" height="h-[200px]" rounded="3xl" />
        </div>
      </div>
    </div>
  );
}
