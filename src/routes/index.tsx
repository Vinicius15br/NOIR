import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/noir/Hero";
import { Problem } from "@/components/noir/Problem";
import { ForWhom } from "@/components/noir/ForWhom";
import { HowItWorks } from "@/components/noir/HowItWorks";
import { OfficeVisit } from "@/components/noir/OfficeVisit";
import { Mentor } from "@/components/noir/Mentor";
import { Bonus } from "@/components/noir/Bonus";
import { Investment } from "@/components/noir/Investment";
import { FAQ } from "@/components/noir/FAQ";
import { ApplicationForm } from "@/components/noir/ApplicationForm";
import { Footer } from "@/components/noir/Footer";
import { Divider } from "@/components/noir/Section";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Noir Sessions — Mentoria individual pra escalar sua agência",
      },
      {
        name: "description",
        content:
          "6 encontros individuais de até 2h com Rafa + visita presencial ao escritório da agência. Poucas vagas por ciclo, entrada por aplicação.",
      },
      {
        property: "og:title",
        content: "Noir Sessions — Mentoria individual com Rafa",
      },
      {
        property: "og:description",
        content:
          "Análise completa da sua operação de agência, 6 calls individuais e visita presencial. Entrada por aplicação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <Divider />
      <Problem />
      <ForWhom />
      <HowItWorks />
      <OfficeVisit />
      <Mentor />
      <Bonus />
      <Investment />
      <FAQ />
      <ApplicationForm />
      <Footer />
    </main>
  );
}
