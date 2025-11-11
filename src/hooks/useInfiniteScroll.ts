import { useEffect } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number;
}

export default function useInfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 300
}: UseInfiniteScrollOptions) {
  useEffect(() => {

    const handleScroll = () => {
      if (!hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom < threshold) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Impede scroll infinito
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onLoadMore, isLoading, hasMore, threshold]);
}
