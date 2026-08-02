"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { about } from "@/lib/content";
import { onceInView, prefersReducedMotion, revealEase } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function About() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current;
      if (!root) return;

      const intro = root.querySelector<HTMLElement>("[data-about-intro]");
      const paras = gsap.utils.toArray<HTMLElement>("[data-about-copy]");
      const mark = root.querySelector<HTMLElement>("[data-about-mark]");

      const tl = gsap.timeline({
        defaults: { ease: revealEase },
        scrollTrigger: onceInView(root, "top 80%"),
      });

      if (intro) {
        tl.from(intro, { x: -36, autoAlpha: 0, duration: 0.95 }, 0);
      }
      if (paras.length) {
        tl.from(
          paras,
          { y: 28, autoAlpha: 0, duration: 0.85, stagger: 0.14 },
          0.18,
        );
      }
      if (mark) {
        tl.from(
          mark,
          { scale: 0.86, autoAlpha: 0, duration: 1.35, ease: "power2.out" },
          0.1,
        );
        gsap.to(mark, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: ref },
  );

  return (
    <section
      id="clinica"
      ref={ref}
      className="relative overflow-hidden border-t border-line bg-surface py-24 md:py-32"
    >
      <BrandMark
        size={280}
        opacity={0.12}
        data-about-mark
        className="pointer-events-none absolute -right-8 top-8 md:right-10 md:top-16"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:px-8">
        <div data-about-intro>
          <BrandMark size={48} className="mb-5" />
          <p className="type-label text-mint-deep">{about.eyebrow}</p>
          <h2 className="type-headline mt-4 text-ink">{about.title}</h2>
        </div>
        <div className="space-y-5">
          {about.body.map((paragraph) => (
            <p
              key={paragraph}
              data-about-copy
              className="type-lede-lg text-ink-soft"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
