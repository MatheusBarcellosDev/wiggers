"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const next = document.getElementById("clinica");
      if (!next) {
        setScrolled(window.scrollY > window.innerHeight);
        return;
      }
      setScrolled(next.getBoundingClientRect().top <= 64);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/80 bg-cream/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 md:h-20 md:px-8">
        <a href="#home" className="relative block h-11 w-[168px] shrink-0 md:h-12 md:w-[190px]">
          <Image
            src="/brand/wiggers-logo-dark.png"
            alt={site.fullName}
            fill
            className="object-contain object-left"
            priority
            sizes="190px"
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="type-nav text-ink-soft transition hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-ui rounded-full bg-mint-deep px-4 py-2 text-white transition hover:bg-ink"
          >
            Agendar
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-ui rounded-full bg-mint-deep px-3.5 py-2 text-white transition hover:bg-ink"
          >
            Agendar
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="nav-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span
                className={`h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span className={`h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="nav-mobile"
          className="border-t border-line bg-cream px-5 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="type-body font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
