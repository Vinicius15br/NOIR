import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "./Section";

const faqs = [
  {
    q: "Serve pra quem não sabe nada do mercado?",
    a: "Sim. A Call 1 vira o desenho do seu ponto de partida e a Call 2 vira seu plano de entrada. Você constrói certo desde o início em vez de corrigir depois.",
  },
  {
    q: "E se eu já tenho agência rodando?",
    a: "Melhor ainda — a análise parte dos seus números e processos reais. O raio X identifica exatamente onde a operação perde dinheiro hoje.",
  },
  {
    q: "Por que individual e não em grupo?",
    a: "Porque correção genérica não resolve problema específico. No individual, 100% do tempo de call é sobre a SUA operação.",
  },
  {
    q: "As calls são gravadas?",
    a: "Sim, todas. Você recebe as gravações das suas 6 calls.",
  },
  {
    q: "Como funciona a visita ao escritório?",
    a: "Agendada em data combinada, mediante termo de confidencialidade. Deslocamento e hospedagem por conta do mentorado.",
  },
  {
    q: "Existe parcelamento?",
    a: "Sim. As condições são apresentadas na call de aplicação.",
  },
  {
    q: "O que justifica o valor?",
    a: "12 horas de call individual com quem opera o mercado, plano de execução personalizado, contrato da operação, gravações e acesso presencial a uma agência real. Você paga pra pular meses de tentativa e erro.",
  },
  {
    q: "Vocês garantem resultado?",
    a: "Não — e desconfie de quem garante. Entregamos processo, direção e correção. O resultado depende da sua execução.",
  },
];

export function FAQ() {
  return (
    <Section id="faq" eyebrow="Perguntas frequentes">
      <h2 className="font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl">
        Antes que você{" "}
        <span className="italic text-gold-gradient">pergunte</span>
      </h2>

      <Accordion type="single" collapsible className="mt-12 w-full">
        {faqs.map((f, i) => (
          <AccordionItem
            key={f.q}
            value={`item-${i}`}
            className="border-b border-border/70"
          >
            <AccordionTrigger className="py-6 text-left font-serif text-[17px] font-semibold text-foreground hover:no-underline sm:text-lg">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-6 font-sans text-[15px] leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
