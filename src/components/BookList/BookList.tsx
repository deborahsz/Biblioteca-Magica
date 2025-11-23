// src/components/BookList/BookList.tsx
import type { Volume } from '../../api/types/googleBooks';
import BookCardSkeleton from '../BookCard/BookCardSkeleton';
import BookCard from '../BookCard/BookCard';
import {
  Box,
  Typography,
  Alert
} from '@mui/material';

interface Props {
  books: Volume[];
  loading: boolean;
  error: string | null;
  loadingMore?: boolean; // Indica carregamento do scroll infinito
}

export default function BookList({ books, loading, error, loadingMore = false }: Props) {
  
  // 🔥 Skeleton do carregamento inicial
  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </Box>
    );
  }

  // 🔥 Exibe erro
  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Erro ao carregar livros
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  // 🔥 Nenhum resultado
  if (books.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Nenhum livro encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tente ajustar os termos da sua busca.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Grid de livros */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {books.map((book) => (
          <BookCard key={book.id} volume={book} />
        ))}
      </Box>

      {/* 🔥 Infinite Scroll Skeleton Loader */}
      {loadingMore && (
        <Box
          sx={{
            mt: 3,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={`loadmore-${i}`} />
          ))}
        </Box>
      )}
    </Box>
  );
}
