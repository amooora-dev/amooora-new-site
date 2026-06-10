import type { Metadata } from 'next';
import { LojaPageContent } from '@/components/loja/LojaPageContent';

export const metadata: Metadata = {
  title: 'Loja Amooora — Vista sua identidade sáfica',
  description:
    'Cada peça é feita com amor, representatividade e orgulho sáfico. Camisetas, moletons e acessórios feitos por nós, para nós.',
};

export default function LojaPage() {
  return <LojaPageContent />;
}
