// src/components/BookList/BookList.tsx
import type { Volume } from '../../types/googleBooks';

interface Props {
  books: Volume[];
  loading: boolean;
  error: string | null;
  // Remove showPopular se não for usado no BookList
}

export default function BookList({ books, loading, error }: Props) {
  if (loading) {
    return <div className="text-center py-8">Carregando livros...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erro: {error}</div>;
  }

  if (books.length === 0) {
    return <div className="text-center py-8 text-gray-600">Nenhum livro encontrado.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          {book.volumeInfo.imageLinks?.thumbnail && (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.volumeInfo.title}</h3>
            {book.volumeInfo.authors && (
              <p className="text-gray-600 mb-2">Por: {book.volumeInfo.authors.join(', ')}</p>
            )}
            <p className="text-gray-700 text-sm line-clamp-3">{book.volumeInfo.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}