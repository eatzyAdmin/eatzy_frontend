import { useEffect, useRef, useCallback } from 'react';

// ======== Types ========

export interface UseInfiniteScrollOptions {
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading more items */
  isLoadingMore: boolean;
  /** Whether initial loading is in progress */
  isLoading?: boolean;
  /** Callback function to load more items */
  onLoadMore: () => void;
  /** Root margin for intersection observer (default: '400px') */
  rootMargin?: string;
  /** Threshold for intersection observer (default: 0) */
  threshold?: number;
  /** Whether infinite scroll is enabled (default: true) */
  enabled?: boolean;
}

export interface UseInfiniteScrollResult {
  /** Ref to attach to the sentinel element at bottom of list */
  sentinelRef: React.RefObject<HTMLDivElement>;
}

// ======== Hook ========

/**
 * Hook to handle infinite scroll pagination with Intersection Observer
 * Attach the sentinelRef to an element at the bottom of your list
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
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={sentinelRef} /> {* Sentinel element *}
 *     {isLoadingMore && <LoadingSpinner />}
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll({
  hasMore,
  isLoadingMore,
  isLoading = false,
  onLoadMore,
  rootMargin = '400px',
  threshold = 0,
  enabled = true,
}: UseInfiniteScrollOptions): UseInfiniteScrollResult {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Memoize the callback
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading && enabled) {
        onLoadMore();
      }
    },
    [hasMore, isLoadingMore, isLoading, onLoadMore, enabled]
  );

  useEffect(() => {
    if (!enabled || !hasMore || isLoadingMore || isLoading) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold,
    });

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, [handleIntersect, rootMargin, threshold, enabled, hasMore, isLoadingMore, isLoading]);

  return { sentinelRef };
}
