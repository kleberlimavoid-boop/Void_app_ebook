import React from 'react';
import { FileText, Palette, Sparkles, Edit3, Download, Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
}

const STEPS = [
  { id: 1, name: 'Informações', icon: FileText, desc: 'Tema e Público' },
  { id: 2, name: 'Diagramação', icon: Palette, desc: 'Modelo e Estilo' },
  { id: 3, name: 'Geração IA', icon: Sparkles, desc: 'Redação Ativa' },
  { id: 4, name: 'Editor & Leitura', icon: Edit3, desc: 'Ajuste de Páginas' },
  { id: 5, name: 'Exportar PDF', icon: Download, desc: 'Download Final' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSetStep,
  canNavigateToStep,
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-2xs py-2.5 px-4 sm:px-6 overflow-x-auto scrollbar-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between min-w-[560px]">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = canNavigateToStep(step.id);

          return (
            <React.Fragment key={step.id}>
              {/* Step item */}
              <button
                onClick={() => isClickable && onSetStep(step.id)}
                disabled={!isClickable}
                className={`flex items-center gap-2 transition-all text-left ${
                  isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
                }`}
              >
                {/* Circle Icon */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-200/80'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                </div>

                {/* Text Labels */}
                <div>
                  <div
                    className={`text-[10px] font-bold leading-none ${
                      isCurrent
                        ? 'text-blue-600'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    Passo {step.id}
                  </div>
                  <div
                    className={`text-xs font-bold leading-tight mt-0.5 ${
                      isCurrent || isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {step.name}
                  </div>
                </div>
              </button>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200/80'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
