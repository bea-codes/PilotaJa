import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface InstructorDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseCategory: string;
  hourlyRate: number;
  photoUrl?: string;
  bio?: string;
  rating: number;
  totalLessons: number;
  city: string;
  state: string;
  serviceRadiusKm: number;
  availabilities: Availability[];
}

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function InstructorDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: instructor, isLoading, error } = useQuery({
    queryKey: ['instructor', id],
    queryFn: () => api.get<InstructorDetail>(`/api/instructors/${id}`).then(r => r.data)
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error || !instructor) return <div>Erro ao carregar instrutor</div>;

  return (
    <div className="container">
      <header>
        <Link to="/instructors">← Voltar</Link>
      </header>

      <div className="instructor-profile">
        <div className="avatar-lg">
          {instructor.photoUrl 
            ? <img src={instructor.photoUrl} alt={instructor.name} />
            : <span>👤</span>
          }
        </div>

        <h1>{instructor.name}</h1>
        <p className="location">📍 {instructor.city}, {instructor.state}</p>
        
        <div className="stats">
          <div className="stat">
            <span className="value">⭐ {instructor.rating.toFixed(1)}</span>
            <span className="label">Avaliação</span>
          </div>
          <div className="stat">
            <span className="value">{instructor.totalLessons}</span>
            <span className="label">Aulas</span>
          </div>
          <div className="stat">
            <span className="value">R$ {instructor.hourlyRate.toFixed(2)}</span>
            <span className="label">por hora</span>
          </div>
        </div>

        {instructor.bio && (
          <section className="bio">
            <h2>Sobre</h2>
            <p>{instructor.bio}</p>
          </section>
        )}

        <section className="info">
          <h2>Informações</h2>
          <p><strong>CNH:</strong> Categoria {instructor.licenseCategory}</p>
          <p><strong>Atende em:</strong> até {instructor.serviceRadiusKm}km de distância</p>
        </section>

        <section className="availability">
          <h2>Disponibilidade</h2>
          <ul>
            {instructor.availabilities.map((a, i) => (
              <li key={i}>
                <strong>{weekDays[a.dayOfWeek]}:</strong> {a.startTime} - {a.endTime}
              </li>
            ))}
          </ul>
        </section>

        <button className="btn-primary btn-lg">
          📅 Agendar Aula
        </button>
      </div>
    </div>
  );
}
