import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import BookList from '../components/BookList/BookList';
import { fetchBooks } from '../api/books';
import type { Volume } from '../types/googleBooks';
import useDebouncedValue from '../hooks/useDebouncedValue';

export default function Home() {
  const [query, setQuery] = useState<string>('harry potter');
  const debounced = useDebouncedValue(query, 600);
  const [books, setBooks] = useState<Volume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true; // cancelamento via flag
    const run = async () => {
      if (!debounced.trim()) {
        setBooks([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBooks(debounced, 20);
        if (!active) return;
        setBooks(data);
      } catch (e) {
        if (!active) return;
        const msg = e instanceof Error ? e.message : 'Erro ao buscar livros';
        setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => { active = false; };
  }, [debounced]);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <SearchBar onSearch={(q) => setQuery(q)} defaultValue={query} />
      </div>

      <BookList books={books} loading={loading} error={error} />
    </section>
  );
}