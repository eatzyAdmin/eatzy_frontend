import { Skeleton } from "@repo/ui";

export default function StoreSkeleton() {
  return (
    <div className="min-h-screen pb-20 pr-8 pl-4">
      {/* Header Banner Skeleton - mimicking StoreHeader.tsx */}
      <div className="relative h-[300px] w-full shrink-0">
        <Skeleton
          width="w-full"
          height="h-full"
          rounded="3xl"
          className="rounded-b-[40px] rounded-t-none"
        />
        {/* Fake content overlapping bottom like real header */}
        <div className="absolute bottom-10 left-8 right-8 flex justify-between items-end pb-14">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton width="w-24" height="h-8" rounded="full" />
              <Skeleton width="w-32" height="h-8" rounded="lg" />
            </div>
            <Skeleton width="w-96" height="h-16" rounded="lg" />
            <div className="flex gap-4">
              <Skeleton width="w-40" height="h-5" rounded="md" />
              <Skeleton width="w-32" height="h-5" rounded="md" />
            </div>
          </div>
          <Skeleton width="w-40" height="h-10" rounded="xl" />
        </div>
      </div>

      <main className="px-8 -mt-20 relative z-10 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* General Info Skeleton - mimicking the new Airbnb style 2-col layout */}
            <div className="bg-white rounded-[32px] p-8 min-h-[500px] border-2 border-gray-100 flex flex-col xl:flex-row gap-8 shadow-sm">
              {/* Left Profile Card Skeleton */}
              <div className="w-full xl:w-[280px] shrink-0">
                <div className="bg-white rounded-[32px] border border-gray-100 p-6 flex flex-col items-center h-full shadow-[0_0_30px_rgba(0,0,0,0.06)]">
                  <Skeleton width="w-32" height="h-32" rounded="full" className="mb-4" />
                  <Skeleton width="w-3/4" height="h-8" rounded="md" className="mb-2" />
                  <Skeleton width="w-1/2" height="h-4" rounded="md" className="mb-6" />
                  <div className="w-full border-t border-gray-100 mb-6" />
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Skeleton width="w-full" height="h-12" rounded="lg" />
                    <Skeleton width="w-full" height="h-12" rounded="lg" />
                    <Skeleton width="w-full" height="h-12" rounded="lg" className="col-span-2 mt-2" />
                  </div>
                </div>
              </div>

              {/* Right Details Skeleton */}
              <div className="flex-1 space-y-6 pt-2">
                <Skeleton width="w-48" height="h-6" rounded="md" />
                <div className="space-y-3">
                  <Skeleton width="w-full" height="h-4" />
                  <Skeleton width="w-full" height="h-4" />
                  <Skeleton width="3/4" height="h-4" />
                </div>
                <div className="border-t border-gray-100 my-6"></div>
                <Skeleton width="w-48" height="h-6" rounded="md" className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <Skeleton width="w-10" height="h-10" rounded="full" />
                    <div className="space-y-2">
                      <Skeleton width="w-24" height="h-4" />
                      <Skeleton width="w-32" height="h-4" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Skeleton width="w-10" height="h-10" rounded="full" />
                    <div className="space-y-2">
                      <Skeleton width="w-24" height="h-4" />
                      <Skeleton width="w-32" height="h-4" />
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-8">
                  <Skeleton width="w-full" height="h-14" rounded="xl" />
                </div>
              </div>
            </div>

            {/* Location Skeleton */}
            <div className="bg-white rounded-[32px] p-8 h-[400px] border-2 border-gray-100 shadow-sm relative">
              <div className="flex justify-between items-center mb-6">
                <Skeleton width="w-48" height="h-10" rounded="lg" />
                <Skeleton width="w-12" height="h-12" rounded="full" />
              </div>
              <div className="flex gap-8 h-[calc(100%-80px)]">
                <div className="w-1/3 space-y-4 pt-4">
                  <Skeleton width="w-24" height="h-4" />
                  <Skeleton width="w-full" height="h-20" rounded="xl" />
                  <Skeleton width="w-24" height="h-4" />
                  <div className="flex gap-2">
                    <Skeleton width="w-24" height="h-8" rounded="lg" />
                    <Skeleton width="w-24" height="h-8" rounded="lg" />
                  </div>
                </div>
                <Skeleton width="w-2/3" height="h-full" rounded="3xl" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-8 h-full">
            {/* Schedule Skeleton */}
            <div className="bg-white rounded-[32px] p-8 min-h-[400px] border-2 border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <Skeleton width="w-48" height="h-10" rounded="lg" />
                <Skeleton width="w-12" height="h-12" rounded="full" />
              </div>
              <div className="space-y-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton width="w-16" height="h-5" />
                    <div className="flex-1 mx-4 border-b border-gray-100"></div>
                    <Skeleton width="w-24" height="h-5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Media Skeleton */}
            <div className="bg-white rounded-[32px] p-8 min-h-[450px] border-2 border-gray-100 shadow-sm flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                  <Skeleton width="w-32" height="h-8" rounded="lg" />
                  <Skeleton width="w-20" height="h-4" />
                </div>
                <Skeleton width="w-12" height="h-12" rounded="full" />
              </div>
              <div className="grid grid-cols-4 gap-4 flex-1">
                <Skeleton width="w-full" height="h-32" rounded="2xl" className="col-span-2 row-span-2 h-full" />
                <Skeleton width="w-full" height="h-32" rounded="2xl" />
                <Skeleton width="w-full" height="h-32" rounded="2xl" />
                <Skeleton width="w-full" height="h-32" rounded="2xl" />
                <Skeleton width="w-full" height="h-32" rounded="2xl" />
              </div>
              <Skeleton width="w-full" height="h-14" rounded="2xl" className="mt-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
