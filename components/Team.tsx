"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { BrandMark } from "@/components/BrandMark";
import { MobileCarousel } from "@/components/MobileCarousel";
import { team } from "@/lib/content";
import { onceInView, prefersReducedMotion, revealEase } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function MemberCard({
  member,
}: {
  member: (typeof team)[number];
}) {
  return (
    <article data-team-card>
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-mint-soft to-[#dff3ec]">
        <Image
          data-team-photo
          src={member.photo}
          alt={`Retrato de ${member.name}`}
          fill
          className="object-contain object-bottom p-2 will-change-transform sm:p-3"
          sizes="(max-width: 768px) 75vw, (max-width: 1024px) 45vw, 30vw"
          loading="lazy"
          quality={80}
        />
      </div>
      <div data-team-meta>
        <h3 className="type-title-lg mt-4 text-ink">{member.name}</h3>
        <p className="type-caption mt-1 text-ink-soft">{member.specialty}</p>
      </div>
    </article>
  );
}

export function Team() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current;
      if (!root) return;

      const head = root.querySelector<HTMLElement>("[data-team-head]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-team-card]");
      const photos = gsap.utils.toArray<HTMLElement>("[data-team-photo]");

      const tl = gsap.timeline({
        defaults: { ease: revealEase },
        scrollTrigger: onceInView(root, "top 74%"),
      });

      if (head) {
        tl.from(head, { y: 28, autoAlpha: 0, duration: 0.8 }, 0);
      }

      cards.forEach((card, i) => {
        const photo = photos[i];
        const text = card.querySelector<HTMLElement>("[data-team-meta]");
        const at = 0.15 + i * 0.09;

        if (photo) {
          tl.fromTo(
            photo,
            { yPercent: 14, scale: 1.08, autoAlpha: 0.6 },
            {
              yPercent: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 1.05,
              ease: "power3.out",
            },
            at,
          );
        }
        if (text) {
          tl.from(text, { y: 16, autoAlpha: 0, duration: 0.55 }, at + 0.22);
        }
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="equipe"
      ref={ref}
      className="overflow-clip border-t border-line bg-surface py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl" data-team-head>
          <BrandMark size={40} className="mb-4" />
          <p className="type-label text-mint-deep">Equipe</p>
          <h2 className="type-headline mt-4 text-ink">
            Especialistas que cuidam de você
          </h2>
          <p className="type-lede mt-4 text-ink-soft">
            Time completo no mesmo consultório — da ortodontia à harmonização.
          </p>
        </div>

        {/* Mobile: carrossel */}
        <div className="mt-10">
          <MobileCarousel
            ariaLabel="Equipe de profissionais"
            slideClassName="w-[75vw] max-w-[18rem]"
          >
            {team.map((member) => (
              <MemberCard key={`m-${member.name}`} member={member} />
            ))}
          </MobileCarousel>
        </div>

        {/* Desktop: grid */}
        <ul className="mt-14 hidden gap-x-8 gap-y-12 md:grid md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li key={member.name}>
              <MemberCard member={member} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
