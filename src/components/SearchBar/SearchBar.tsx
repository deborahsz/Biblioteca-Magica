import { useState } from 'react';

type Props = {
  onSearch: (q: string) => void;
  defaultValue?: string;
};

export default function SearchBar({ onSearch, defaultValue = '' }: Props) {
  const [value, setValue] = useState<string>(defaultValue);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pesquisar livros..."
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        aria-label="Pesquisar livros"
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Buscar
      </button>
    </form>
  );
}