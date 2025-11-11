export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8" role="status" aria-live="polite" aria-busy="true">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}