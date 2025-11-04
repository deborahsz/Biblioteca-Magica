import type { Volume } from '../../types/googleBooks';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { ExpandMore, ExpandLess, Launch } from '@mui/icons-material';

type Props = {
  volume: Volume;
};

function getCoverUrl(imageLinks: Volume['volumeInfo']['imageLinks']): string | undefined {
  return (
    imageLinks?.thumbnail ||
    imageLinks?.smallThumbnail ||
    imageLinks?.small ||
    imageLinks?.medium
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

function truncate(text: string, max = 200): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

export default function BookCard({ volume }: Props) {
  const [expanded, setExpanded] = useState(false);
  const cover = useMemo(() => getCoverUrl(volume.volumeInfo.imageLinks), [volume.volumeInfo.imageLinks]);

  const rawDesc = volume.volumeInfo.description ?? '';
  const cleanDesc = useMemo(() => stripHtml(rawDesc), [rawDesc]);
  const shortDesc = useMemo(() => truncate(cleanDesc, 200), [cleanDesc]);

  const authors = volume.volumeInfo.authors?.length
    ? volume.volumeInfo.authors.join(', ')
    : 'Autor desconhecido';

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      {cover && (
        <CardMedia
          component="img"
          height="240"
          image={cover}
          alt={`Capa de ${volume.volumeInfo.title}`}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" component="h3" fontWeight="bold" lineHeight={1.2}>
          {volume.volumeInfo.title}
        </Typography>

        <Chip 
          label={authors} 
          size="small" 
          variant="outlined"
          sx={{ alignSelf: 'flex-start' }}
        />

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {expanded ? cleanDesc : shortDesc}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 'auto' }}>
          <Button
            size="small"
            onClick={() => setExpanded((e) => !e)}
            startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            variant="outlined"
          >
            {expanded ? 'Menos' : 'Mais'}
          </Button>
          
          {volume.volumeInfo.infoLink && (
            <Button
              size="small"
              href={volume.volumeInfo.infoLink}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<Launch />}
              variant="contained"
              sx={{ ml: 'auto' }}
            >
              Detalhes
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}