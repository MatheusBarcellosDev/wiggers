# Playbook: scroll cinematográfico + vídeo scrub

Documento reutilizável. Serve para landing pages em que o scroll *é* a animação (hero com vídeo, galeria, CTA). Baseado no que funcionou no projeto Forest Cabin.

Stack típica: **HTML estático + GSAP ScrollTrigger + Lenis**.

---

## 1. Ideia central

Não “dá play” no vídeo. O visitante **rola a página** e o progresso do scroll vira `currentTime` do vídeo.

```
dedo / roda
    → Lenis (suaviza a posição de scroll)
        → ScrollTrigger (progress 0→1 numa “pista”)
            → seek do vídeo (currentTime = progress × duration)
```

Se o scroll parar seco, o vídeo também. Por isso a suavidade do scroll e a inércia importam tanto quanto o encode do MP4.

---

## 2. Anatomia da página

| Peça | Função |
|------|--------|
| **Seção pinada** (hero/CTA) | Fica fixa na viewport enquanto o usuário rola |
| **Pista / runway** (`#hero-scrub`) | Div vazia alta (`200–400vh`) que *é* o “timeline” do scrub |
| **Vídeo** | `muted`, `playsinline`, `preload="auto"` — nunca `play()` no scrub |
| **Lenis** | Suaviza wheel (desktop) e, se quiser, touch com inércia (mobile) |

Exemplo de markup:

```html
<section id="hero" class="hero">…vídeo + textos…</section>
<div id="hero-scrub" class="hero-scrub" aria-hidden="true"></div>
<!-- conteúdo seguinte (galeria etc.) -->
```

```css
.hero { height: 100dvh; }
.hero-scrub { height: 400vh; }          /* desktop: mais pista = mais lento */
@media (max-width: 768px) {
  .hero-scrub { height: 260vh; }        /* mobile: ajuste fino de ritmo */
}
```

Pin GSAP (Lenis quebra `position: sticky` — use pin):

```js
ScrollTrigger.create({
  trigger: hero,
  start: "top top",
  endTrigger: photosSection, // ou end: "+=…"
  end: "top top",
  pin: true,
  pinSpacing: false, // se a pista já controla a altura
  anticipatePin: 1,
  invalidateOnRefresh: true,
});
```

Timeline scrubada:

```js
const playhead = { p: 0 };
const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: heroScrub,
    start: "top bottom",
    end: "bottom bottom",
    scrub: 0.7, // número = atraso suave; true = 1:1 rígido
    invalidateOnRefresh: true,
  },
});
tl.to(playhead, { p: 1, duration: 1, onUpdate: () => seek.set(playhead.p) }, 0);
```

---

## 3. Lenis: o que deixa o scroll “suave”

### Desktop (recomendado)

```js
const lenis = new Lenis({
  duration: 1.85,           // maior = mais “pesado” / cinematográfico
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.72,    // < 1 = menos distância por tick da roda
  syncTouch: false,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0); // evita dessync Lenis ↔ GSAP
```

**Por que sincronizar com o ticker do GSAP?**  
Lenis e ScrollTrigger têm loops de RAF separados. Sem unificar, o pin/scrub “treme” 1–2 frames.

### Mobile — regra de ouro

O maintainer do Lenis deixa claro: **`syncTouch: false` (padrão) = scroll nativo**; o dedo não passa pelo Lenis.

| Objetivo | Config |
|----------|--------|
| Performance máxima, momentum do SO | **Não iniciar Lenis** no mobile (`matchMedia max-width: 768`) |
| Continuar um pouco após soltar o dedo (vídeo “orgânico”) | `syncTouch: true` + parâmetros leves (abaixo) |
| Sensação “travada / atrasada” | Quase sempre: `syncTouch: true` + `duration` alto + `touchMultiplier` baixo |

Mobile com inércia (sem o peso do desktop):

```js
mm.add("(max-width: 768px)", () => {
  const lenis = new Lenis({
    smoothWheel: false,
    syncTouch: true,
    // Durante o dedo: acompanha 1:1. No touchend: coast com estes valores.
    syncTouchLerp: 0.09,        // menor = coast mais longo; maior = para mais cedo
    touchInertiaExponent: 1.45, // maior = “arremesso” mais forte
    touchMultiplier: 0.55,      // < 1 freia o gesto (crítico no mobile)
  });
  return wireLenis(lenis); // on scroll → ST.update + ticker + destroy no cleanup
});
```

**Ajuste fino rápido**

- Vídeo passa rápido demais → ↓ `touchMultiplier` e/ou ↑ altura da pista (`vh`)
- Para seco demais ao soltar → ↓ `syncTouchLerp` e/ou ↑ `touchInertiaExponent`
- Pesado / lag → desliga Lenis no mobile ou tira `syncTouch`

Use `gsap.matchMedia()` para desktop ≠ mobile e sempre retorne cleanup (`lenis.destroy()`, `gsap.ticker.remove`).

---

## 4. Vídeo scrub que não engasga

### Encode (o mais importante)

Scrub precisa de **keyframes densos** (ideal: all-intra / cada frame é keyframe). Vídeo normal (GOP longo) só atualiza a cada 1s+ e “pula”.

FFmpeg (exemplo):

```bash
ffmpeg -i fonte.mp4 -an -c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart night-sky.mp4
```

- `-g 1`: keyframe a cada frame (arquivo maior, scrub suave)
- `+faststart`: metadata no início (bom pra web)
- Sem áudio no MP4 de scrub; ambient separado (`audio` + unlock no gesto)

### Seek no JS (não setar `currentTime` a cada pixel)

```js
function bindScrollVideo(el) {
  let targetTime = 0;
  let rafId = 0;

  const flush = () => {
    rafId = 0;
    if (!el.duration || el.seeking) return;
    const next = Math.min(Math.max(targetTime, 0), el.duration - 0.001);
    if (Math.abs(el.currentTime - next) < 0.001) return;
    el.currentTime = next;
  };

  el.addEventListener("seeked", () => {
    // se o scroll avançou enquanto buscava, agenda outro seek
    if (Math.abs(el.currentTime - targetTime) > 0.03 && !rafId) {
      rafId = requestAnimationFrame(flush);
    }
  });

  return {
    set(progress) {
      if (!el.duration) return;
      targetTime = progress * el.duration;
      if (!rafId) rafId = requestAnimationFrame(flush);
    },
    reset() {
      el.pause();
      targetTime = 0;
      try { el.currentTime = 0; } catch (_) {}
    },
  };
}
```

Regras:

1. **Nunca** `video.play()` no modo scrub — só `currentTime`.
2. Espere `loadeddata` / `readyState >= 2` antes de montar ScrollTriggers; depois `ScrollTrigger.refresh()`.
3. `muted` + `playsinline` + `webkit-playsinline` (iOS).
4. Prefira um MP4 otimizado pro scrub; mantenha o fonte bruto fora do deploy se for pesado.

### Atributos úteis

```html
<video
  src="night-sky.mp4"
  muted
  playsinline
  webkit-playsinline
  preload="auto"
  disablepictureinpicture
  aria-hidden="true"
></video>
```

---

## 5. Ritmo da experiência (checklist)

1. **Pista (`vh`)** — controla quanto o usuário precisa rolar para 0→100% do vídeo.
2. **`scrub: número`** — amortece a animação em relação ao scroll (`0.7` suave; `1.6` bem lento / “pesado”).
3. **Lenis `duration` / `wheelMultiplier` / `touchMultiplier`** — sensação do gesto.
4. **Texto no hero** — anime *dentro* da mesma timeline do playhead (segments por progresso), não em timers soltos.
5. **`prefers-reduced-motion`** — desliga Lenis, pin/scrub pesado e vídeo scrub; mostre frames estáticos / conteúdo legível.

---

## 6. Armadilhas que já quebraram a imersão

| Sintoma | Causa comum | Correção |
|---------|-------------|----------|
| Desktop lindo, mobile “travado” | `syncTouch: true` + `duration` alto | Lenis só desktop, ou syncTouch com multipliers baixos |
| Mobile voa e mal dá pra ver | `touchMultiplier` alto + pista curta | ↓ multiplier, ↑ `vh` da pista |
| Vídeo salta / atualiza a cada segundo | Encode com poucos keyframes | Re-encode all-intra (`-g 1`) |
| Sticky não gruda com Lenis | Sticky + smooth scroll | `ScrollTrigger` `pin: true` |
| Pin / scrub treme | Lenis e GSAP em RAFs diferentes | `gsap.ticker` + `lagSmoothing(0)` |
| iOS não inicia áudio | Autoplay policy | Unlock no primeiro `touchstart` / click |

---

## 7. Esqueleto mínimo pra copiar noutro projeto

```
1. Encode do MP4 para scrub (-g 1, faststart)
2. Markup: seção pinada + div runway alta
3. bindScrollVideo() + whenVideoReady()
4. Pin + timeline com scrub no runway
5. Lenis desktop (duration + wheelMultiplier)
6. matchMedia mobile: nativo OU syncTouch calibrado
7. prefers-reduced-motion fallback
8. Testar iOS Safari (e Low Power Mode) de verdade
```

---

## 8. Valores de partida (calibrar por projeto)

**Desktop Lenis:** `duration: 1.6–2.0`, `wheelMultiplier: 0.65–0.85`  
**Desktop pista hero:** `350–450vh`, `scrub: 0.6–0.9`  
**Mobile pista hero:** `220–300vh`  
**Mobile syncTouch (se usar):** `touchMultiplier: 0.45–0.7`, `syncTouchLerp: 0.08–0.1`, `touchInertiaExponent: 1.4–1.6`

Copie este arquivo para o próximo repo e ajuste só a seção 8 + o encode. A arquitetura (pista + pin + seek + Lenis por breakpoint) permanece.
