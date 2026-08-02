"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MobileCarouselProps = {
  children: ReactNode;
  /** Largura do slide: padrão ~85% da viewport */
  slideClassName?: string;
  ariaLabel: string;
};

/**
 * Carrossel horizontal com scroll-snap — só mobile.
 * Desktop deve renderizar o grid à parte (hidden md:…).
 */
export function MobileCarousel({
  children,
  slideClassName = "w-[82vw] max-w-[22rem]",
  ariaLabel,
}: MobileCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);

  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    if (!items.length) return;

    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    items.forEach((item, i) => {
      const center = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncActive();
    track.addEventListener("scroll", syncActive, { passive: true });
    return () => track.removeEventListener("scroll", syncActive);
  }, [syncActive, slides.length]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const item = track?.children[index] as HTMLElement | undefined;
    if (!track || !item) return;
    track.scrollTo({ left: item.offsetLeft - 20, behavior: "smooth" });
  };

  return (
    <div className="md:hidden">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carrossel"
        aria-label={ariaLabel}
        className="carousel-track -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1"
      >
        {slides.map((child, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${slides.length}`}
            className={`shrink-0 snap-center ${slideClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2" aria-hidden>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? "w-6 bg-mint-deep"
                : "w-1.5 bg-line hover:bg-mint"
            }`}
          />
        ))}
      </div>
      <p className="type-caption mt-3 text-center text-ink-soft/80">
        Deslize para ver mais
      </p>
    </div>
  );
}
