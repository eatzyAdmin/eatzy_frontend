'use client';

import React, { ReactNode } from 'react';
import { motion } from '@repo/ui/motion';

// ======== Types ========

export interface InfiniteScrollContainerProps {
  /** Children to render (the list items) */
  children: ReactNode;

  /** Ref from useInfiniteScroll hook */
  sentinelRef: React.RefObject<HTMLDivElement>;

  /** Whether initial loading is in progress */
  isLoading?: boolean;

  /** Whether loading more items */
  isLoadingMore?: boolean;

  /** Whether there are more items to load */
  hasMore?: boolean;

  /** Whether the list is empty (no results) */
  isEmpty?: boolean;

  /** Total number of results */
  totalResults?: number;

  /** Component to render for each shimmer placeholder during initial load */
  ShimmerComponent: React.ComponentType;

  /** Number of shimmer placeholders for initial load (default: 3) */
  initialShimmerCount?: number;

  /** Number of shimmer placeholders when loading more (default: 2) */
  loadMoreShimmerCount?: number;

  /** Custom message when all items are loaded */
  endMessage?: string;

  /** Custom empty state component */
  EmptyComponent?: React.ReactNode;

  /** Additional className for container */
  className?: string;
}

// ======== Component ========

/**
 * Reusable infinite scroll container with loading states
 * 
 * @example
 * ```tsx
 * const { sentinelRef } = useInfiniteScroll({
 *   hasMore,
 *   isLoadingMore,
 *   onLoadMore: loadMore,
 * });
 * 
 * return (
 *   <InfiniteScrollContainer
 *     sentinelRef={sentinelRef}
 *     isLoading={isLoading}
 *     isLoadingMore={isLoadingMore}
 *     hasMore={hasMore}
 *     isEmpty={items.length === 0}
 *     totalResults={total}
 *     ShimmerComponent={ItemShimmer}
 *     endMessage="Đã hiển thị tất cả kết quả"
 *   >
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *   </InfiniteScrollContainer>
 * );
 * ```
 */
export default function InfiniteScrollContainer({
  children,
  sentinelRef,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  isEmpty = false,
  totalResults,
  ShimmerComponent,
  initialShimmerCount = 3,
  loadMoreShimmerCount = 2,
  endMessage,
  EmptyComponent,
  className = '',
}: InfiniteScrollContainerProps) {

  // Render shimmer placeholders
  const renderShimmers = (count: number, keyPrefix: string) => {
    return Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={`${keyPrefix}-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <ShimmerComponent />
      </motion.div>
    ));
  };

  // Default end message
  const defaultEndMessage = totalResults
    ? `Đã hiển thị tất cả ${totalResults} kết quả`
    : 'Đã hiển thị tất cả kết quả';

  return (
    <div className={className}>
      {/* Initial Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderShimmers(initialShimmerCount, 'initial-shimmer')}
        </motion.div>
      )}

      {/* Content - only show when not initial loading */}
      {!isLoading && !isEmpty && (
        <>
          {children}

          {/* Sentinel for Intersection Observer + Loading More */}
          <div ref={sentinelRef} className="py-4">
            {isLoadingMore && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderShimmers(loadMoreShimmerCount, 'loadmore-shimmer')}
              </motion.div>
            )}

            {/* End of list message */}
            {!isLoadingMore && !hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="inline-block px-6 py-3 bg-gray-100 rounded-full">
                  <span className="text-sm text-gray-500">
                    {endMessage || defaultEndMessage}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {EmptyComponent || (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có kết quả nào</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
