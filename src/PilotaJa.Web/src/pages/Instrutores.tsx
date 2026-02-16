import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

interface Instrutor {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  precoHora: number;
  avaliacao: number;
  totalAulas: number;
  fotoUrl?: string;
  bio?: string;
}

export default function Instrutores() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['instrutores'],
    queryFn: () => api.get<{ instrutores: Instrutor[] }>('/api/instrutores').then(r => r.data)
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
          <option value="avaliacao">Melhor avaliação</option>
          <option value="preco">Menor preço</option>
          <option value="aulas">Mais aulas</option>
        </select>
      </div>

      <div className="instrutores-grid">
        {data?.instrutores.map(instrutor => (
          <Link to={`/instrutores/${instrutor.id}`} key={instrutor.id} className="instrutor-card">
            <div className="avatar">
              {instrutor.fotoUrl 
                ? <img src={instrutor.fotoUrl} alt={instrutor.nome} />
                : <span>👤</span>
              }
            </div>
            <h3>{instrutor.nome}</h3>
            <p className="location">📍 {instrutor.cidade}, {instrutor.estado}</p>
            <p className="price">R$ {instrutor.precoHora.toFixed(2)}/hora</p>
            <div className="rating">
              <span>⭐ {instrutor.avaliacao.toFixed(1)}</span>
              <span>({instrutor.totalAulas} aulas)</span>
            </div>
            {instrutor.bio && <p className="bio">{instrutor.bio}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
