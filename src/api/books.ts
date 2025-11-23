import type { Volume, ImageLinks } from './types/googleBooks';

// Função simplificada para verificar se temos imagens básicas
function hasBasicImages(imageLinks: ImageLinks): boolean {
  if (!imageLinks) return false;
  
  // Verificar se temos pelo menos uma imagem básica
  const hasThumbnail = !!imageLinks.thumbnail;
  const hasSmallThumbnail = !!imageLinks.smallThumbnail;
  const hasSmall = !!imageLinks.small;
  const hasMedium = !!imageLinks.medium;
  
  return hasThumbnail || hasSmallThumbnail || hasSmall || hasMedium;
}

// Função para otimizar URLs de imagens (sem verificação CORS)
function optimizeImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Para URLs do Google Books, apenas garantir que usamos HTTPS
    let optimizedUrl = url.replace('http://', 'https://');
    
    // Adicionar parâmetros básicos para melhor qualidade
    if (optimizedUrl.includes('google.com/books/content')) {
      const urlObj = new URL(optimizedUrl);
      
      // Parâmetros para melhor qualidade
      urlObj.searchParams.set('fife', 'w400-h600');
      urlObj.searchParams.set('printsec', 'frontcover');
      urlObj.searchParams.set('img', '1');
      
      // Configurar zoom baseado no tipo de imagem
      if (url.includes('thumbnail') || url.includes('small')) {
        urlObj.searchParams.set('zoom', '1');
      } else {
        urlObj.searchParams.set('zoom', '0');
      }
      
      optimizedUrl = urlObj.toString();
    }
    
    return optimizedUrl;
  } catch (error) {
    return url; // Retornar original se houver erro
  }
}

// Função para obter imagens otimizadas
function getOptimizedImageLinks(imageLinks: ImageLinks): ImageLinks {
  if (!imageLinks) {
    return {};
  }

  const optimized: ImageLinks = {};

  // Otimizar cada tipo de imagem disponível
  if (imageLinks.smallThumbnail) {
    optimized.smallThumbnail = optimizeImageUrl(imageLinks.smallThumbnail);
  }
  if (imageLinks.thumbnail) {
    optimized.thumbnail = optimizeImageUrl(imageLinks.thumbnail);
  }
  if (imageLinks.small) {
    optimized.small = optimizeImageUrl(imageLinks.small);
  }
  if (imageLinks.medium) {
    optimized.medium = optimizeImageUrl(imageLinks.medium);
  }
  if (imageLinks.large) {
    optimized.large = optimizeImageUrl(imageLinks.large);
  }
  if (imageLinks.extraLarge) {
    optimized.extraLarge = optimizeImageUrl(imageLinks.extraLarge);
  }

  return optimized;
}

// Função principal atualizada - SEM verificações CORS
export async function fetchBooks(query: string, maxResults = 20, startIndex = 0): Promise<Volume[]> {
  const q = query?.trim();
  if (!q) return [];

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&printType=books&maxResults=${maxResults}&startIndex=${startIndex}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha ao buscar livros: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const items: any[] = Array.isArray(data?.items) ? data.items : [];

    const bannedWords = [
      'sex', 'porn', 'pornography', 'xxx', 'erotic', 'sexual', 'nudity',
      'sexo', 'pornô', 'erótico', 'adulto', 'nudez', 'porno'
    ];

    const normalize = (s: string): string => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    // Filtro simplificado - apenas verificar se temos imagens básicas
    const filtered = items.filter((it) => {
      const vi = it?.volumeInfo;
      const id = it?.id;
      if (!id || !vi) return false;

      const description = typeof vi.description === 'string' ? vi.description.trim() : '';
      if (!description) return false;

      if (vi.maturityRating === 'MATURE') return false;

      const descNorm = normalize(description);
      const banned = bannedWords.some((w) => descNorm.includes(normalize(w)));
      if (banned) return false;

      // Verificação SIMPLES de imagens - sem CORS
      if (!hasBasicImages(vi.imageLinks)) return false;

      return true;
    });

    console.log('Itens após filtro:', filtered.length);

    // Mapear os livros com imagens otimizadas
    const mapped: Volume[] = filtered.map((it) => {
      const vi = it.volumeInfo;
      const optimizedImageLinks = getOptimizedImageLinks(vi.imageLinks || {});

      return {
        id: it.id as string,
        volumeInfo: {
          title: typeof vi.title === 'string' ? vi.title : 'Título desconhecido',
          subtitle: typeof vi.subtitle === 'string' ? vi.subtitle : undefined,
          authors: Array.isArray(vi.authors) ? vi.authors : undefined,
          description: vi.description as string,
          imageLinks: optimizedImageLinks,
          maturityRating: typeof vi.maturityRating === 'string' ? vi.maturityRating : undefined,
          infoLink: typeof vi.infoLink === 'string' ? vi.infoLink : undefined,
          previewLink: typeof vi.previewLink === 'string' ? vi.previewLink : undefined,
          publishedDate: typeof vi.publishedDate === 'string' ? vi.publishedDate : undefined,
          publisher: typeof vi.publisher === 'string' ? vi.publisher : undefined,
          pageCount: typeof vi.pageCount === 'number' ? vi.pageCount : undefined,
          categories: Array.isArray(vi.categories) ? vi.categories : undefined,
          averageRating: typeof vi.averageRating === 'number' ? vi.averageRating : undefined,
          ratingsCount: typeof vi.ratingsCount === 'number' ? vi.ratingsCount : undefined,
          language: typeof vi.language === 'string' ? vi.language : undefined,
          industryIdentifiers: Array.isArray(vi.industryIdentifiers) ? vi.industryIdentifiers : undefined,
        },
      };
    });

    console.log('Livros mapeados:', mapped.length);
    return mapped;

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar livros';
    throw new Error(`Erro de rede ao buscar livros: ${message}`);
  }
}

// fetchPopularBooks atualizada
export async function fetchPopularBooks(maxResults = 20, startIndex = 0): Promise<Volume[]> {
  const popularQueries = [
    'bestseller',
    'fiction bestseller 2024',
    'romance',
    'fantasia',
    'ficção científica',
    'autoajuda',
    'biografia',
    'história'
  ];

  const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
  
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(randomQuery)}&printType=books&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=relevance`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha ao buscar livros populares: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const items: any[] = Array.isArray(data?.items) ? data.items : [];

    const bannedWords = [
      'sex', 'porn', 'pornography', 'xxx', 'erotic', 'sexual', 'nudity',
      'sexo', 'pornô', 'erótico', 'adulto', 'nudez', 'porno'
    ];

    const normalize = (s: string): string => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    // Filtro simplificado
    const filtered = items.filter((it) => {
      const vi = it?.volumeInfo;
      const id = it?.id;
      if (!id || !vi) return false;

      const description = typeof vi.description === 'string' ? vi.description.trim() : '';
      if (!description) return false;

      if (vi.maturityRating === 'MATURE') return false;

      const descNorm = normalize(description);
      const banned = bannedWords.some((w) => descNorm.includes(normalize(w)));
      if (banned) return false;

      // Verificação SIMPLES de imagens - sem CORS
      if (!hasBasicImages(vi.imageLinks)) return false;

      return true;
    });

    // Mapear os livros
    const mapped: Volume[] = filtered.map((it) => {
      const vi = it.volumeInfo;
      const optimizedImageLinks = getOptimizedImageLinks(vi.imageLinks || {});

      return {
        id: it.id as string,
        volumeInfo: {
          title: typeof vi.title === 'string' ? vi.title : 'Título desconhecido',
          subtitle: typeof vi.subtitle === 'string' ? vi.subtitle : undefined,
          authors: Array.isArray(vi.authors) ? vi.authors : undefined,
          description: vi.description as string,
          imageLinks: optimizedImageLinks,
          maturityRating: typeof vi.maturityRating === 'string' ? vi.maturityRating : undefined,
          infoLink: typeof vi.infoLink === 'string' ? vi.infoLink : undefined,
          previewLink: typeof vi.previewLink === 'string' ? vi.previewLink : undefined,
          publishedDate: typeof vi.publishedDate === 'string' ? vi.publishedDate : undefined,
          publisher: typeof vi.publisher === 'string' ? vi.publisher : undefined,
          pageCount: typeof vi.pageCount === 'number' ? vi.pageCount : undefined,
          categories: Array.isArray(vi.categories) ? vi.categories : undefined,
          averageRating: typeof vi.averageRating === 'number' ? vi.averageRating : undefined,
          ratingsCount: typeof vi.ratingsCount === 'number' ? vi.ratingsCount : undefined,
          language: typeof vi.language === 'string' ? vi.language : undefined,
          industryIdentifiers: Array.isArray(vi.industryIdentifiers) ? vi.industryIdentifiers : undefined,
        },
      };
    });

    return mapped;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar livros populares';
    throw new Error(`Erro de rede ao buscar livros populares: ${message}`);
  }
}

// fetchBookById atualizada
export async function fetchBookById(bookId: string): Promise<Volume | null> {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha ao buscar livro: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    const bannedWords = [
      'sex', 'porn', 'pornography', 'xxx', 'erotic', 'sexual', 'nudity',
      'sexo', 'pornô', 'erótico', 'adulto', 'nudez', 'porno'
    ];

    const normalize = (s: string): string => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const vi = data.volumeInfo;
    const description = typeof vi.description === 'string' ? vi.description.trim() : '';
    
    if (vi.maturityRating === 'MATURE') return null;

    const descNorm = normalize(description);
    const banned = bannedWords.some((w) => descNorm.includes(normalize(w)));
    if (banned) return null;

    // Verificação SIMPLES de imagens - sem CORS
    if (!hasBasicImages(vi.imageLinks)) return null;

    // Otimizar as imagens
    const optimizedImageLinks = getOptimizedImageLinks(vi.imageLinks || {});

    const volume: Volume = {
      id: data.id as string,
      volumeInfo: {
        title: typeof vi.title === 'string' ? vi.title : 'Título desconhecido',
        subtitle: typeof vi.subtitle === 'string' ? vi.subtitle : undefined,
        authors: Array.isArray(vi.authors) ? vi.authors : undefined,
        description: vi.description as string,
        imageLinks: optimizedImageLinks,
        maturityRating: typeof vi.maturityRating === 'string' ? vi.maturityRating : undefined,
        infoLink: typeof vi.infoLink === 'string' ? vi.infoLink : undefined,
        previewLink: typeof vi.previewLink === 'string' ? vi.previewLink : undefined,
        publishedDate: typeof vi.publishedDate === 'string' ? vi.publishedDate : undefined,
        publisher: typeof vi.publisher === 'string' ? vi.publisher : undefined,
        pageCount: typeof vi.pageCount === 'number' ? vi.pageCount : undefined,
        categories: Array.isArray(vi.categories) ? vi.categories : undefined,
        averageRating: typeof vi.averageRating === 'number' ? vi.averageRating : undefined,
        ratingsCount: typeof vi.ratingsCount === 'number' ? vi.ratingsCount : undefined,
        language: typeof vi.language === 'string' ? vi.language : undefined,
        industryIdentifiers: Array.isArray(vi.industryIdentifiers) ? vi.industryIdentifiers : undefined,
      },
    };

    return volume;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar livro';
    throw new Error(`Erro de rede ao buscar livro: ${message}`);
  }
}