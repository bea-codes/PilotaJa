import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <img src="/logo.jpg" alt="PilotaJá" className="h-16 mx-auto" />
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Encontre o instrutor de direção ideal para você
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Conectamos você a instrutores autônomos qualificados na sua região.
            Agende aulas no horário que preferir.
          </p>
          <Link 
            to="/instructors" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
          >
            🔍 Encontrar Instrutor
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-white mb-2">Perto de você</h3>
            <p className="text-gray-400">Instrutores na sua região</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-white mb-2">Avaliados</h3>
            <p className="text-gray-400">Veja notas e comentários</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-2">Flexível</h3>
            <p className="text-gray-400">Agende no seu horário</p>
          </div>
        </div>
      </main>
    </div>
  );
}
