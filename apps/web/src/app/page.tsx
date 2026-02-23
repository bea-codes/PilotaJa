export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">
            🚗 PilotaJá
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema de agendamento de aulas de direção
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Agendamento Fácil</h2>
              <p className="text-gray-600">
                Alunos agendam aulas em segundos pelo app
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Gestão de Instrutores</h2>
              <p className="text-gray-600">
                Controle a agenda e disponibilidade da equipe
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Relatórios</h2>
              <p className="text-gray-600">
                Acompanhe métricas e performance em tempo real
              </p>
            </div>
          </div>
          
          <div className="mt-12 space-x-4">
            <a
              href="/login"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Entrar
            </a>
            <a
              href="/cadastro"
              className="inline-block bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Cadastrar Autoescola
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
