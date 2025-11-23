// src/pages/Details.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,

  Divider,
  Alert,
  Skeleton
} from '@mui/material';
import {
  ArrowBack,
  Launch
} from '@mui/icons-material';
import type { Volume } from '../api/types/googleBooks';
import React from 'react';

interface LocationState {
  volume: Volume;
}

function getBestCoverUrl(imageLinks: Volume['volumeInfo']['imageLinks']) {
  return (
    imageLinks?.extraLarge ||
    imageLinks?.large ||
    imageLinks?.medium ||
    imageLinks?.thumbnail ||
    imageLinks?.small ||
    imageLinks?.smallThumbnail
  );
}

function optimizeImageUrl(url: string) {
  if (!url) return '';

  try {
    let optimized = url.replace('http://', 'https://');

    if (optimized.includes('google.com/books/content')) {
      const u = new URL(optimized);
      u.searchParams.set('fife', 'w400-h600');
      u.searchParams.set('printsec', 'frontcover');
      u.searchParams.set('img', '1');
      u.searchParams.set('zoom', '0');
      optimized = u.toString();
    }

    return optimized;
  } catch {
    return url;
  }
}

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const volume = state?.volume;

  if (!volume) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
          Voltar
        </Button>
        <Alert severity="error">Livro não encontrado.</Alert>
      </Container>
    );
  }

  const { volumeInfo } = volume;

  const rawCover = getBestCoverUrl(volumeInfo.imageLinks);
  const coverUrl = rawCover ? optimizeImageUrl(rawCover) : undefined;

  const [coverLoading, setCoverLoading] = React.useState(true);
  const [coverError, setCoverError] = React.useState(false);

  React.useEffect(() => {
    if (!coverUrl) {
      setCoverLoading(false);
      setCoverError(true);
      return;
    }

    const img = new Image();
    img.onload = () => setCoverLoading(false);
    img.onerror = () => {
      setCoverLoading(false);
      setCoverError(true);
    };
    img.src = coverUrl;
  }, [coverUrl]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="outlined">
        Voltar
      </Button>

      <Paper elevation={2} sx={{ p: 4, mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ width: '100%', maxWidth: 350 }}>
            {coverLoading ? (
              <Skeleton variant="rectangular" width="100%" height={400} />
            ) : coverError || !coverUrl ? (
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                }}
              >
                <Typography>Imagem indisponível</Typography>
              </Box>
            ) : (
              <img
                src={coverUrl}
                alt={volumeInfo.title}
                style={{ width: '100%', height: 400, objectFit: 'cover' }}
              />
            )}
          </Box>

          <Box>
            <Typography variant="h3" fontWeight="bold">
              {volumeInfo.title}
            </Typography>

            {volumeInfo.subtitle && (
              <Typography variant="h5" color="text.secondary">
                {volumeInfo.subtitle}
              </Typography>
            )}

            <Typography variant="h6" sx={{ mt: 2 }}>
              por {volumeInfo.authors?.join(', ') || 'Autor desconhecido'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" fontWeight="medium">
              Sinopse
            </Typography>

            {volumeInfo.description ? (
              <Typography sx={{ mt: 2 }}>
                {volumeInfo.description.replace(/<[^>]+>/g, '')}
              </Typography>
            ) : (
              <Alert severity="info">Descrição não disponível.</Alert>
            )}

            <Box sx={{ mt: 4 }}>
              {volumeInfo.infoLink && (
                <Button
                  variant="outlined"
                  startIcon={<Launch />}
                  href={volumeInfo.infoLink}
                  target="_blank"
                >
                  Ver no Google Books
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
