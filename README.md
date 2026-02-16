# 🚗 PilotaJá

> Plataforma para conectar alunos a instrutores de direção autônomos

## 📋 Sobre o Projeto

PilotaJá é um aplicativo que permite:
- **Alunos** encontrarem instrutores de direção na sua região
- **Instrutores autônomos** gerenciarem suas aulas e agenda
- **Agendamento** simples e rápido de aulas práticas

## 🛠️ Stack

| Camada | Tecnologia |
|--------|------------|
| **Frontend Web** | React + Vite + TypeScript |
| **Mobile** | .NET MAUI (iOS + Android) |
| **Backend** | .NET 8 + FastEndpoints |
| **Banco de Dados** | SQL Server |
| **Documentação API** | Swagger/OpenAPI |

## 📁 Estrutura do Projeto

```
PilotaJa/
├── src/
│   ├── PilotaJa.API/           # Backend .NET
│   │   ├── Domain/             # Entidades
│   │   ├── Features/           # Endpoints (FastEndpoints)
│   │   │   ├── Instrutores/
│   │   │   ├── Alunos/
│   │   │   ├── Agendamentos/
│   │   │   └── Aulas/
│   │   └── Infrastructure/     # DbContext, Configs
│   │
│   ├── PilotaJa.Web/           # Frontend React (Web)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── hooks/
│   │   └── package.json
│   │
│   ├── PilotaJa.Mobile/        # App Mobile (.NET MAUI)
│   │   ├── Views/              # Páginas XAML
│   │   ├── ViewModels/         # MVVM ViewModels
│   │   ├── Services/           # API, Auth
│   │   └── Resources/          # Assets, Fonts
│   │
│   └── PilotaJa.Shared/        # DTOs compartilhados
│       └── DTOs/               # Usados por API, Web e Mobile
│
└── docs/                        # Documentação adicional
```

## 🚀 Como Rodar

### Pré-requisitos
- .NET 8 SDK
- Node.js 18+
- SQL Server (ou Docker)

### Backend

```bash
cd src/PilotaJa.API
dotnet restore
dotnet run
```

API disponível em: `http://localhost:5000`  
Swagger: `http://localhost:5000/swagger`

### Frontend

```bash
cd src/PilotaJa.Web
npm install
npm run dev
```

App disponível em: `http://localhost:5173`

### Mobile (.NET MAUI)

```bash
cd src/PilotaJa.Mobile

# Android
dotnet build -f net8.0-android
dotnet run -f net8.0-android

# iOS (requer Mac)
dotnet build -f net8.0-ios
dotnet run -f net8.0-ios
```

## 📡 Endpoints da API

### Instrutores
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/instrutores` | Lista instrutores (com filtros) |
| GET | `/api/instrutores/{id}` | Detalhes do instrutor |
| POST | `/api/instrutores` | Cadastra instrutor |
| PUT | `/api/instrutores/{id}` | Atualiza instrutor |

### Alunos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/alunos/{id}` | Detalhes do aluno |
| POST | `/api/alunos` | Cadastra aluno |
| PUT | `/api/alunos/{id}` | Atualiza aluno |

### Agendamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/agendamentos` | Lista agendamentos |
| GET | `/api/agendamentos/{id}` | Detalhes do agendamento |
| POST | `/api/agendamentos` | Cria agendamento |
| PUT | `/api/agendamentos/{id}/confirmar` | Instrutor confirma |
| PUT | `/api/agendamentos/{id}/cancelar` | Cancela agendamento |
| PUT | `/api/agendamentos/{id}/concluir` | Marca como concluído |

## 🗄️ Entidades Principais

### Instrutor
- Dados pessoais e CNH
- Preço por hora
- Disponibilidade (dias/horários)
- Localização e raio de atendimento
- Avaliação média

### Aluno
- Dados pessoais
- Histórico de aulas

### Agendamento
- Instrutor + Aluno
- Data/hora e duração
- Local de encontro
- Status (Pendente → Confirmado → Concluído)
- Avaliação pós-aula

## 🔐 Autenticação (TODO)

- JWT para autenticação
- Roles: `Aluno`, `Instrutor`, `Admin`

## 📱 Features Planejadas

- [ ] Autenticação (login social)
- [ ] Busca por geolocalização
- [ ] Chat entre aluno e instrutor
- [ ] Notificações push
- [ ] Pagamento integrado (Stripe/Pix)
- [ ] Avaliações e comentários
- [ ] Dashboard do instrutor
- [ ] App mobile (React Native)

## 👥 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Projeto privado - Todos os direitos reservados.

---

*Criado com ⚡ por Magirk*
