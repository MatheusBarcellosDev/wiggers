"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { testimonials } from "@/lib/content";
import { onceInView, prefersReducedMotion, revealEase } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current;
      if (!root) return;

      const head = root.querySelector<HTMLElement>("[data-quote-head]");
      const quotes = gsap.utils.toArray<HTMLElement>("[data-quote]");
      const mark = root.querySelector<HTMLElement>("[data-quote-mark]");

      const tl = gsap.timeline({
        defaults: { ease: revealEase },
        scrollTrigger: onceInView(root, "top 78%"),
      });

      if (head) {
        tl.from(head, { y: 36, autoAlpha: 0, duration: 0.9 }, 0);
      }

      if (quotes.length) {
        tl.from(
          quotes,
          {
            y: 40,
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 0.95,
            stagger: 0.14,
            clearProps: "filter",
          },
          0.2,
        );
      }

      if (mark) {
        gsap.fromTo(
          mark,
          { rotate: -6, scale: 0.92 },
          {
            rotate: 4,
            scale: 1.04,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <section
      id="depoimentos"
      ref={ref}
      className="relative overflow-hidden bg-ink py-24 text-cream md:py-32"
    >
      <BrandMark
        size={360}
        opacity={0.14}
        data-quote-mark
        className="pointer-events-none absolute -bottom-16 -right-10 will-change-transform md:-right-6 md:bottom-0"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div data-quote-head>
          <BrandMark size={44} className="mb-5" />
          <p className="type-label text-mint">Depoimentos</p>
          <h2 className="type-headline mt-4 max-w-xl text-cream">
            Pacientes que confiam na Wiggers
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.author}
              data-quote
              className="border-t border-white/15 pt-6"
            >
              <p className="type-quote text-cream/90">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="type-ui mt-6 text-mint">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
