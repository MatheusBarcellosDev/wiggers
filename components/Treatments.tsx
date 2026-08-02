"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { treatments } from "@/lib/content";
import { onceInView, prefersReducedMotion, revealEase } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Treatments() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current;
      if (!root) return;

      const head = root.querySelector<HTMLElement>("[data-treat-head]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-treat-card]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-treat-line]");

      const tl = gsap.timeline({
        defaults: { ease: revealEase },
        scrollTrigger: onceInView(root, "top 72%"),
      });

      if (head) {
        tl.from(head, { y: 32, autoAlpha: 0, duration: 0.85 }, 0);
      }

      if (lines.length) {
        tl.fromTo(
          lines,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.7, stagger: 0.06, ease: "power2.out" },
          0.2,
        );
      }

      if (cards.length) {
        tl.from(
          cards,
          { y: 22, autoAlpha: 0, duration: 0.65, stagger: 0.07 },
          0.28,
        );
      }
    },
    { scope: ref },
  );

  return (
    <section
      id="tratamentos"
      ref={ref}
      className="relative overflow-clip bg-cream py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl" data-treat-head>
          <BrandMark size={40} className="mb-4" />
          <p className="type-label text-mint-deep">Tratamentos</p>
          <h2 className="type-headline mt-4 text-ink">
            Especialidades para cada necessidade
          </h2>
          <p className="type-lede mt-4 text-ink-soft">
            Um cuidado integrado — do alinhamento à reabilitação completa.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {treatments.map((item) => (
            <article key={item.name} className="bg-transparent pt-5">
              <div
                data-treat-line
                className="mb-5 h-px w-full origin-left bg-mint/50"
                aria-hidden
              />
              <div data-treat-card>
                <h3 className="type-title text-ink">{item.name}</h3>
                <p className="type-caption mt-3 text-ink-soft">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
