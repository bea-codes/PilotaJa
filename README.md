# 🚗 PilotaJá

Sistema de agendamento de aulas de direção.

## Stack

- **Web + API:** Next.js 14 (App Router + API Routes)
- **Mobile:** React Native + Expo
- **Database:** MongoDB
- **Deploy:** Vercel (web) + Expo (mobile)

## Estrutura

```
pilotaja/
├── apps/
│   ├── web/          # Next.js (frontend + API)
│   └── mobile/       # React Native + Expo
├── packages/         # Shared code (futuro)
└── package.json      # Workspaces root
```

## Setup

```bash
# Instalar dependências
npm install

# Rodar web (localhost:3000)
npm run dev

# Rodar mobile (Expo)
npm run dev:mobile
```

## Configuração

Copie `.env.example` para `.env.local` em `apps/web/`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Configure o MongoDB:
- **Local:** `mongodb://localhost:27017/pilotaja`
- **Atlas:** `mongodb+srv://user:pass@cluster.mongodb.net/pilotaja`

## Deploy

### Web (Vercel)
1. Conecte o repo no Vercel
2. Root Directory: `apps/web`
3. Configure `MONGODB_URI` nas env vars

### Mobile (Expo)
```bash
cd apps/mobile
npx expo publish
```

---

*v2.0 - Migrado para Next.js + React Native em Fev/2026*
