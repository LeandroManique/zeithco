import React from 'react';
import { 
  BarChart3, 
  Cpu, 
  Rocket, 
  Video, 
  Layout, 
  Target, 
  Layers, 
  Zap, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { Service } from './types';

export const SERVICES_DATA: Service[] = [
  {
    id: 'intel',
    title: 'Consultoria',
    description: 'Análise de dados e funil. O caminho exato para vender mais.',
    priceEstimate: 'Diagnóstico a partir de R$ 5.000,00.',
    briefingLink: '#contact'
  },
  {
    id: 'business',
    title: 'Arquitetura de Negócio',
    description: 'Da viabilidade à escala. Organização completa para crescer.',
    priceEstimate: 'Estruturação a partir de R$ 12.000,00.',
    briefingLink: '#contact'
  },
  {
    id: 'launch',
    title: 'Lançamentos',
    description: 'Estratégia, copy e tráfego. Do zero ao faturamento real.',
    priceEstimate: 'Taxa fixa + % de sucesso.',
    briefingLink: '#contact'
  },
  {
    id: 'video-ai',
    title: 'Vídeos IA',
    description: 'Influenciadores virtuais e anúncios. Escala sem travas.',
    priceEstimate: 'Pacotes a partir de R$ 3.500,00.',
    briefingLink: '#contact'
  },
  {
    id: 'landing-pages',
    title: 'Landing Pages',
    description: 'Design e copy orientados por dados para conversão máxima.',
    priceEstimate: 'A partir de R$ 2.500,00.',
    briefingLink: '#contact'
  },
  {
    id: 'traffic',
    title: 'Tráfego Pago',
    description: 'Performance pura. Menos vaidade, mais ROI.',
    priceEstimate: 'Gestão a partir de R$ 2.000,00.',
    briefingLink: '#contact'
  }
];

export const ICONS = {
  Marketing: BarChart3,
  Architecture: Layers,
  Rocket: Rocket,
  Video: Video,
  Layout: Layout,
  Traffic: Target,
  Zap: Zap,
  Users: Users,
  Check: CheckCircle2
};
