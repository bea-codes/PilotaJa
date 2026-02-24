import { API_URL, API_ENDPOINTS } from '../config/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== AULAS ====================

export type Aula = {
  _id: string;
  autoescolaId: string;
  alunoId: string | { _id: string; nome: string; email?: string; telefone?: string };
  instrutorId: string | { _id: string; nome: string; email?: string; telefone?: string };
  dataHora: string;
  duracao: number;
  tipo: 'pratica' | 'simulador' | 'teorica';
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'falta';
  observacoes?: string;
};

export type CreateAulaData = {
  autoescolaId: string;
  alunoId: string;
  instrutorId: string;
  dataHora: string;
  duracao?: number;
  tipo: string;
  observacoes?: string;
};

export const aulasService = {
  listar: (filtros?: Record<string, string>) => {
    const params = filtros ? '?' + new URLSearchParams(filtros).toString() : '';
    return request<Aula[]>(`${API_ENDPOINTS.aulas}${params}`);
  },
  
  buscarPorId: (id: string) => 
    request<Aula>(API_ENDPOINTS.aulaById(id)),
  
  criar: (data: CreateAulaData) => 
    request<Aula>(API_ENDPOINTS.aulas, { method: 'POST', body: data }),
  
  atualizar: (id: string, data: Partial<Aula>) => 
    request<Aula>(API_ENDPOINTS.aulaById(id), { method: 'PATCH', body: data }),
  
  cancelar: (id: string) => 
    request<Aula>(API_ENDPOINTS.aulaById(id), { method: 'PATCH', body: { status: 'cancelada' } }),
};

// ==================== INSTRUTORES ====================

export type Instrutor = {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  autoescolaId: string;
};

export const instrutoresService = {
  listar: (autoescolaId?: string) => {
    const params = autoescolaId ? `?autoescolaId=${autoescolaId}` : '';
    return request<Instrutor[]>(`${API_ENDPOINTS.instrutores}${params}`);
  },
  
  buscarPorId: (id: string) => 
    request<Instrutor>(API_ENDPOINTS.instrutorById(id)),
};

// ==================== ALUNOS ====================

export type Aluno = {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  autoescolaId: string;
};

export const alunosService = {
  listar: (autoescolaId?: string) => {
    const params = autoescolaId ? `?autoescolaId=${autoescolaId}` : '';
    return request<Aluno[]>(`${API_ENDPOINTS.alunos}${params}`);
  },
  
  buscarPorId: (id: string) => 
    request<Aluno>(API_ENDPOINTS.alunoById(id)),
};

export type Aluno = {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  categoriaDesejada?: string;
  status?: string;
};
