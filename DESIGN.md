---
name: Wiggers Odontologia
description: Landing one-page do consultório — confiança local, mint clínico e hero cinematográfico
colors:
  mint: "#7ec8b1"
  mint-soft: "#c8ebe0"
  mint-deep: "#3d8f78"
  ink: "#14201c"
  ink-soft: "#3a4a44"
  cream: "#f4faf7"
  surface: "#ffffff"
  line: "#d7e8e1"
  hero-veil: "#e8f4ef"
typography:
  display:
    fontFamily: "Cormorant Garamond, Palatino Linotype, Book Antiqua, Georgia, serif"
    fontSize: "clamp(1.875rem, 4vw, 3.35rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Palatino Linotype, Book Antiqua, Georgia, serif"
    fontSize: "clamp(1.875rem, 3.5vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Cormorant Garamond, Palatino Linotype, Book Antiqua, Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  title-lg:
    fontFamily: "Cormorant Garamond, Palatino Linotype, Book Antiqua, Georgia, serif"
    fontSize: "clamp(1.35rem, 2vw, 1.65rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  lede:
    fontFamily: "Figtree, Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  lede-lg:
    fontFamily: "Figtree, Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "clamp(1.125rem, 1.5vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body:
    fontFamily: "Figtree, Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  caption:
    fontFamily: "Figtree, Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  quote:
    fontFamily: "Figtree, Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "clamp(1rem, 1.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.01em"
  label:
    fontFamily: "Figtree, Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.22em"
  ui:
    fontFamily: "Figtree, Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  nav:
    fontFamily: "Figtree, Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  full: "9999px"
  md: "12px"
spacing:
  section-y: "6rem"
  section-y-md: "8rem"
  container-x: "1.25rem"
  container-x-md: "2rem"
  gap-grid: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.mint-deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
  button-nav:
    backgroundColor: "{colors.mint-deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  button-nav-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
  treatment-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "1.25rem 0 0 0"
  team-portrait:
    backgroundColor: "{colors.mint-soft}"
    textColor: "{colors.mint-deep}"
    rounded: "0px"
  testimonial-block:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    padding: "1.5rem 0 0 0"
---

# Design System: Wiggers Odontologia

## Overview

**Creative North Star: "O Consultório de Confiança Local"**

O visual é calmo, preciso e acolhedor — clínico-limpo sem frio hospitalar, editorial na tipografia, cinematográfico só onde a hero merece (scroll-scrub + túnel 3D). A marca lidera na zona vazia do vídeo; o restante da página respira em Quiet Paper e tipografia Cormorant/Figtree, convertendo para WhatsApp sem ruído.

Profundidade vem de tom e regra fina, não de sombra. O sistema rejeita template Wix genérico, clínica roxa/neon, layout de dashboard, jornal denso e o default cream+terracotta de geração automática.

**Key Characteristics:**
- Mint clínico (Fresh Enamel / Trust Teal) sobre Quiet Paper e Aririú Ink
- Display serifado (Cormorant Garamond) + body geométrico acolhedor (Figtree)
- CTAs em pílula tátil; seções flat com borda `line` ou hairline mint
- Hero full-bleed com logo grande na área sem o dente; motion respeita `prefers-reduced-motion`
- Marca (logo + mark) como assinatura recorrente, não decoração solta

## Colors

Paleta mint-on-cream: frescor odontológico com contraste de ink quase-floresta para texto e bandas escuras.

### Primary
- **Fresh Enamel** (`#7ec8b1` / `{colors.mint}`): acento vivo — selection, underlines, eyebrow em banda escura, detalhes de marca.
- **Trust Teal** (`#3d8f78` / `{colors.mint-deep}`): CTA primário, eyebrows em seções claras, ênfase de confiança.
- **Soft Enamel** (`#c8ebe0` / `{colors.mint-soft}`): fundos de retrato/placeholder e gradientes suaves de equipe.

### Neutral
- **Quiet Paper** (`#f4faf7` / `{colors.cream}`): fundo de página e seções claras intercaladas.
- **Surface** (`#ffffff` / `{colors.surface}`): painéis brancos (About, Team, Footer).
- **Aririú Ink** (`#14201c` / `{colors.ink}`): texto principal, hover de CTA, banda de depoimentos.
- **Ink Soft** (`#3a4a44` / `{colors.ink-soft}`): corpo secundário e nav links.
- **Clinic Line** (`#d7e8e1` / `{colors.line}`): divisores e borda do header scrolled.
- **Hero Veil** (`#e8f4ef`): véu à esquerda do vídeo para legibilidade da copy/logo.

### Named Rules
**The One Accent Rule.** Trust Teal e Fresh Enamel carregam ação e ênfase; não introduzir um segundo accent (roxo, coral, neon).

**The Quiet Paper Rule.** Fundos claros ficam em cream/surface/mint-soft — nunca cream quente/terracota genérico.

## Typography

**Display Font:** Cormorant Garamond (Palatino / Georgia)
**Body Font:** Figtree (Segoe UI)

**Character:** Serifa editorial suave (Cormorant) transmite cuidado e precisão clínica; Figtree mantém UI e corpo acolhedores, modernos e legíveis.

### Hierarchy (classes `.type-*` em `globals.css`)
- **Display** (`.type-display`): frases da hero — Cormorant 500, até `3.35rem`, lh `1.05`, tracking leve negativo, `text-wrap: balance`.
- **Headline** (`.type-headline`): `h2` de seção — Cormorant 500, clamp até `3rem`, lh `1.1`.
- **Title** (`.type-title` / `.type-title-lg`): nomes de tratamento e equipe.
- **Lede** (`.type-lede` / `.type-lede-lg`): suporte de seção e prosa About — Figtree, ≤`65ch`.
- **Body** (`.type-body`): endereço e prosa utilitária — `1rem` / lh `1.625`, ≤`65ch`.
- **Caption** (`.type-caption`): descrições curtas, especialidade, rodapé — `0.875rem`.
- **Quote** (`.type-quote`): depoimentos em banda ink — lh `1.7` + tracking leve (light-on-dark).
- **Label** (`.type-label`): eyebrows — `0.75rem`, semibold, tracking `0.22em`, uppercase.
- **UI / Nav** (`.type-ui` / `.type-nav`): CTAs e links — `0.875rem`, peso 600 / 500.

Pesos carregados: Cormorant Garamond `400–600`; Figtree `400`, `500`, `600`.

### Named Rules
**The Serif Speaks Rule.** Cormorant só em títulos e nomes; nunca em botões ou nav.

**The Label Whisper Rule.** Eyebrows mint + tracking `0.22em` (mesmo valor em seção e metadados de contato); um por bloco, sem pilhas de pills.

**The Measure Rule.** Lede e body ficam em ~45–65ch; grids estreitos usam caption, não lede.

## Layout

Container `max-w-6xl`, padding `px-5` / `md:px-8`. Seções `py-24` / `md:py-32`. Ritmo: uma ideia por seção, headline + suporte curto.

Hero: full viewport; conteúdo de marca/copy na **coluna esquerda** (zona sem o dente), levemente empurrada à direita; vídeo full-bleed atrás. Grids: tratamentos 2→4 colunas; equipe 2→3; depoimentos 3; contato 2 colunas.

Breakpoints observados: sm 640, md 768, lg 1024 (Tailwind default).

### Named Rules
**The Empty-Zone Rule.** Na hero, logo e frases vivem na área vazia à esquerda do dente — nunca centrar a marca no meio do molar.

## Elevation & Depth

**Flat-by-default.** Sem box-shadow de card. Profundidade = contraste tonal (cream ↔ surface ↔ ink), hairlines (`border-line`, `border-mint/50`, `border-white/15`), véu do hero, e motion 3D só no túnel de texto da hero.

Header scrolled: `bg-cream/90` + `backdrop-blur` + borda — único “vidro”, e só **depois** da hero (ao chegar em `#clinica`).

### Named Rules
**The Flat-By-Default Rule.** Superfícies em repouso são planas. Não inventar sombra multi-camada ou glow.

## Shapes

Pílulas `rounded-full` nos CTAs e no botão de menu. Cantos retos em blocos de conteúdo e placeholders de equipe. Sem cards com radius+shadow; tratamentos e depoimentos usam **borda superior** como âncora.

### Named Rules
**The Pill CTA Rule.** Ação primaria = pílula Trust Teal → hover Aririú Ink. Não usar botões retangulares sólidos como default.

## Components

Sensação geral: **tátil e confiante** — CTAs presentes, tipografia carrega hierarquia, ornamentação mínima.

### Buttons
- **Shape:** pílula (`rounded-full`)
- **Primary:** Trust Teal, texto branco, padding ~`px-5/6 py-3/3.5`, semibold `text-sm`
- **Hover:** fundo Aririú Ink
- **Nav Agendar:** mesma família, um pouco mais compacta

### Cards / Containers
- **Treatments:** sem card — `border-t border-mint/50`, fundo transparente, `pt-5`
- **Team portrait:** bloco 4:5, fundo mint-soft → `#dff3ec`, foto do profissional (cutout) com `object-contain`
- **Testimonials:** banda ink; quote com `border-t border-white/15`

### Navigation
- Fixa, transparente na hero; solidifica só após a hero
- Links `text-sm` ink-soft → ink; logo dark no header
- Mobile: menu cream + borda line

### Brand Mark
- Ícone do dente (`wiggers-mark.png`) em seções como assinatura; watermark grande e baixa opacidade em About/Testimonials
- Logo wordmark (`wiggers-logo@2x` / dark) na hero e nav

### Hero (signature)
- Vídeo scrub por scroll (GSAP + Lenis desktop); frases em perspectiva de túnel (eixo Z)
- Sequência: logo grande → frases → logo + CTA
- Fallback estático + reduced-motion sem scrub

### Inputs / Fields
- Não há formulário nesta versão (CTA só WhatsApp). Não inventar campos.

## Do's and Don'ts

### Do:
- **Do** usar Trust Teal em CTAs e Fresh Enamel em acentos leves.
- **Do** manter Cormorant nos títulos e Figtree no resto.
- **Do** colocar marca/copy da hero na zona vazia esquerda.
- **Do** manter flat-by-default; hairline > sombra.
- **Do** respeitar `prefers-reduced-motion` no hero e reveals.

### Don't:
- **Don't** parecer Wix genérico, dashboard ou broadsheet denso.
- **Don't** usar roxo/neon, glow, ou cream+terracota “AI default”.
- **Don't** empilhar pills, stats strips ou cards com sombra na hero.
- **Don't** inventar segundo accent ou tipografia fora do par Cormorant Garamond / Figtree.
- **Don't** solidificar o header no primeiro tick do scrub da hero.
