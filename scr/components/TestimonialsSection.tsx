import React from 'react';
import { User, Star, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  niche: string;
  rating: number;
  highlight: string;
  content: string;
  avatarBg: string;
  avatarIconColor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Carlos Mendes',
    role: 'Infoprodutor & Consultor',
    niche: 'Finanças Pessoais',
    rating: 5,
    highlight: 'Criei meu primeiro e-book em 10 minutos',
    content: 'O processo é absurdamente rápido. Consegui estruturar um e-book de 18 páginas sobre investimentos com sumário perfeito e diagramação impecável. Já vendi mais de 140 cópias na Kiwify.',
    avatarBg: 'bg-blue-100 border-blue-200',
    avatarIconColor: 'text-blue-600',
  },
  {
    id: 't-2',
    name: 'Juliana Rocha',
    role: 'Nutricionista Clínica',
    niche: 'Saúde & Emagrecimento',
    rating: 5,
    highlight: 'Diagramação profissional sem precisar do Canva',
    content: 'Economizei horas de edição. Escolhi o modelo Pro e o resultado parece um livro diagramado por agência de design. Minhas pacientes adoraram o material de receitas e rotina alimentar.',
    avatarBg: 'bg-emerald-100 border-emerald-200',
    avatarIconColor: 'text-emerald-600',
  },
  {
    id: 't-3',
    name: 'Rodrigo Silveira',
    role: 'Gestor de Tráfego',
    niche: 'Marketing Digital',
    rating: 5,
    highlight: 'Melhor ferramenta para iscas digitais',
    content: 'Utilizo para gerar materiais ricos de captura de leads. A qualidade do texto em profundidade e as cores personalizáveis me permitiram dobrar a taxa de conversão das minhas landing pages.',
    avatarBg: 'bg-purple-100 border-purple-200',
    avatarIconColor: 'text-purple-600',
  },
  {
    id: 't-4',
    name: 'Camila Ferreira',
    role: 'Mentora de Carreira',
    niche: 'Desenvolvimento Profissional',
    rating: 5,
    highlight: 'Exportação em PDF HD com paginação exata',
    content: 'A exportação é limpa, sem cortes de texto estranhos e com numeração e cabeçalhos elegantes. Meus alunos elogiaram muito o acabamento visual do guia de transição de carreira.',
    avatarBg: 'bg-amber-100 border-amber-200',
    avatarIconColor: 'text-amber-600',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prova Social & Experiências</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          O que dizem os criadores de e-books
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Mais de 10.000 e-books já foram criados por infoprodutores, profissionais liberais e educadores.
        </p>
      </div>

      {/* Grid of Testimonial Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TESTIMONIALS.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group hover:border-blue-300"
          >
            {/* Top Stars & Niche Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 truncate max-w-[120px]">
                {item.niche}
              </span>
            </div>

            {/* Content & Highlight */}
            <div className="space-y-2 flex-1">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                "{item.highlight}"
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {item.content}
              </p>
            </div>

            {/* Bottom Author Info with Avatar Icon */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${item.avatarBg} border flex items-center justify-center shrink-0 shadow-2xs`}
              >
                <User className={`w-4.5 h-4.5 ${item.avatarIconColor}`} />
              </div>
              <div className="overflow-hidden">
                <div className="font-extrabold text-xs text-slate-900 truncate flex items-center gap-1">
                  <span>{item.name}</span>
                  <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 inline" />
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate">
                  {item.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
