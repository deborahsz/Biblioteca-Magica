import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Bilioteca Mágica✨</h1>
      </header>
      <main className="px-4 sm:px-6 lg:px-8 pb-12">
        <Home />
      </main>
    </div>
  )
}

export default App
