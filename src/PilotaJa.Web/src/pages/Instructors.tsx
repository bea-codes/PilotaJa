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

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar instrutores</div>;

  return (
    <div className="container">
      <header>
        <Link to="/">← Voltar</Link>
        <h1>Instrutores Disponíveis</h1>
      </header>

      <div className="filters">
        <input type="text" placeholder="Buscar por cidade..." />
        <select>
          <option value="">Ordenar por</option>
          <option value="rating">Melhor avaliação</option>
          <option value="price">Menor preço</option>
          <option value="lessons">Mais aulas</option>
        </select>
      </div>

      <div className="instructors-grid">
        {data?.instructors.map(instructor => (
          <Link to={`/instructors/${instructor.id}`} key={instructor.id} className="instructor-card">
            <div className="avatar">
              {instructor.photoUrl 
                ? <img src={instructor.photoUrl} alt={instructor.name} />
                : <span>👤</span>
              }
            </div>
            <h3>{instructor.name}</h3>
            <p className="location">📍 {instructor.city}, {instructor.state}</p>
            <p className="price">R$ {instructor.hourlyRate.toFixed(2)}/hora</p>
            <div className="rating">
              <span>⭐ {instructor.rating.toFixed(1)}</span>
              <span>({instructor.totalLessons} aulas)</span>
            </div>
            {instructor.bio && <p className="bio">{instructor.bio}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
