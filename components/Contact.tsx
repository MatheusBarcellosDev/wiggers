"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { site } from "@/lib/content";
import { onceInView, prefersReducedMotion, revealEase } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Contact() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current;
      if (!root) return;

      const lead = root.querySelector<HTMLElement>("[data-contact-lead]");
      const cta = root.querySelector<HTMLElement>("[data-contact-cta]");
      const items = gsap.utils.toArray<HTMLElement>("[data-contact-item]");

      const tl = gsap.timeline({
        defaults: { ease: revealEase },
        scrollTrigger: onceInView(root, "top 78%"),
      });

      if (lead) {
        tl.from(lead, { x: -28, autoAlpha: 0, duration: 0.9 }, 0);
      }
      if (cta) {
        tl.from(
          cta,
          { y: 18, autoAlpha: 0, scale: 0.96, duration: 0.7 },
          0.28,
        );
      }
      if (items.length) {
        tl.from(
          items,
          { x: 24, autoAlpha: 0, duration: 0.65, stagger: 0.08 },
          0.18,
        );
      }
    },
    { scope: ref },
  );

  return (
    <section
      id="contato"
      ref={ref}
      className="overflow-clip border-t border-line bg-cream py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div>
          <div data-contact-lead>
            <BrandMark size={40} className="mb-4" />
            <p className="type-label text-mint-deep">Contato & Agendar</p>
            <h2 className="type-headline mt-4 text-ink">
              Vamos cuidar do seu sorriso
            </h2>
            <p className="type-lede mt-5 text-ink-soft">
              A primeira consulta é o momento de conhecer você, entender suas
              necessidades e montar um plano individualizado — com calma e
              clareza.
            </p>
          </div>
          <a
            data-contact-cta
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-ui mt-8 inline-flex rounded-full bg-mint-deep px-6 py-3.5 text-white transition hover:bg-ink"
          >
            {site.scheduleLabel} no WhatsApp
          </a>
        </div>

        <div className="space-y-6 text-ink-soft">
          <div data-contact-item>
            <p className="type-label text-ink">Endereço</p>
            <p className="type-body mt-2">{site.address}</p>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-ui mt-2 inline-block text-ink underline decoration-mint underline-offset-4 hover:text-mint-deep"
            >
              Como chegar no Maps
            </a>
          </div>
          <div data-contact-item>
            <p className="type-label text-ink">Horário</p>
            <p className="type-body mt-2">{site.hours}</p>
          </div>
          <div data-contact-item>
            <p className="type-label text-ink">Telefone</p>
            <a
              href={site.whatsappUrl}
              className="type-body mt-2 inline-block hover:text-mint-deep"
            >
              {site.phoneDisplay}
            </a>
          </div>
          <div data-contact-item>
            <p className="type-label text-ink">E-mail</p>
            <a
              href={`mailto:${site.email}`}
              className="type-body mt-2 inline-block hover:text-mint-deep"
            >
              {site.email}
            </a>
          </div>
          <div data-contact-item className="flex gap-4 pt-2">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="type-ui text-ink underline decoration-mint underline-offset-4 hover:text-mint-deep"
            >
              Instagram
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="type-ui text-ink underline decoration-mint underline-offset-4 hover:text-mint-deep"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
