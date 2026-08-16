import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, Download, Palette, Layers, Zap } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'geral' | 'criacao' | 'planos' | 'exportacao';
  icon: React.ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Como funciona a criação de e-books com IA na plataforma?',
    answer: 'Em apenas 5 passos intuitivos: você digita o tema, público-alvo e quantidade de páginas no Passo 1, escolhe o estilo de diagramação e cores no Passo 2, e a Inteligência Artificial estrutura o sumário, capítulos completos e introdução no Passo 3. No Passo 4 você edita fontes, cores e capas, e no Passo 5 exporta seu PDF pronto para distribuição ou venda.',
    category: 'criacao',
    icon: <Sparkles className="w-4 h-4 text-blue-600" />,
  },
  {
    id: 'faq-2',
    question: 'Posso editar o conteúdo, fontes e capa após a IA gerar o e-book?',
    answer: 'Sim! No Passo 4 (Editor & Leitura) você tem controle total para personalizar títulos, subtítulos, fontes de títulos e parágrafos, paleta de cores e alternar a foto de capa — seja escolhendo entre as centenas de opções da nossa galeria integrada ou fazendo upload direto do seu dispositivo.',
    category: 'criacao',
    icon: <Palette className="w-4 h-4 text-purple-600" />,
  },
  {
    id: 'faq-3',
    question: 'Em quais formatos posso baixar meus e-books?',
    answer: 'Todos os e-books são exportados em PDF de Alta Definição (HD) vetorizado com paginação exata, quebras de página automáticas e sumário clicável. Você também pode escolher a proporção ideal: A4 para impressão/leitura clássica, 16:9 para computadores e apresentações, ou 4:5 para celulares e redes sociais.',
    category: 'exportacao',
    icon: <Download className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'faq-4',
    question: 'Qual é a diferença entre os planos Básico, Pro e Pro+ Anual?',
    answer: 'O Plano Básico permite até 3 e-books/mês de até 12 páginas com diagramações essenciais. O Plano Pro amplia para 10 e-books/mês de até 18 páginas, modo Conteúdo Profundo, 6 diagramações PRO e gráficos visuais. Já o Pro+ Anual oferece a cota máxima de 20 e-books/mês renovados a cada 30 dias durante 365 dias, além de todos os recursos PRO desbloqueados.',
    category: 'planos',
    icon: <Zap className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 'faq-5',
    question: 'Os direitos autorais dos e-books gerados são meus? Posso vendê-los?',
    answer: 'Sim, 100% dos direitos autorais pertencem a você. Você pode comercializar seus e-books em plataformas como Hotmart, Kiwify, Eduzz, Amazon KDP, usá-los como iscas digitais para captação de leads ou compartilhá-los livremente.',
    category: 'geral',
    icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'faq-6',
    question: 'Meus e-books ficam salvos para eu acessar depois?',
    answer: 'Sim! Todos os e-books criados ficam salvos com segurança na sua biblioteca em nuvem (Meus E-books). Você pode reabri-los a qualquer momento para reler, editar ou baixar novamente em PDF sem consumir novas cotas do seu plano.',
    category: 'geral',
    icon: <Layers className="w-4 h-4 text-teal-600" />,
  },
];

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Perguntas Frequentes
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
                FAQ
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Tire suas dúvidas sobre criação, edição, planos e exportação de e-books
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="grid gap-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                  : 'border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-4 text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                    {item.icon}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {item.question}
                  </span>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-4.5 pb-4.5 pt-1 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-blue-100/60 pl-15 sm:pl-16.5 animate-fadeIn">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
