"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useId, useState, useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { treatments } from "@/lib/content";
import { onceInView, prefersReducedMotion, revealEase } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function TreatmentCard({
  item,
}: {
  item: (typeof treatments)[number];
}) {
  return (
    <article className="bg-transparent pt-1">
      <div
        data-treat-line
        className="mb-5 h-px w-full origin-left bg-mint/50"
        aria-hidden
      />
      <div data-treat-card>
        <h3 className="type-title text-ink">{item.name}</h3>
        <p className="type-caption mt-3 text-ink-soft">{item.description}</p>
      </div>
    </article>
  );
}

function TreatmentAccordion({
  items,
}: {
  items: typeof treatments;
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="md:hidden">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-btn-${index}`;

        return (
          <li key={item.name} data-treat-row className="border-t border-mint/50">
            <button
              id={buttonId}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="type-title text-ink">{item.name}</span>
              <span
                aria-hidden
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center text-mint-deep transition-transform duration-300 ease-out ${
                  open ? "rotate-45" : ""
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1v12M1 7h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="type-caption pb-5 pr-10 text-ink-soft">
                  {item.description}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Treatments() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current;
      if (!root) return;

      const head = root.querySelector<HTMLElement>("[data-treat-head]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-treat-row]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-treat-card]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-treat-line]");

      const tl = gsap.timeline({
        defaults: { ease: revealEase },
        scrollTrigger: onceInView(root, "top 72%"),
      });

      if (head) {
        tl.from(head, { y: 32, autoAlpha: 0, duration: 0.85 }, 0);
      }

      // Mobile: stagger das linhas do índice
      if (rows.length) {
        tl.from(
          rows,
          { y: 16, autoAlpha: 0, duration: 0.55, stagger: 0.05 },
          0.2,
        );
      }

      // Desktop: hairlines + cards
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

        <div className="mt-10">
          <TreatmentAccordion items={treatments} />
        </div>

        <div className="mt-14 hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-4">
          {treatments.map((item) => (
            <TreatmentCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
