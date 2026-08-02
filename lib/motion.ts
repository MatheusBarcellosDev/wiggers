import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Defaults compartilhados — ease exponencial, sem “template” idêntico. */
export const revealEase = "power3.out";

export function onceInView(
  trigger: Element | null,
  start = "top 78%",
): ScrollTrigger.Vars {
  return {
    trigger: trigger ?? undefined,
    start,
    once: true,
  };
}
