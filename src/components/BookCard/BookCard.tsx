import type { Volume } from '../../types/googleBooks';
import { useState, useMemo } from 'react';

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
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {cover && (
        <img
          src={cover}
          alt={`Capa de ${volume.volumeInfo.title}`}
          className="h-56 w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg font-semibold">{volume.volumeInfo.title}</h3>
        <p className="text-sm text-gray-600">{authors}</p>

        <p className="text-sm text-gray-800">
          {expanded ? cleanDesc : shortDesc}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200"
          >
            {expanded ? 'mostrar menos' : 'ver mais'}
          </button>
          {volume.volumeInfo.infoLink && (
            <a
              href={volume.volumeInfo.infoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              detalhes
            </a>
          )}
        </div>
      </div>
    </article>
  );
}