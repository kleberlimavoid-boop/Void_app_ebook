import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen, Layers, Image, CheckCircle2, Loader2 } from 'lucide-react';

interface Step3GeneratingProps {
  title: string;
  pageCount: number;
}

export const Step3Generating: React.FC<Step3GeneratingProps> = ({ title, pageCount }) => {
  const [progress, setProgress] = useState(10);
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { title: 'Conectando ao motor de Inteligência Artificial...', desc: 'Inicializando parâmetros de alta precisão' },
    { title: 'Estruturando Capa e Sumário...', desc: 'Definindo os tópicos principais e organização' },
    { title: `Redigindo ${pageCount} páginas de conteúdo rico...`, desc: 'Criando parágrafos, listas e citações em destaque' },
    { title: 'Aplicando o modelo de diagramação...', desc: 'Ajustando tipografia, paleta e espaçamentos' },
    { title: 'Buscando imagens em alta qualidade...', desc: 'Integrando banco de fotos Unsplash e ícones' },
    { title: 'Finalizando o seu E-book...', desc: 'Tudo pronto para leitura e edição!' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92; // Wait for server response
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const stageIdx = Math.min(Math.floor((next / 100) * stages.length), stages.length - 1);
        setCurrentStage(stageIdx);
        return next;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [stages.length]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center animate-fadeIn">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />

        {/* Animated Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
          <BookOpen className="w-10 h-10 animate-bounce" />
          <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-spin" />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          A Inteligência Artificial está escrevendo seu E-book
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto line-clamp-2 font-medium">
          "{title || 'Seu E-book Profissional'}"
        </p>

        {/* Progress Bar */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>{stages[currentStage]?.title}</span>
            <span className="text-blue-600">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stages Checklist */}
        <div className="space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
          {stages.map((stg, i) => {
            const isDone = currentStage > i;
            const isCurrent = currentStage === i;
            return (
              <div key={i} className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span
                  className={
                    isDone
                      ? 'text-slate-800 font-medium'
                      : isCurrent
                      ? 'text-blue-700 font-bold'
                      : 'text-slate-400'
                  }
                >
                  {stg.title}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] text-slate-400">
          Geração protegida por criptografia de dados • Apenas alguns segundos restantes
        </p>
      </div>
    </div>
  );
};
