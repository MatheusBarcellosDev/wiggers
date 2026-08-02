# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Público amplo da região de Palhoça/Grande Florianópolis buscando odontologia integrada:

- Adultos locais na primeira consulta ou retorno de tratamento
- Pais/responsáveis com acompanhamento infantil (odontopediatria / ortopedia)
- Pacientes de estética e harmonização facial
- Quem precisa de especialidades (implante, prótese, endodontia, periodontia, clareamento) no mesmo consultório

Job principal: entender a clínica com confiança e agendar a primeira consulta com pouco atrito.

## Product Purpose

Landing one-page do **Wiggers Consultório Odontológico / Wiggers Odontologia** para apresentar a clínica, especialidades, equipe e prova social, e converter para agendamento.

Sucesso = visitante chega ao CTA de agendamento (WhatsApp) sem dúvida sobre quem somos, o que fazemos e como falar conosco.

## Positioning

Consultório em Palhoça com time de especialistas no mesmo lugar (não “clínica genérica de uma especialidade”), ortodontia/ortopedia com a Dra. Nathalie Wiggers, horário estendido Segunda–Sexta até 20h, e combinação de acolhimento + tecnologia — afirmações que um vizinho não copia só com copy genérica.

## Operating Context

- Site one-page com âncoras (Home, Clínica, Tratamentos, Equipe, Contato, Agendar)
- Conversão principal fora do site: WhatsApp `(48) 99610-0507` / `https://wa.me/5548996100507`
- Endereço: Av. Bom Jesus de Nazaré, 1665, 1º andar — Aririú, Palhoça-SC — CEP 88135-101
- Horário: Segunda a Sexta, 08:00–20:00
- Contato adicional: `clinicawiggers@gmail.com`; Instagram `@wiggers.odontologia`; Facebook da clínica
- Domínio histórico / referência do site anterior: wiggersodontologia.com.br (Wix)
- Deploy alvo do redesign: Vercel (Next.js)

## Capabilities and Constraints

- Stack vigente: Next.js (App Router) + TypeScript + Tailwind CSS v4 + GSAP ScrollTrigger + Lenis (desktop)
- Conteúdo tipado em `lib/content.ts`; fonte factual em `CONTENT.MD`
- Hero cinematográfico com vídeo scrub por scroll (`PLAYBOOK-SCROLL-VIDEO.md`)
- CTA de agendamento: **somente WhatsApp** nesta versão (sem formulário/canal paralelo confirmado)
- Não inventar preços, planos, certificações ou claims clínicos não confirmados
- Fotos de equipe no site antigo são de baixa qualidade (remove-bg); redesign não deve tratar isso como asset final obrigatório

## Brand Commitments

- Nome: Wiggers Consultório Odontológico / Wiggers Odontologia / “Odontologia Integrada” (marca nos assets)
- Assets de marca em `brand/` e `public/brand/` (`wiggers-logo.png`, variantes dark/light, `@2x`)
- Tom: acolhedor, profissional, claro — confiança local, não hype clínico inventado

## Evidence on Hand

- Textos institucionais, especialidades (8), equipe (6) e contatos: `CONTENT.MD` / `lib/content.ts`
- Depoimentos reais (3) — **atribuição autor↔texto confirmada com a clínica** para uso no site
- Logo e previews de marca: `brand/`, `public/brand/`
- Vídeo hero + fallback: `public/video/`
- Ausências que o trabalho futuro **não deve fabricar**: cases clínicos com métricas, prêmios, preços, convênios listados, fotos de equipe de estúdio (ainda não entregues como set final)

## Product Principles

1. Confiança local antes de ornamentação — fatos, equipe e caminho claro para agendar.
2. Conversão sem atrito — WhatsApp como único CTA de agendamento até haver outro canal confirmado.
3. Especialidade integrada como diferencial — mostrar o time completo, não só um procedimento.
4. Prova social só com atribuição confirmada — depoimentos reais, sem inventar quotes.
5. Acessibilidade como requisito de produto — ver seção seguinte.

## Accessibility & Inclusion

WCAG é requisito explícito do produto. Futuro trabalho de UI deve preservar contraste legível, foco/teclado, respeito a `prefers-reduced-motion` (já relevante no hero com scroll/vídeo), e alternativas quando mídia animada não for utilizável.
