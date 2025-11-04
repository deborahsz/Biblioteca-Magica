import type { Volume } from '../../types/googleBooks';
import BookCard from '../BookCard/BookCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

type Props = {
  books: Volume[];
  loading: boolean;
  error?: string | null;
};

export default function BookList({ books, loading, error }: Props) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!books.length) {
    return <p className="py-6 text-sm text-gray-600">Nenhum livro encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((b) => (
        <BookCard key={b.id} volume={b} />
      ))}
    </div>
  );
}