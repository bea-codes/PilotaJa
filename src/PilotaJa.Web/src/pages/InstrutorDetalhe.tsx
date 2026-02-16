import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

interface Disponibilidade {
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
}

interface InstrutorDetalhe {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  categoriaCNH: string;
  precoHora: number;
  fotoUrl?: string;
  bio?: string;
  avaliacao: number;
  totalAulas: number;
  cidade: string;
  estado: string;
  raioAtendimentoKm: number;
  disponibilidades: Disponibilidade[];
}

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function InstrutorDetalhe() {
  const { id } = useParams<{ id: string }>();

  const { data: instrutor, isLoading, error } = useQuery({
    queryKey: ['instrutor', id],
    queryFn: () => api.get<InstrutorDetalhe>(`/api/instrutores/${id}`).then(r => r.data)
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error || !instrutor) return <div>Erro ao carregar instrutor</div>;

  return (
    <div className="container">
      <header>
        <Link to="/instrutores">← Voltar</Link>
      </header>

      <div className="instrutor-perfil">
        <div className="avatar-lg">
          {instrutor.fotoUrl 
            ? <img src={instrutor.fotoUrl} alt={instrutor.nome} />
            : <span>👤</span>
          }
        </div>

        <h1>{instrutor.nome}</h1>
        <p className="location">📍 {instrutor.cidade}, {instrutor.estado}</p>
        
        <div className="stats">
          <div className="stat">
            <span className="value">⭐ {instrutor.avaliacao.toFixed(1)}</span>
            <span className="label">Avaliação</span>
          </div>
          <div className="stat">
            <span className="value">{instrutor.totalAulas}</span>
            <span className="label">Aulas</span>
          </div>
          <div className="stat">
            <span className="value">R$ {instrutor.precoHora.toFixed(2)}</span>
            <span className="label">por hora</span>
          </div>
        </div>

        {instrutor.bio && (
          <section className="bio">
            <h2>Sobre</h2>
            <p>{instrutor.bio}</p>
          </section>
        )}

        <section className="info">
          <h2>Informações</h2>
          <p><strong>CNH:</strong> Categoria {instrutor.categoriaCNH}</p>
          <p><strong>Atende em:</strong> até {instrutor.raioAtendimentoKm}km de distância</p>
        </section>

        <section className="disponibilidade">
          <h2>Disponibilidade</h2>
          <ul>
            {instrutor.disponibilidades.map((d, i) => (
              <li key={i}>
                <strong>{diasSemana[d.diaSemana]}:</strong> {d.horaInicio} - {d.horaFim}
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
