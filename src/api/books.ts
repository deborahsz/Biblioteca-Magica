import type { Volume } from '../types/googleBooks';

// fetchBooks: Busca livros na Google Books API com filtros estritos e retorno tipado.
// Para usar uma API Key, adicione `&key=YOUR_API_KEY` ao final da URL.
export async function fetchBooks(query: string, maxResults = 20): Promise<Volume[]> {
  const q = query?.trim();
  if (!q) return [];

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&printType=books&maxResults=${maxResults}`; // &key=YOUR_API_KEY

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

    const hasImage = (imageLinks: any): boolean => !!(
      imageLinks?.thumbnail || imageLinks?.smallThumbnail || imageLinks?.small || imageLinks?.medium
    );

    const filtered = items.filter((it) => {
      const vi = it?.volumeInfo;
      const id = it?.id;
      if (!id || !vi) return false; // a) volumeInfo definido e id presente

      const description = typeof vi.description === 'string' ? vi.description.trim() : '';
      if (!description) return false; // b) descrição não vazia

      if (!hasImage(vi.imageLinks)) return false; // c) possui alguma imagem

      if (vi.maturityRating === 'MATURE') return false; // d) excluir conteúdo adulto

      const descNorm = normalize(description);
      const banned = bannedWords.some((w) => descNorm.includes(normalize(w)));
      if (banned) return false; // e) excluir descrições com palavras proibidas

      return true;
    });

    const mapped: Volume[] = filtered.map((it) => {
      const vi = it.volumeInfo;
      return {
        id: it.id as string,
        volumeInfo: {
          title: typeof vi.title === 'string' ? vi.title : 'Título desconhecido',
          authors: Array.isArray(vi.authors) ? vi.authors : undefined,
          description: vi.description as string,
          imageLinks: {
            thumbnail: vi.imageLinks?.thumbnail,
            smallThumbnail: vi.imageLinks?.smallThumbnail,
            small: vi.imageLinks?.small,
            medium: vi.imageLinks?.medium,
          },
          maturityRating: typeof vi.maturityRating === 'string' ? vi.maturityRating : undefined,
          infoLink: typeof vi.infoLink === 'string' ? vi.infoLink : undefined,
        },
      };
    });

    return mapped;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar livros';
    throw new Error(`Erro de rede ao buscar livros: ${message}`);
  }
}

// Função para buscar livros populares
export async function fetchPopularBooks(maxResults = 20): Promise<Volume[]> {
  // Consultas que geralmente retornam livros populares
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

  // Escolhe uma query aleatória para variedade
  const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
  
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(randomQuery)}&printType=books&maxResults=${maxResults}&orderBy=relevance`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha ao buscar livros populares: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const items: any[] = Array.isArray(data?.items) ? data.items : [];

    // Usa o mesmo filtro da função fetchBooks existente
    const bannedWords = [
      'sex', 'porn', 'pornography', 'xxx', 'erotic', 'sexual', 'nudity',
      'sexo', 'pornô', 'erótico', 'adulto', 'nudez', 'porno'
    ];

    const normalize = (s: string): string => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const hasImage = (imageLinks: any): boolean => !!(
      imageLinks?.thumbnail || imageLinks?.smallThumbnail || imageLinks?.small || imageLinks?.medium
    );

    const filtered = items.filter((it) => {
      const vi = it?.volumeInfo;
      const id = it?.id;
      if (!id || !vi) return false;

      const description = typeof vi.description === 'string' ? vi.description.trim() : '';
      if (!description) return false;

      if (!hasImage(vi.imageLinks)) return false;

      if (vi.maturityRating === 'MATURE') return false;

      const descNorm = normalize(description);
      const banned = bannedWords.some((w) => descNorm.includes(normalize(w)));
      if (banned) return false;

      return true;
    });

    const mapped: Volume[] = filtered.map((it) => {
      const vi = it.volumeInfo;
      return {
        id: it.id as string,
        volumeInfo: {
          title: typeof vi.title === 'string' ? vi.title : 'Título desconhecido',
          authors: Array.isArray(vi.authors) ? vi.authors : undefined,
          description: vi.description as string,
          imageLinks: {
            thumbnail: vi.imageLinks?.thumbnail,
            smallThumbnail: vi.imageLinks?.smallThumbnail,
            small: vi.imageLinks?.small,
            medium: vi.imageLinks?.medium,
          },
          maturityRating: typeof vi.maturityRating === 'string' ? vi.maturityRating : undefined,
          infoLink: typeof vi.infoLink === 'string' ? vi.infoLink : undefined,
        },
      };
    });

    return mapped;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar livros populares';
    throw new Error(`Erro de rede ao buscar livros populares: ${message}`);
  }
}