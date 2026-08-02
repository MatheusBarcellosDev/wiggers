"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { MobileCarousel } from "@/components/MobileCarousel";
import { clinicSpace } from "@/lib/content";
import { onceInView, prefersReducedMotion, revealEase } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ClinicSpace() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current;
      if (!root) return;

      const head = root.querySelector<HTMLElement>("[data-space-head]");
      const frames = gsap.utils.toArray<HTMLElement>("[data-space-frame]");
      const photos = gsap.utils.toArray<HTMLElement>("[data-space-photo]");

      const tl = gsap.timeline({
        defaults: { ease: revealEase },
        scrollTrigger: onceInView(root, "top 75%"),
      });

      if (head) {
        tl.from(head, { y: 40, autoAlpha: 0, duration: 0.9 }, 0);
      }

      frames.forEach((frame, i) => {
        tl.fromTo(
          frame,
          { clipPath: "inset(14% 10% 14% 10%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power3.out" },
          0.2 + i * 0.12,
        );
      });

      photos.forEach((photo, i) => {
        tl.fromTo(
          photo,
          { scale: 1.12 },
          { scale: 1, duration: 1.35, ease: "power2.out" },
          0.2 + i * 0.12,
        );
      });
    },
    { scope: ref },
  );

  const [hero, mid, detail] = clinicSpace.images;
  const slides = [hero, mid, detail];

  return (
    <section
      id="espaco"
      ref={ref}
      className="relative overflow-hidden bg-cream py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl" data-space-head>
          <BrandMark size={40} className="mb-4" />
          <p className="type-label text-mint-deep">{clinicSpace.eyebrow}</p>
          <h2 className="type-headline mt-4 text-ink">{clinicSpace.title}</h2>
          <p className="type-lede mt-4 text-ink-soft">{clinicSpace.lede}</p>
        </div>

        {/* Mobile: carrossel */}
        <div className="mt-10">
          <MobileCarousel ariaLabel="Fotos do consultório">
            {slides.map((image) => (
              <figure
                key={image.src}
                data-space-frame
                className="relative aspect-[4/5] overflow-hidden bg-mint-soft"
              >
                <Image
                  data-space-photo
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover will-change-transform"
                  sizes="82vw"
                  loading="lazy"
                  quality={75}
                />
              </figure>
            ))}
          </MobileCarousel>
        </div>

        {/* Desktop: composição editorial */}
        <div className="mt-14 hidden gap-4 md:grid md:grid-cols-12 md:gap-5 md:items-stretch">
          <figure
            data-space-frame
            className="relative col-span-7 min-h-[28rem] overflow-hidden bg-mint-soft"
          >
            <Image
              data-space-photo
              src={hero.src}
              alt={hero.alt}
              fill
              className="object-cover will-change-transform"
              sizes="58vw"
              loading="lazy"
              quality={75}
            />
          </figure>

          <div className="col-span-5 grid grid-rows-2 gap-4">
            <figure
              data-space-frame
              className="relative min-h-0 overflow-hidden bg-mint-soft"
            >
              <Image
                data-space-photo
                src={mid.src}
                alt={mid.alt}
                fill
                className="object-cover will-change-transform"
                sizes="38vw"
                loading="lazy"
                quality={75}
              />
            </figure>
            <figure
              data-space-frame
              className="relative min-h-0 overflow-hidden bg-mint-soft"
            >
              <Image
                data-space-photo
                src={detail.src}
                alt={detail.alt}
                fill
                className="object-cover will-change-transform"
                sizes="38vw"
                loading="lazy"
                quality={75}
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
