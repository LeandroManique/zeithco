import React, { useEffect, useState } from 'react';
import { SERVICES_DATA } from './constants';
import { Service } from './types';
import Button from './components/Button';
import Modal from './components/Modal';
import GeminiChat from './components/GeminiChat';
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/leandro-zeithco/30min';

const useCalendlyWidget = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.querySelector('script[data-calendly-widget]')) return;
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.dataset.calendlyWidget = 'true';
    document.head.appendChild(script);
  }, []);

  return () => {
    // @ts-ignore Calendly injected via widget script
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener');
    }
  };
};

type ServiceModalContent = {
  note?: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  bullets?: string[];
  bulletsTitle?: string;
  closing?: string[];
  ctaLabel: string;
};

const SERVICE_MODAL_CONTENT: Record<string, ServiceModalContent> = {
  intel: {
    title: 'Consultoria Estratégica',
    subtitle: 'Inteligência completa, da decisão ao resultado',
    paragraphs: [
      'A consultoria não é um serviço pontual.',
      'É um acompanhamento estratégico completo, pensado para negócios que precisam crescer com clareza, velocidade e controle.',
      'Aqui, não se trata apenas de analisar dados ou ajustar campanhas. O trabalho começa na leitura profunda do negócio e avança por todas as camadas que impactam resultado.'
    ],
    bullets: [
      'análise de dados, funil e mercado',
      'estruturação estratégica de marketing e aquisição',
      'definição clara de prioridades',
      'desenvolvimento e implementação das ações',
      'acompanhamento contínuo',
      'mensuração real de resultados'
    ],
    bulletsTitle: 'A consultoria envolve:',
    closing: [
      'O objetivo não é fazer mais coisas, mas fazer as coisas certas, na ordem certa, com critério e acompanhamento humano direto.',
      'É indicada para quem já entendeu que crescimento consistente não vem de ações isoladas, mas de inteligência aplicada de forma contínua.'
    ],
    ctaLabel: 'Agendar diagnostico / orcamento'
  },
  business: {
    title: 'Arquitetura de Negócio',
    subtitle: 'Da viabilidade à escala, com projeto',
    paragraphs: [
      'Esse trabalho funciona como um projeto de arquitetura.',
      'Antes de construir, é preciso entender o terreno, os limites e o potencial real.',
      'A Arquitetura de Negócio organiza o crescimento antes da execução pesada.'
    ],
    bullets: [
      'análise de viabilidade',
      'estudo de mercado e tamanho da oportunidade',
      'definição clara de público e posicionamento',
      'estruturação de oferta',
      'desenho do funil e dos canais',
      'preparação para escala'
    ],
    bulletsTitle: 'Inclui:',
    closing: [
      'Ao final, o negócio deixa de operar no improviso e passa a operar com projeto, direção e lógica de crescimento.',
      'É o tipo de trabalho que evita desperdício de tempo, dinheiro e energia antes de escalar.'
    ],
    ctaLabel: 'Agendar diagnostico / orcamento'
  },
  launch: {
    title: 'Lançamentos Digitais',
    subtitle: 'Do zero ao faturamento real',
    paragraphs: [
      'Lançamentos não são eventos isolados.',
      'São sistemas temporários de alta intensidade que precisam de estratégia, coordenação e execução precisa.'
    ],
    bullets: [
      'definição estratégica do lançamento',
      'estruturação de todos os ativos digitais',
      'páginas, copys e roteiros',
      'orientação e acompanhamento tático',
      'organização do tráfego e da aquisição',
      'ajustes para escalar após a validação'
    ],
    bulletsTitle: 'O trabalho envolve:',
    closing: [
      'O foco não é hype.',
      'É faturamento real, com estrutura para repetir e escalar.'
    ],
    ctaLabel: 'Agendar diagnostico / orcamento'
  },
  'video-ai': {
    title: 'Vídeos com Inteligência Artificial',
    subtitle: 'Escala criativa sem travas operacionais',
    paragraphs: [
      'Vídeos com IA não são apenas produção rápida.',
      'Quando bem feitos, são ativos estratégicos de marketing.'
    ],
    bullets: [
      'entendimento do posicionamento do negócio',
      'elaboração estratégica do conteúdo',
      'desenvolvimento de personagem ou identidade visual',
      'roteirização',
      'definição de linha editorial',
      'produção dos vídeos'
    ],
    bulletsTitle: 'O trabalho envolve:',
    closing: [
      'O resultado é escala de conteúdo e anúncios sem depender de estruturas pesadas, gravações constantes ou gargalos operacionais.'
    ],
    ctaLabel: 'Agendar diagnostico / orcamento'
  },
  'landing-pages': {
    title: 'Landing Pages',
    subtitle: 'Conversão construída com dados e estratégia',
    paragraphs: [
      'Landing pages não são apenas design.',
      'São pontos críticos de decisão dentro do funil.'
    ],
    bullets: [
      'entendimento do posicionamento',
      'leitura do público',
      'definição clara do objetivo',
      'estrutura de conversão',
      'copy orientada por comportamento',
      'integração com chat de IA'
    ],
    bulletsTitle: 'Cada página é criada a partir de:',
    closing: [
      'O foco é transformar tráfego em lead e venda, com clareza e eficiência.'
    ],
    ctaLabel: 'Agendar diagnostico / orcamento'
  },
  traffic: {
    title: 'Tráfego Pago',
    subtitle: 'Performance sem vaidade',
    paragraphs: [
      'Tráfego pago não é sobre gastar mais.',
      'É sobre investir melhor.'
    ],
    bullets: [
      'leitura estratégica do negócio',
      'definição de objetivos claros',
      'estruturação das campanhas',
      'acompanhamento e otimização contínua',
      'análise de dados para tomada de decisão'
    ],
    bulletsTitle: 'O trabalho envolve:',
    closing: [
      'O tráfego funciona como alavanca, não como aposta.'
    ],
    ctaLabel: 'Agendar diagnostico / orcamento'
  }
};

// --- Sections ---

const Navbar = ({ openCalendly }: { openCalendly: () => void }) => (
  <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <div className="text-2xl font-bold tracking-tighter text-white">
        ZEITH CO
      </div>
      <div className="hidden md:flex gap-10 text-base font-medium text-gray-400">
        <a href="#services" className="hover:text-white hover:underline decoration-zeith-metal underline-offset-8 transition-all">Serviços</a>
        <a href="/como-trabalhamos" className="hover:text-white hover:underline decoration-zeith-metal underline-offset-8 transition-all">Como Trabalhamos</a>
        <button onClick={openCalendly} className="hover:text-white hover:underline decoration-zeith-metal underline-offset-8 transition-all text-left">
          Contato
        </button>
      </div>
      <div className="hidden md:block">
        <Button variant="outline" className="!px-6 !py-2 !text-xs" onClick={openCalendly}>
          Falar Agora
        </Button>
      </div>
    </div>
  </nav>
);

const Hero = ({ openCalendly }: { openCalendly: () => void }) => (
  <section className="relative min-h-screen flex items-center pt-24 border-b border-white/5">
    <div className="container mx-auto px-6">
      <div className="max-w-5xl">
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-10 leading-[0.9]">
          Marketing. IA.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">
            Resultado Rápido.
          </span>
        </h1>
        <p className="text-2xl md:text-3xl text-gray-400 mb-12 max-w-3xl font-light leading-snug">
          Inteligência para encurtar o caminho.<br/>
          <span className="text-white">Sem romantismo. Sem desperdício.</span>
        </p>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-20">
          <div className="h-px w-20 bg-zeith-metal"></div>
          <p className="text-lg text-gray-500 max-w-lg">
            Repertório técnico em dados e comportamento. Tecnologia aplicada a negócios reais.
          </p>
        </div>

        <Button className="!text-base !px-10 !py-4" onClick={openCalendly}>
          Acelerar meu Negócio
        </Button>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-32 bg-zeith-gray border-y border-white/5">
    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-none">
          Atalho é<br/>inteligência.
        </h2>
      </div>
      <div className="text-gray-300 space-y-8 text-xl md:text-2xl border-l-2 border-zeith-metal pl-10">
        <p>
          Empresas fracassam por caminhos longos.
        </p>
        <p className="text-gray-500">
          Confundem movimento com progresso.
        </p>
        <p className="text-white font-medium">
          Investem sem leitura estratégica.
        </p>
      </div>
    </div>
  </section>
);

const Services = ({ openModal }: { openModal: (s: Service) => void }) => (
  <section id="services" className="py-32">
    <div className="container mx-auto px-6">
      <div className="mb-20">
        <span className="text-zeith-metal text-sm font-bold tracking-widest uppercase mb-4 block">Serviçõs</span>
        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">Da estratégia e execução.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {SERVICES_DATA.map((service) => (
          <div key={service.id} className="group border-t border-white/20 pt-8 hover:border-zeith-metal transition-colors duration-500 flex flex-col h-full bg-black">
            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-zeith-metalHover transition-colors">
              {service.title}
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 flex-1">
              {service.description}
            </p>
            <div className="mt-auto">
              <button 
                onClick={() => openModal(service)}
                className="text-sm uppercase tracking-widest text-white hover:text-zeith-metal transition-colors flex items-center gap-4 group/btn"
              >
                Detalhes
                <span className="block w-8 h-px bg-white group-hover/btn:bg-zeith-metal transition-colors"></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Methodology = () => (
  <section id="method" className="py-32 bg-zeith-gray relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid lg:grid-cols-2 gap-20">
        <div>
          <span className="text-zeith-metal text-sm font-bold tracking-widest uppercase mb-4 block">COMO OPERAMOS</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-16 tracking-tight">
            IA acelera.<br/>Critério decide.
          </h2>
          <div className="space-y-10">
            {[
              "Objetivo Real",
              "Caminho Curto",
              "Sistema Certo",
              "Execução com IA",
              "Ajuste Fino"
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <span className="text-lg font-mono text-gray-600 group-hover:text-zeith-metal transition-colors">0{i + 1}</span>
                <p className="text-3xl text-gray-300 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Abstract Graphic */}
        <div className="hidden lg:flex items-center justify-center opacity-30">
            <div className="w-full max-w-md aspect-square border border-white/10 relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-zeith-metal/10 to-transparent"></div>
               <div className="absolute bottom-0 left-0 w-full h-1/2 border-t border-white/10"></div>
               <div className="absolute top-0 right-0 w-1/2 h-full border-l border-white/10"></div>
               <div className="absolute bottom-10 right-10 w-20 h-20 bg-zeith-metal/20 backdrop-blur-md"></div>
            </div>
        </div>
      </div>
    </div>
  </section>
);

const TargetAudience = () => (
  <section className="py-32 border-b border-white/5">
    <div className="container mx-auto px-6">
      <h2 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-16 text-center">Para quem é</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 items-stretch">
        {[
          {
            title: "Empresas Maduras",
            subtitle: 'Que sentem que a marca ficou "pequena" para o tamanho real da operação e precisam alinhar a percepção ao faturamento.'
          },
          {
            title: "Líderes",
            subtitle: 'Que rejeitam o "marketing de esperança" e exigem diagnósticos baseados em dados, IA e previsibilidade.'
          },
          {
            title: "Marcas Tradicionais",
            subtitle: 'Que precisam se modernizar digitalmente sem desrespeitar sua história ou parecer genéricas.'
          },
          {
            title: "Quem precisa da visão estratégica",
            subtitle: "de um Diretor de Marketing Sênior, mas quer a agilidade e a isenção de uma consultoria externa."
          }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className="h-full p-8 rounded-lg border border-white/10 hover:border-zeith-metal transition-colors bg-black/40 flex flex-col gap-4"
          >
            <div className="flex-1 space-y-3 flex flex-col">
              <h3 className="text-2xl font-semibold text-white leading-tight">{item.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = ({ openCalendly }: { openCalendly: () => void }) => (
  <section id="contact" className="py-32">
    <div className="container mx-auto px-6 max-w-3xl">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-none">
        Chegue ao resultado.
      </h2>
      <p className="text-2xl text-gray-400 mb-16">
        Inteligência encurta caminhos. <br/>
        <span className="text-white">Vamos conversar?</span>
      </p>
      
      <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <label className="text-sm text-zeith-metal uppercase tracking-widest font-bold">Nome</label>
            <input type="text" className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-zeith-metal transition-colors" placeholder="Seu nome" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zeith-metal uppercase tracking-widest font-bold">Email</label>
            <input type="email" className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-zeith-metal transition-colors" placeholder="email@empresa.com" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-zeith-metal uppercase tracking-widest font-bold">O Desafio</label>
          <textarea rows={2} className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-zeith-metal transition-colors" placeholder="Resuma o que você precisa..."></textarea>
        </div>
        <div className="pt-10">
          <Button fullWidth className="!text-lg !py-5" onClick={openCalendly}>
            Iniciar Conversa
          </Button>
        </div>
      </form>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-16 border-t border-white/10 bg-black">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-2xl font-bold tracking-tighter text-white">
        ZEITH CO
      </div>
      <div className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} ZEITH CO.
      </div>
    </div>
  </footer>
);

const HowWeWorkPage = ({ openCalendly }: { openCalendly: () => void }) => {
  const goHome = () => {
    window.location.href = '/';
  };

  const goContact = () => {
    window.location.href = '/#contact';
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-zeith-metal selection:text-black">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-white">
            ZEITH CO
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="!px-4 !py-2" onClick={goHome}>
              Voltar
            </Button>
            <Button className="!px-4 !py-2" onClick={goContact}>
              Contato
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20">
        <section className="container mx-auto px-6 max-w-4xl space-y-10">
          <div className="space-y-3">
            <span className="text-sm font-bold tracking-widest uppercase text-zeith-metal">Como Trabalhamos</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Estratégia, critério e execução com nexo
            </h1>
          </div>

          <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
            <p>
              Eu trabalho onde a maioria dos negócios começa a travar: no espaço entre a visão do que você quer construir e a realidade do que, de fato, consegue ser executado no dia a dia.
            </p>
            <p>
              Nos últimos anos, vi o marketing ser cada vez mais guiado por imitação superficial. Estratégias copiadas do que aparece nas redes, campanhas replicadas sem entender a expertise por trás dos casos de sucesso, decisões tomadas a partir de recortes visuais e não de leitura estratégica. O resultado costuma ser muito esforço, muito movimento e pouco avanço real.
            </p>
            <p>
              Com o tempo, ficou claro para mim que o problema raramente é falta de ferramentas, anúncios ou dedicação. Na maioria das vezes, o problema é falta de nexo. Estratégias que não conversam com a realidade do negócio. Execuções padronizadas aplicadas a contextos únicos. Automação usada para substituir pensamento, quando deveria potencializá-lo.
            </p>
            <p>
              Meu trabalho segue o caminho oposto.
            </p>
            <p>
              Eu organizo marketing, aquisição e o uso de inteligência artificial como um ofício intelectual. Antes de acelerar, eu preciso entender. Antes de escalar, eu preciso decidir junto com você. Antes de automatizar, é preciso critério. Dados e IA entram como aceleradores do que já faz sentido, nunca como atalhos para compensar falta de leitura, repertório ou experiência.
            </p>
            <p>
              A ZEITH nasce como consequência direta dessa forma de trabalhar. Mais do que uma empresa de serviços, ela funciona como um hub estratégico-operacional que conecta visão, decisão e execução real. É onde a estratégia deixa de ser discurso e a execução deixa de ser improviso ou repetição automática de fórmulas prontas.
            </p>
            <p>
              Aqui, o trabalho não é industrializado nem diluído em centenas de operações simultâneas. Cada projeto exige leitura de contexto, responsabilidade intelectual e acompanhamento humano direto. Eu participo ativamente das decisões, justamente para garantir que o crescimento seja mais rápido, mas principalmente mais consciente, controlável e sustentável.
            </p>
            <p>
              Na prática, as pessoas que chegam até mim normalmente estão buscando velocidade. Permanecem porque encontram clareza. E avançam porque passam a operar com menos dispersão estratégica, menos desperdício e mais domínio sobre o próprio crescimento.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={openCalendly}
              className="!px-10 !py-4"
            >
              Agendar um Diagnóstico
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const openCalendly = useCalendlyWidget();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const modalContent = selectedService ? SERVICE_MODAL_CONTENT[selectedService.id] : null;
  const isHowWeWorkPage = typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('como-trabalhamos');

  if (isHowWeWorkPage) {
    return <HowWeWorkPage openCalendly={openCalendly} />;
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-zeith-metal selection:text-black">
      <Navbar openCalendly={openCalendly} />
      <main>
        <Hero openCalendly={openCalendly} />
        <About />
        <Services openModal={setSelectedService} />
        <Methodology />
        <TargetAudience />
        <Contact openCalendly={openCalendly} />
      </main>
      <Footer />
      
      {/* Modals & Overlays */}
      <Modal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)}
        title={modalContent?.title || selectedService?.title || ''}
      >
        {modalContent ? (
          <div className="space-y-6">
            <div className="space-y-2">
              {selectedService?.title && (
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{selectedService.title}</p>
              )}
              <h4 className="text-3xl font-bold text-white leading-tight">{modalContent.title}</h4>
              {modalContent.subtitle && (
                <p className="text-lg text-gray-300 leading-snug">{modalContent.subtitle}</p>
              )}
            </div>

            {modalContent.paragraphs.map((paragraph, idx) => (
              <p key={`para-${idx}`} className="text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {modalContent.bullets && (
              <div className="border border-white/10 bg-white/5 rounded-lg p-5 space-y-3">
                {modalContent.bulletsTitle && (
                  <p className="text-sm text-gray-400 font-semibold">{modalContent.bulletsTitle}</p>
                )}
                <ul className="space-y-2 text-gray-200 list-disc list-inside">
                  {modalContent.bullets.map((item, idx) => (
                    <li key={`bullet-${idx}`} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {modalContent.closing?.map((paragraph, idx) => (
              <p key={`closing-${idx}`} className="text-gray-200 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="pt-2">
              <Button fullWidth onClick={() => {
                setSelectedService(null);
                openCalendly();
              }}>
                {modalContent.ctaLabel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              {selectedService?.description}
            </p>
            
            <div className="p-6 border-l-2 border-zeith-metal bg-zeith-gray">
              <p className="text-xs text-zeith-metal uppercase tracking-widest mb-2">Investimento</p>
              <p className="text-xl text-white font-medium">{selectedService?.priceEstimate}</p>
            </div>

            <div className="pt-2">
              <Button fullWidth onClick={() => {
                setSelectedService(null);
                openCalendly();
              }}>
                Solicitar Proposta
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <GeminiChat />
    </div>
  );
};

export default App;
