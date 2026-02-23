export interface Autoescola {
  _id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Instrutor {
  _id: string;
  autoescolaId: string;
  nome: string;
  email: string;
  telefone: string;
  cnh: string;
  categorias: string[]; // ['A', 'B', 'C', etc.]
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Aluno {
  _id: string;
  autoescolaId: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date;
  categoriaDesejada: string;
  status: 'ativo' | 'concluido' | 'cancelado';
  createdAt: Date;
  updatedAt: Date;
}

export interface Aula {
  _id: string;
  autoescolaId: string;
  alunoId: string;
  instrutorId: string;
  dataHora: Date;
  duracao: number; // em minutos
  tipo: 'pratica' | 'teorica' | 'simulador';
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'falta';
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Usuario {
  _id: string;
  email: string;
  senha: string;
  nome: string;
  role: 'admin' | 'autoescola' | 'instrutor' | 'aluno';
  autoescolaId?: string;
  instrutorId?: string;
  alunoId?: string;
  createdAt: Date;
  updatedAt: Date;
}
