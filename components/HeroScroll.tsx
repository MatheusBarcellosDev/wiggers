"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroBeats, site } from "@/lib/content";
import { bindScrollVideo, whenVideoReady } from "@/lib/scrollVideo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LOGO_SRC = "/brand/wiggers-logo@2x.png";
const DESKTOP_VIDEO = "/video/wiggers-hero-rotate-scrub.mp4?v=25s";
const MOBILE_VIDEO = "/video/wiggers-hero-mobile-scrub.mp4?v=1";
const DESKTOP_FALLBACK = "/video/wiggers-hero-fallback.png";
const MOBILE_FALLBACK = "/video/wiggers-hero-mobile-fallback.png";

type TunnelPose = {
  autoAlpha: number;
  z: number;
  scale: number;
  filter: string;
};

/** Longe no eixo Z — ponto de fuga do túnel (menos extremo = menos clip no overflow). */
const TUNNEL_DEEP: TunnelPose = {
  autoAlpha: 0,
  z: -640,
  scale: 0.28,
  filter: "blur(8px)",
};

/** Plano legível na câmera. */
const TUNNEL_FOCUS: TunnelPose = {
  autoAlpha: 1,
  z: 0,
  scale: 1,
  filter: "blur(0px)",
};

/** Passa pela câmera e some. */
const TUNNEL_PAST: TunnelPose = {
  autoAlpha: 0,
  z: 220,
  scale: 1.14,
  filter: "blur(4px)",
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixPose(a: TunnelPose, b: TunnelPose, t: number): TunnelPose {
  const u = Math.min(1, Math.max(0, t));
  const blurA = Number.parseFloat(a.filter.replace(/[^0-9.]/g, "")) || 0;
  const blurB = Number.parseFloat(b.filter.replace(/[^0-9.]/g, "")) || 0;
  return {
    autoAlpha: lerp(a.autoAlpha, b.autoAlpha, u),
    z: lerp(a.z, b.z, u),
    scale: lerp(a.scale, b.scale, u),
    filter: `blur(${lerp(blurA, blurB, u)}px)`,
  };
}

function segmentT(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start || 0.001);
}

/** Túnel completo: deep → focus → hold → past (ida e volta). */
function tunnelThrough(
  progress: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number,
): TunnelPose {
  if (progress < enterStart) return TUNNEL_DEEP;
  if (progress < enterEnd) {
    return mixPose(TUNNEL_DEEP, TUNNEL_FOCUS, segmentT(progress, enterStart, enterEnd));
  }
  if (progress < exitStart) return TUNNEL_FOCUS;
  if (progress < exitEnd) {
    return mixPose(TUNNEL_FOCUS, TUNNEL_PAST, segmentT(progress, exitStart, exitEnd));
  }
  return TUNNEL_PAST;
}

/** Só emerge: deep → focus e permanece. */
function tunnelEmerge(
  progress: number,
  enterStart: number,
  enterEnd: number,
): TunnelPose {
  if (progress < enterStart) return TUNNEL_DEEP;
  if (progress < enterEnd) {
    return mixPose(TUNNEL_DEEP, TUNNEL_FOCUS, segmentT(progress, enterStart, enterEnd));
  }
  return TUNNEL_FOCUS;
}

/** Só recua: focus → deep. */
function tunnelRecede(
  progress: number,
  exitStart: number,
  exitEnd: number,
): TunnelPose {
  if (progress < exitStart) return TUNNEL_FOCUS;
  if (progress < exitEnd) {
    return mixPose(TUNNEL_FOCUS, TUNNEL_DEEP, segmentT(progress, exitStart, exitEnd));
  }
  return TUNNEL_DEEP;
}

/**
 * Hero cinematográfico: scroll → playhead do vídeo (PLAYBOOK-SCROLL-VIDEO.md).
 * Sequência: logo → frases em perspectiva de túnel → logo + CTA.
 */
export function HeroScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoStartRef = useRef<HTMLDivElement>(null);
  const logoEndRef = useRef<HTMLDivElement>(null);
  const earlyCtaRef = useRef<HTMLAnchorElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  /** null até o mount — evita baixar o vídeo errado no SSR/hidratação. */
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || videoFailed) setVideoReady(true);
  }, [reducedMotion, videoFailed]);

  const videoSrc =
    isMobile === null ? null : isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;
  const fallbackSrc = isMobile ? MOBILE_FALLBACK : DESKTOP_FALLBACK;

  useEffect(() => {
    if (!videoSrc || reducedMotion || videoFailed) return;
    setVideoReady(false);
    const el = videoRef.current;
    if (el) el.load();
  }, [videoSrc, reducedMotion, videoFailed]);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const scrub = scrubRef.current;
      const video = videoRef.current;
      const logoStart = logoStartRef.current;
      const logoEnd = logoEndRef.current;
      const earlyCta = earlyCtaRef.current;
      const stage = stageRef.current;
      if (
        !hero ||
        !scrub ||
        !logoStart ||
        !logoEnd ||
        !stage ||
        isMobile === null ||
        reducedMotion ||
        videoFailed
      ) {
        return;
      }

      let cancelled = false;
      const cleanups: Array<() => void> = [];

      const setup = async () => {
        if (video) {
          await whenVideoReady(video);
        }
        if (cancelled) return;

        const beats = Array.from(
          stage.querySelectorAll<HTMLElement>("[data-hero-beat]"),
        );
        const layers = [logoStart, ...beats, logoEnd];

        gsap.set(stage, { perspective: 1400, transformStyle: "preserve-3d" });
        gsap.set(layers, {
          transformPerspective: 1400,
          transformOrigin: "50% 50%",
          force3D: true,
          x: 0,
          y: 0,
        });

        const applyPose = (el: HTMLElement, pose: TunnelPose) => {
          // Mobile: mesma curva do túnel, em 2D suave (Z extremo clipava a hero).
          if (isMobile) {
            let y = 0;
            let scale = 1;
            let blur = 0;
            if (pose.z < 0) {
              const u = Math.min(1, Math.max(0, pose.z / TUNNEL_DEEP.z));
              y = 32 * u;
              scale = 1 - 0.08 * u;
              blur = 4 * u;
            } else if (pose.z > 0) {
              const u = Math.min(1, Math.max(0, pose.z / TUNNEL_PAST.z));
              y = -20 * u;
              scale = 1 + 0.05 * u;
              blur = 2.5 * u;
            }
            gsap.set(el, {
              opacity: pose.autoAlpha,
              z: 0,
              x: 0,
              y,
              scale,
              filter: `blur(${blur}px)`,
            });
            return;
          }
          gsap.set(el, {
            opacity: pose.autoAlpha,
            z: pose.z,
            scale: pose.scale,
            filter: pose.filter,
          });
        };

        const syncLayers = (p: number) => {
          // Timing original da animação (não comprimir no mobile).
          applyPose(logoStart, tunnelRecede(p, 0.03, 0.1));
          if (beats[0]) {
            applyPose(beats[0], tunnelThrough(p, 0.08, 0.18, 0.36, 0.44));
          }
          if (beats[1]) {
            applyPose(beats[1], tunnelThrough(p, 0.4, 0.5, 0.68, 0.76));
          }
          applyPose(logoEnd, tunnelEmerge(p, 0.74, 0.88));

          if (earlyCta) {
            let opacity = 0;
            if (p >= 0.12 && p < 0.2) opacity = segmentT(p, 0.12, 0.2);
            else if (p >= 0.2 && p < 0.74) opacity = 1;
            else if (p >= 0.74 && p < 0.84) opacity = 1 - segmentT(p, 0.74, 0.84);
            gsap.set(earlyCta, {
              opacity,
              pointerEvents: opacity > 0.4 ? "auto" : "none",
            });
          }
        };

        syncLayers(0);

        const seek = video ? bindScrollVideo(video) : null;
        if (seek) {
          cleanups.push(() => seek.destroy());
          if (cancelled) {
            cleanups.forEach((fn) => fn());
            return;
          }
        }

        // Anatomia do playbook: pin + pista.
        // Mobile: pin até #clinica no topo — só isso muda; animação do texto intacta.
        const clinica = document.getElementById("clinica");
        const pin = ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          endTrigger: isMobile && clinica ? clinica : scrub,
          end: isMobile && clinica ? "top top" : "bottom bottom",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
        cleanups.push(() => pin.kill());

        const playhead = { p: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scrub,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          playhead,
          {
            p: 1,
            duration: 1,
            onUpdate: () => {
              seek?.set(playhead.p);
              syncLayers(playhead.p);
            },
          },
          0,
        );

        cleanups.push(() => tl.kill());

        if (cancelled) {
          cleanups.forEach((fn) => fn());
          return;
        }

        seek?.set(0);
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event("wiggers:scroll-refresh"));
      };

      void setup();

      return () => {
        cancelled = true;
        cleanups.splice(0).forEach((fn) => fn());
      };
    },
    { scope: rootRef, dependencies: [reducedMotion, videoFailed, videoSrc, isMobile] },
  );

  const showVideo = !videoFailed && !reducedMotion && videoSrc !== null;

  return (
    <div ref={rootRef}>
      <section
        id="home"
        ref={heroRef}
        className="hero relative h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#e8f4ef]"
      >
        <div className="absolute inset-0">
          {/* Poster estático enquanto o scrub carrega */}
          {showVideo ? (
            <Image
              src={fallbackSrc}
              alt=""
              fill
              priority
              className={`object-cover transition-opacity duration-500 ${
                videoReady ? "opacity-0" : "opacity-100"
              }`}
              sizes="100vw"
              aria-hidden
            />
          ) : null}

          {showVideo && videoSrc ? (
            <video
              key={videoSrc}
              ref={(el) => {
                videoRef.current = el;
                el?.setAttribute("webkit-playsinline", "true");
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onError={() => {
                setVideoFailed(true);
                setVideoReady(true);
              }}
            />
          ) : (
            <Image
              src={isMobile ? MOBILE_FALLBACK : DESKTOP_FALLBACK}
              alt="Ilustração odontológica Wiggers"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}

          {(showVideo && !videoReady) || isMobile === null ? (
            <div
              className="absolute inset-0 z-[1] flex items-center justify-center bg-[#e8f4ef]/55"
              role="status"
              aria-live="polite"
              aria-label="Carregando vídeo"
            >
              <span className="hero-spinner" aria-hidden />
              <span className="sr-only">Carregando vídeo…</span>
            </div>
          ) : null}
        </div>

        {/* Mobile: véu vertical mais leve no topo. Desktop: véu à esquerda. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#e8f4ef]/75 via-[#e8f4ef]/25 to-transparent md:bg-gradient-to-r md:from-[#e8f4ef]/70 md:via-[#e8f4ef]/25 md:to-transparent" />

        {/* Mobile: tipografia um pouco abaixo da nav (não colada no topo). */}
        <div className="relative z-10 flex h-full w-full items-start overflow-visible md:items-center">
          <div className="mx-auto flex h-full w-full max-w-6xl items-start px-5 pt-[28vh] pb-28 md:items-center md:px-8 md:py-28">
            <div
              ref={stageRef}
              className="relative mx-auto w-full max-w-md min-h-[260px] overflow-visible text-center sm:max-w-lg md:mx-0 md:min-h-[380px] md:max-w-2xl md:translate-x-12 md:text-left lg:max-w-3xl lg:translate-x-16 xl:translate-x-20 [perspective:1400px]"
            >
              <h1 className="sr-only">{site.fullName}</h1>

              {/* Logo inicial */}
              <div
                className={`absolute inset-0 z-[1] flex items-start justify-center md:items-center md:justify-start ${
                  reducedMotion ? "hidden" : ""
                }`}
              >
                <div
                  ref={logoStartRef}
                  className="w-full [transform-style:preserve-3d] will-change-transform"
                >
                  <HeroLogo mark="start" />
                </div>
              </div>

              {/* Frases — z acima da logo final (enquanto ela está oculta) */}
              {heroBeats.map((beat) => (
                <div
                  key={beat.title}
                  className={`absolute inset-0 z-[2] flex items-start justify-center md:items-center md:justify-start ${
                    reducedMotion ? "hidden" : ""
                  }`}
                >
                  <div
                    data-hero-beat
                    className="w-full max-w-lg [transform-style:preserve-3d] will-change-transform"
                    style={{ opacity: 0 }}
                  >
                    <p className="type-display text-ink">{beat.title}</p>
                    <p className="type-lede mt-4 text-ink-soft md:mx-0 mx-auto">
                      {beat.subtitle}
                    </p>
                  </div>
                </div>
              ))}

              {/* Logo final + CTA */}
              <div
                className={`absolute inset-0 z-[3] flex items-start justify-center md:items-center md:justify-start ${
                  reducedMotion ? "relative inset-auto" : ""
                }`}
              >
                <div
                  ref={logoEndRef}
                  className="w-full [transform-style:preserve-3d] will-change-transform"
                  style={reducedMotion ? undefined : { opacity: 0 }}
                >
                  <HeroLogo mark="end" />
                  <p className="type-lede mx-auto mt-5 text-ink-soft md:mx-0">
                    Conheça a clínica em Palhoça, tire dúvidas e planeje o
                    cuidado ideal — de segunda a sexta, até 20h.
                  </p>
                  <a
                    href={site.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-ui pointer-events-auto mt-7 inline-flex rounded-full bg-mint-deep px-5 py-3 text-white transition hover:bg-ink"
                  >
                    {site.scheduleLabel} no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA intermediário fora do stage 3D — não compete com as frases */}
          {!reducedMotion ? (
            <a
              ref={earlyCtaRef}
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-ui pointer-events-none absolute bottom-8 left-1/2 z-20 inline-flex -translate-x-1/2 rounded-full bg-mint-deep px-5 py-3 text-white transition hover:bg-ink md:bottom-10 md:left-8 md:translate-x-0"
              style={{ opacity: 0 }}
            >
              {site.scheduleLabel} no WhatsApp
            </a>
          ) : null}
        </div>
      </section>

      {/* Pista = timeline do vídeo. Mais vh = mais scroll por segundo de vídeo. */}
      {!reducedMotion && !videoFailed ? (
        <div
          id="hero-scrub"
          ref={scrubRef}
          className="hero-scrub pointer-events-none h-[400vh] bg-[#e8f4ef] md:h-[600vh]"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

function HeroLogo({ mark }: { mark: "start" | "end" }) {
  return (
    <span className="relative mx-auto block h-28 w-full max-w-[20rem] sm:h-32 sm:max-w-[24rem] md:mx-0 md:h-36 md:max-w-[40rem] lg:h-44 lg:max-w-[46rem]">
      <Image
        src={LOGO_SRC}
        alt={site.fullName}
        fill
        className="object-contain object-center md:object-left"
        priority={mark === "start"}
        sizes="(max-width: 768px) 80vw, 46rem"
      />
    </span>
  );
}
