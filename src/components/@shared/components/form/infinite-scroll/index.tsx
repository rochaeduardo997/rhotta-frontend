'use client';

import { ReactNode, useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2 } from 'lucide-react';

type TProps = {
  scrollableId: string;
  dataLength: number;
  hasMore: boolean;
  onLoadMore?: () => Promise<void>;
  height?: string;
  children: ReactNode;
};

export default function InfiniteScrollContainer({ scrollableId, dataLength, hasMore, onLoadMore, height = '20rem', children }: TProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !onLoadMore) return;

    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div id={scrollableId} style={{ height, overflow: 'auto' }}>
      <InfiniteScroll
        dataLength={dataLength}
        next={handleLoadMore}
        hasMore={hasMore}
        scrollableTarget={scrollableId}
        loader={
          isLoadingMore ? (
            <div className="text-primary-dark flex items-center justify-center gap-1 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Carregando...</span>
            </div>
          ) : null
        }
      >
        {children}
      </InfiniteScroll>
    </div>
  );
}
