// Configuração da API
// Em desenvolvimento, use o IP local do seu PC (rode ipconfig no Windows)
// Em produção, aponte para a URL do Vercel

const DEV_API_URL = 'https://pilota-ja-web.vercel.app'; // Dev também usa Vercel
const PROD_API_URL = 'https://pilota-ja-web.vercel.app'; // Produção

// Detecta se está em desenvolvimento
const isDev = __DEV__;

export const API_URL = isDev ? DEV_API_URL : PROD_API_URL;

export const API_ENDPOINTS = {
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  
  // Aulas
  aulas: '/api/aulas',
  aulaById: (id: string) => `/api/aulas/${id}`,
  
  // Alunos
  alunos: '/api/alunos',
  alunoById: (id: string) => `/api/alunos/${id}`,
  
  // Instrutores
  instrutores: '/api/instrutores',
  instrutorById: (id: string) => `/api/instrutores/${id}`,
  
  // Autoescolas
  autoescolas: '/api/autoescolas',
  autoescolaById: (id: string) => `/api/autoescolas/${id}`,
  
  // Upload
  upload: '/api/upload',
  imageById: (id: string) => `/api/images/${id}`,
};
