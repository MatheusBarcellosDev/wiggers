# Wiggers Odontologia — Landing

One-page do consultório Wiggers (Palhoça-SC) com hero controlado por scroll (GSAP ScrollTrigger + vídeo) e seções de clínica, tratamentos, equipe, depoimentos e contato.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- GSAP / ScrollTrigger / `@gsap/react`
- Deploy recomendado: **Vercel**

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy na Vercel

1. Suba o repositório no GitHub/GitLab.
2. Importe o projeto em [vercel.com/new](https://vercel.com/new).
3. Framework preset: Next.js (detectado automaticamente).
4. Deploy. Depois, aponte o DNS do domínio atual para a Vercel.

Não há variáveis de ambiente obrigatórias nesta versão.

## Assets

- Logo: `public/brand/wiggers-logo.png`
- Vídeo do hero: `public/video/wiggers-hero-rotate.mp4`
- Fallback estático: `public/video/wiggers-hero-fallback.png`
- Conteúdo-fonte: `CONTENT.MD` → tipado em `lib/content.ts`

## CTA

Agendamento principal via WhatsApp: https://wa.me/5548996100507
