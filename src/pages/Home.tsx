// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import BookList from '../components/BookList/BookList';
import { fetchBooks, fetchPopularBooks } from '../api/books';
import type { Volume } from '../api/types/googleBooks';
import useDebouncedValue from '../hooks/useDebouncedValue';
import useBookSuggestions from '../hooks/useBookSuggestions';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useLocalStorageCache from '../hooks/useLocalStorageCache';

export default function Home() {
  const RESULTS_PER_PAGE = 20;

  // 🔥 Valores armazenados no localStorage
  const [books, setBooks] = useLocalStorageCache<Volume[]>('books-cache', []);
  const [query, setQuery] = useLocalStorageCache<string>('query-cache', '');
  const [page, setPage] = useLocalStorageCache<number>('page-cache', 0);
  const [showPopular, setShowPopular] =
    useLocalStorageCache<boolean>('popular-cache', true);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounced = useDebouncedValue(query, 600);

  // Sugestões
  const { suggestions: suggestionObjs, loading: loadingSuggestions } =
    useBookSuggestions(query, 8);
  const suggestions = suggestionObjs.map((s) => s.title);

  // ✅ Função para limpar cache + recarregar a página
  const resetApp = () => {
    localStorage.removeItem('books-cache');
    localStorage.removeItem('query-cache');
    localStorage.removeItem('page-cache');
    localStorage.removeItem('popular-cache');

    // Ou para limpar tudo mesmo:
    // localStorage.clear();

    window.location.reload();
  };

  // ⚠️ Executa apenas no primeiro load
  useEffect(() => {
    if (books.length > 0) return;

    const loadPopular = async () => {
      setLoading(true);
      try {
        const data = await fetchPopularBooks(RESULTS_PER_PAGE);
        setBooks(data);
        setPage(0);
        setShowPopular(true);
        setHasMore(true);
      } catch {
        setError('Erro ao carregar livros populares');
      } finally {
        setLoading(false);
      }
    };

    loadPopular();
  }, []);

  // 🔎 Busca
  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!debounced.trim()) return;

      setLoading(true);
      setPage(0);
      setHasMore(true);
      setShowPopular(false);

      try {
        const data = await fetchBooks(debounced, RESULTS_PER_PAGE, 0);
        if (!active) return;
        setBooks(data);

        if (data.length < RESULTS_PER_PAGE) setHasMore(false);
      } catch {
        if (!active) return;
        setError('Erro ao buscar livros');
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [debounced]);

  // Infinite Scroll
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const nextPage = page + 1;
    const startIndex = nextPage * RESULTS_PER_PAGE;

    try {
      const newBooks = showPopular
        ? await fetchPopularBooks(RESULTS_PER_PAGE, startIndex)
        : await fetchBooks(debounced, RESULTS_PER_PAGE, startIndex);

      setBooks((prev) => {
        const ids = new Set(prev.map((b) => b.id));
        const filtered = newBooks.filter((b) => !ids.has(b.id));
        return [...prev, ...filtered];
      });

      setPage(nextPage);

      if (newBooks.length < 1) setHasMore(false);
    } catch {
      setError('Erro ao carregar mais livros');
    } finally {
      setLoadingMore(false);
    }
  };

  useInfiniteScroll({
    onLoadMore: loadMore,
    isLoading: loadingMore,
    hasMore,
  });

  // Reset ao limpar busca
  const handleClearSearch = () => {
    setQuery('');
    setShowPopular(true);
    setPage(0);
  };

  return (
    <section className="mx-auto max-w-7xl">
      {/* Clique no logo chama resetApp() */}
      <div
        className="cursor-pointer mb-4"
        onClick={resetApp}
      >
        <h1 className="text-3xl font-bold">📚 Biblioteca Mágica</h1>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={setQuery}
          defaultValue={query}
          onClear={handleClearSearch}
          onChange={(v) => setQuery(v)}
          suggestions={suggestions}
          loadingSuggestions={loadingSuggestions}
          onSelectSuggestion={(s) => setQuery(s)}
        />
      </div>

      <BookList
        books={books}
        loading={loading}
        error={error}
        loadingMore={loadingMore}
      />
    </section>
  );
}
