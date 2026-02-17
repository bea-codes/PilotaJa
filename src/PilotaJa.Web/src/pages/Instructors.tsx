import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

interface Instructor {
  id: string;
  name: string;
  city: string;
  state: string;
  hourlyRate: number;
  rating: number;
  totalLessons: number;
  photoUrl?: string;
  bio?: string;
}

export default function Instructors() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => api.get<{ instructors: Instructor[] }>('/api/instructors').then(r => r.data)
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <img src="/logo.jpg" alt="PilotaJá" className="h-10" />
          </Link>
          <Link to="/" className="text-gray-400 hover:text-white">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Instrutores Disponíveis</h1>

        {isLoading && (
          <div className="text-center text-gray-400 py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            Carregando...
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">
            Erro ao carregar instrutores
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.instructors.map(instructor => (
            <Link 
              to={`/instructors/${instructor.id}`} 
              key={instructor.id}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition hover:ring-2 hover:ring-blue-500"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                  {instructor.photoUrl 
                    ? <img src={instructor.photoUrl} alt={instructor.name} className="w-full h-full rounded-full object-cover" />
                    : '👤'
                  }
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{instructor.name}</h3>
                  <p className="text-gray-400 text-sm">📍 {instructor.city}, {instructor.state}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-green-400 font-bold text-lg">
                  R$ {instructor.hourlyRate.toFixed(2)}/h
                </span>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>⭐ {instructor.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span>{instructor.totalLessons} aulas</span>
                </div>
              </div>

              {instructor.bio && (
                <p className="mt-3 text-gray-400 text-sm line-clamp-2">{instructor.bio}</p>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
