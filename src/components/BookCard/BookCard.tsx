import type { Volume } from '../../api/types/googleBooks';
import { useMemo } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Skeleton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';

type Props = {
  volume: Volume;
};

function getCoverUrl(imageLinks: Volume['volumeInfo']['imageLinks']): string | undefined {
  // Prioridade: medium -> thumbnail -> small -> smallThumbnail
  return (
    imageLinks?.medium ||
    imageLinks?.thumbnail ||
    imageLinks?.small ||
    imageLinks?.smallThumbnail
  );
}

function optimizeImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Converter para HTTPS
    let optimizedUrl = url.replace('http://', 'https://');
    
    // Otimizar URLs do Google Books
    if (optimizedUrl.includes('google.com/books/content')) {
      const urlObj = new URL(optimizedUrl);
      
      // Parâmetros para imagem de melhor qualidade e tamanho consistente
      urlObj.searchParams.set('fife', 'w300-h450'); // Tamanho fixo para padronização
      urlObj.searchParams.set('printsec', 'frontcover');
      urlObj.searchParams.set('img', '1');
      urlObj.searchParams.set('zoom', '1'); // Zoom médio para boa qualidade
      
      optimizedUrl = urlObj.toString();
    }
    
    return optimizedUrl;
  } catch (error) {
    return url;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

function truncate(text: string, max = 200): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

export default function BookCard({ volume }: Props) {
  const navigate = useNavigate();
  
  const rawCoverUrl = useMemo(() => getCoverUrl(volume.volumeInfo.imageLinks), [volume.volumeInfo.imageLinks]);
  const cover = useMemo(() => rawCoverUrl ? optimizeImageUrl(rawCoverUrl) : undefined, [rawCoverUrl]);

  const rawDesc = volume.volumeInfo.description ?? '';
  const cleanDesc = useMemo(() => stripHtml(rawDesc), [rawDesc]);
  const shortDesc = useMemo(() => truncate(cleanDesc, 200), [cleanDesc]);

  const authors = volume.volumeInfo.authors?.length
    ? volume.volumeInfo.authors.join(', ')
    : 'Autor desconhecido';

  const handleCardClick = () => {
    navigate(`/book/${volume.id}`, { state: { volume } });
  };

  const [coverLoading, setCoverLoading] = React.useState(true);
  const [coverError, setCoverError] = React.useState(false);

  React.useEffect(() => {
    if (cover) {
      setCoverLoading(true);
      setCoverError(false);
      
      const img = new Image();
      img.onload = () => setCoverLoading(false);
      img.onerror = () => {
        setCoverLoading(false);
        setCoverError(true);
      };
      img.src = cover;
    } else {
      setCoverLoading(false);
      setCoverError(true);
    }
  }, [cover]);

  const renderCover = () => {
    if (coverLoading) {
      return (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={240}
          sx={{
            borderRadius: 2,
            bgcolor: 'grey.100'
          }}
        />
      );
    }

    if (coverError || !cover) {
      return (
        <Box
          sx={{
            width: '100%',
            height: 240,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius: 2,
            color: 'grey.400'
          }}
        >
          <Typography variant="body2" align="center">
            📚<br />
            Imagem não<br />
            disponível
          </Typography>
        </Box>
      );
    }

    return (
      <CardMedia
        component="img"
        height="240"
        image={cover}
        alt={`Capa de ${volume.volumeInfo.title}`}
        sx={{
          objectFit: 'cover',
          width: '100%',
          height: 240,
          // Garantir que a imagem mantenha proporção e preencha o espaço
          objectPosition: 'center'
        }}
        onError={() => setCoverError(true)}
      />
    );
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
      onClick={handleCardClick}
    >
      {/* Container da imagem com tamanho fixo */}
      <Box
        sx={{
          width: '100%',
          height: 240,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {renderCover()}
      </Box>

      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        p: 2 
      }}>
        <Typography 
          variant="h6" 
          component="h3" 
          fontWeight="bold" 
          lineHeight={1.2}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em'
          }}
        >
          {volume.volumeInfo.title}
        </Typography>

        <Chip
          label={authors}
          size="small"
          variant="outlined"
          sx={{ 
            alignSelf: 'flex-start',
            maxWidth: '100%',
            '& .MuiChip-label': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}
        >
          {shortDesc}
        </Typography>
      </CardContent>
    </Card>
  );
}