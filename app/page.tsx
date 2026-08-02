import dynamic from "next/dynamic";
import { HeroScroll } from "@/components/HeroScroll";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";

const About = dynamic(() =>
  import("@/components/About").then((m) => ({ default: m.About })),
);
const ClinicSpace = dynamic(() =>
  import("@/components/ClinicSpace").then((m) => ({ default: m.ClinicSpace })),
);
const Treatments = dynamic(() =>
  import("@/components/Treatments").then((m) => ({ default: m.Treatments })),
);
const Team = dynamic(() =>
  import("@/components/Team").then((m) => ({ default: m.Team })),
);
const Testimonials = dynamic(() =>
  import("@/components/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const Contact = dynamic(() =>
  import("@/components/Contact").then((m) => ({ default: m.Contact })),
);
const Footer = dynamic(() =>
  import("@/components/Footer").then((m) => ({ default: m.Footer })),
);

export default function HomePage() {
  return (
    <SmoothScroll>
      <a href="#clinica" className="skip-link type-ui">
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo">
        <HeroScroll />
        <About />
        <ClinicSpace />
        <Treatments />
        <Team />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
