import { Link } from 'react-router-dom';

export default function Sobre() {
  return (
    <section className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-4">📖 Sobre a Biblioteca Mágica</h1>

      <p className="text-lg leading-relaxed mb-4">
        A <strong>Biblioteca Mágica</strong> é uma vitrine interativa de livros construída com <strong>React</strong> e <strong>TypeScript</strong>, integrando a API pública do <strong>Google Books</strong> para busca, sugestões e detalhes de obras. O projeto foi desenhado para ser rápido, intuitivo e escalável, utilizando as melhores práticas de arquitetura frontend.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">🛠️ Tecnologias & Arquitetura</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>React 19</strong> com <strong>TypeScript</strong> para componentes funcionais e tipagem segura.
        </li>
        <li>
          <strong>Vite</strong> como bundler e ambiente de desenvolvimento ultrarrápido.
        </li>
        <li>
          <strong>Tailwind CSS</strong> para estilização utilitária e responsiva.
        </li>
        <li>
          <strong>Material UI (MUI)</strong> para componentes visuais modernos (cards, botões, alerts, skeleton loaders).
        </li>
        <li>
          <strong>React Router</strong> para navegação entre páginas (<code>Home</code>, <code>Details</code>, <code>Sobre</code>).
        </li>
        <li>
          <strong>Hooks customizados</strong> para lógica reutilizável:
          <ul className="list-disc ml-6">
            <li>
              <code><Link to="/src/hooks/useDebouncedValue.ts">useDebouncedValue</Link></code>: debounce para buscas e sugestões.
            </li>
            <li>
              <code><Link to="/src/hooks/useBookSuggestions.ts">useBookSuggestions</Link></code>: autocomplete de títulos usando a API.
            </li>
            <li>
              <code><Link to="/src/hooks/useInfiniteScroll.ts">useInfiniteScroll</Link></code>: scroll infinito para carregar mais livros.
            </li>
            <li>
              <code><Link to="/src/hooks/useLocalStorageCache.ts">useLocalStorageCache</Link></code>: persistência dos resultados e buscas no navegador.
            </li>
          </ul>
        </li>
        <li>
          <strong>API Google Books</strong> (<code><Link to="/src/api/books.ts">src/api/books.ts</Link></code>): integração para busca, detalhes e filtragem de livros, com otimização de imagens e filtros de conteúdo.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">📦 Estrutura de Componentes</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>BookCard</strong>: exibe capa, título, autores e sinopse resumida (<code><Link to="/src/components/BookCard/BookCard.tsx">BookCard.tsx</Link></code>).
        </li>
        <li>
          <strong>BookList</strong>: grid responsivo de livros, com skeleton loaders e tratamento de erros (<code><Link to="/src/components/BookList/BookList.tsx">BookList.tsx</Link></code>).
        </li>
        <li>
          <strong>SearchBar</strong>: busca com sugestões instantâneas (<code><Link to="/src/components/SearchBar/SearchBar.tsx">SearchBar.tsx</Link></code>).
        </li>
        <li>
          <strong>UI</strong>: componentes utilitários como <code>ErrorMessage</code> e <code>LoadingSpinner</code> para feedback visual.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">🔗 Integração com Google Books API</h2>
      <p className="leading-relaxed mb-4">
        Todas as buscas, sugestões e detalhes dos livros são feitas em tempo real usando a API do Google Books. O código filtra resultados indesejados, otimiza imagens para melhor qualidade e garante que apenas livros com informações completas sejam exibidos.
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Busca por título, autor ou palavra-chave.</li>
        <li>Scroll infinito usando o parâmetro <code>startIndex</code> da API.</li>
        <li>Filtragem de conteúdo adulto e duplicado.</li>
        <li>Persistência dos resultados no <code>localStorage</code> para experiência contínua.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">⚙️ Fluxo de Funcionamento</h2>
      <ol className="list-decimal ml-6 mb-4">
        <li>Usuário digita na barra de busca e recebe sugestões instantâneas.</li>
        <li>Ao buscar, os resultados são exibidos em um grid com scroll infinito.</li>
        <li>Ao clicar em um livro, detalhes completos são mostrados, incluindo capa otimizada, autores, sinopse e links externos.</li>
        <li>Os dados são salvos no navegador para navegação rápida e offline parcial.</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-6 mb-2">🧩 Extensibilidade</h2>
      <p className="leading-relaxed mb-4">
        O projeto foi estruturado para facilitar a adição de novos componentes, hooks e integrações. O uso de <strong>TypeScript</strong> garante segurança e facilidade de manutenção.
      </p>

      <p className="mt-10 text-center text-sm opacity-60">
        Obrigado por usar a Biblioteca Mágica ✨<br />
        <span className="block mt-2">Veja o código fonte dos principais módulos em <code>src/</code>!</span>
      </p>
    </section>
  );
}