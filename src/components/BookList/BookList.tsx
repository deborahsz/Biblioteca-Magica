// src/components/BookList/BookList.tsx
import type { Volume } from '../../api/types/googleBooks';
import BookCard from '../BookCard/BookCard';
import {
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

interface Props {
  books: Volume[];
  loading: boolean;
  error: string | null;
  loadingMore?: boolean; // Novo: indica se está carregando mais itens (scroll infinito)
}

export default function BookList({ books, loading, error, loadingMore = false }: Props) {
  // Se está carregando a primeira página
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Carregando livros...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Erro ao carregar livros
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

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
      {/* Grid de livros usando CSS Grid puro */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 3
      }}>
        {books.map((book) => (
          <BookCard key={book.id} volume={book} />
        ))}
      </Box>

      {/* Indicador de carregamento no scroll infinito */}
      {loadingMore && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
            <CircularProgress size={20} />
            <Typography variant="body1">
              Carregando mais livros...
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}