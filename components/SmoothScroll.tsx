"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis + GSAP ticker (playbook §3).
 * Não altera a anatomia do #hero-scrub — só sincroniza a altura do documento
 * para o rodapé continuar alcançável (pinSpacing:false + imagens + reveals).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const desktop = window.matchMedia("(min-width: 769px)");
    if (!desktop.matches) return;

    const lenis = new Lenis({
      duration: 1.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.79,
      syncTouch: false,
      anchors: true,
      autoResize: true,
      autoRaf: false,
      // Next.js / altura dinâmica: usa scrollHeight real do documento
      // (evita limite curto e footer “cortado”).
      naiveDimensions: true,
    });

    let resizeTimer: number | undefined;
    const syncLenis = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        requestAnimationFrame(() => {
          lenis.resize();
        });
      }, 120);
    };

    const onScroll = (event: { progress: number }) => {
      ScrollTrigger.update();
      // Perto do fim: o unpin da hero muda a altura — recalcula o limit.
      if (event.progress > 0.88) syncLenis();
    };
    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");

    const refreshAll = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        requestAnimationFrame(() => {
          lenis.resize();
          ScrollTrigger.refresh();
          // Segundo pass: após o refresh do pin, a altura muda de novo.
          requestAnimationFrame(() => lenis.resize());
        });
      }, 120);
    };

    window.addEventListener("wiggers:scroll-refresh", refreshAll);
    window.addEventListener("load", refreshAll);
    ScrollTrigger.addEventListener("refresh", syncLenis);

    const imgs = Array.from(document.images);
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", refreshAll, { once: true });
    });

    const ro = new ResizeObserver(syncLenis);
    ro.observe(document.documentElement);
    ro.observe(document.body);

    refreshAll();

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("wiggers:scroll-refresh", refreshAll);
      window.removeEventListener("load", refreshAll);
      ScrollTrigger.removeEventListener("refresh", syncLenis);
      ro.disconnect();
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return <>{children}</>;
}
