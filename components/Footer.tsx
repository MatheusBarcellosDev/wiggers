"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { site } from "@/lib/content";
import { onceInView, prefersReducedMotion, revealEase } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current;
      if (!root) return;

      gsap.from(root.querySelectorAll("[data-footer-item]"), {
        y: 12,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: revealEase,
        scrollTrigger: onceInView(root, "top 92%"),
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="overflow-clip border-t border-line bg-surface py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-ink-soft md:flex-row md:items-center md:justify-between md:px-8">
        <div data-footer-item className="flex items-center gap-3">
          <BrandMark size={28} />
          <p className="type-caption">
            © {year} {site.fullName}
          </p>
        </div>
        <div data-footer-item className="flex flex-wrap items-center gap-4">
          <p className="type-caption">Palhoça · Santa Catarina</p>
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-ui text-mint-deep underline decoration-mint underline-offset-4 hover:text-ink"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
