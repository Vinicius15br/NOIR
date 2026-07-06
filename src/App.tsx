import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { ForWhom } from './components/ForWhom';
import { HowItWorks } from './components/HowItWorks';
import { OfficeVisit } from './components/OfficeVisit';
import { Mentor } from './components/Mentor';
import { Bonuses } from './components/Bonuses';
import { Investment } from './components/Investment';
import { Faq } from './components/Faq';
import { ApplicationForm } from './components/ApplicationForm';

function Divider() {
  return <div className="divider mx-auto max-w-4xl" />;
}

export default function App() {
  return (
    <main>
      <Hero />
      <Divider />
      <Problem />
      <Divider />
      <ForWhom />
      <Divider />
      <HowItWorks />
      <Divider />
      <OfficeVisit />
      <Divider />
      <Mentor />
      <Divider />
      <Bonuses />
      <Divider />
      <Investment />
      <Divider />
      <Faq />
      <Divider />
      <ApplicationForm />
      <footer className="text-muted/60 px-6 pt-4 pb-10 text-center text-xs">
        <p>
          Noir Sessions © {new Date().getFullYear()} — Todos os direitos
          reservados.
        </p>
        <p className="mt-2">
          Nenhum resultado é garantido. Os resultados dependem da execução de
          cada operação.
        </p>
      </footer>
    </main>
  );
}
