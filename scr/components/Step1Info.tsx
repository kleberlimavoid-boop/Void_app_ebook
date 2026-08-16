import React, { useState } from 'react';
import { EbookInput, UserAccount, EbookGenre, EbookTone, isProUser } from '../types';
import { GENRE_PRESETS } from '../data/templates';
import { CustomSelect, SelectOption } from './CustomSelect';
import { Sparkles, ArrowRight, Wand2, HelpCircle, AlertCircle, Crown, BookOpen } from 'lucide-react';

const TONE_OPTIONS: SelectOption[] = [
  { value: 'profissional', label: 'Profissional & Corporativo' },
  { value: 'descontraido', label: 'Descontraído & Amigável' },
  { value: 'educativo', label: 'Educativo & Didático' },
  { value: 'inspirador', label: 'Inspirador & Motivacional' },
  { value: 'tecnico', label: 'Técnico & Especialista' },
];

interface Step1InfoProps {
  input: EbookInput;
  onChange: (updated: Partial<EbookInput>) => void;
  onNext: () => void;
  user: UserAccount;
  onOpenPlans: () => void;
}

export const Step1Info: React.FC<Step1InfoProps> = ({
  input,
  onChange,
  onNext,
  user,
  onOpenPlans,
}) => {
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{ title: string; subtitle: string }[]>([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  const isPro = isProUser(user.plan);
  const maxAllowedPages = user.maxPagesPerEbook || (isPro ? 18 : 12);

  const handleSuggestTitles = async () => {
    if (!input.description && !input.genre) {
      alert('Por favor, preencha a ideia principal ou escolha um gênero para a IA gerar sugestões precisas!');
      return;
    }

    setLoadingSuggestions(true);
    try {
      const res = await fetch('/api/suggest-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: input.genre,
          description: input.description,
          tone: input.tone,
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
        setShowSuggestionsModal(true);
      } else {
        alert(data.error || 'Erro ao gerar sugestões. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      alert('Falha na comunicação com a IA. Verifique sua conexão.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSelectSuggestion = (title: string, subtitle: string) => {
    onChange({ title, subtitle });
    setShowSuggestionsModal(false);
  };

  const isFormValid =
    input.title.trim().length > 0 &&
    input.description.trim().length > 5 &&
    (input.genre !== 'outro' || (input.customGenre && input.customGenre.trim().length > 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="mb-8 text-center sm:text-left bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent p-6 rounded-2xl border border-blue-100">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5" /> Etapa 1 de 4
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Conte sobre o seu novo E-book
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Forneça as informações fundamentais. Quanto mais específico você for, mais preciso e rico será o conteúdo gerado pela inteligência artificial.
        </p>
      </div>

      <div className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* Genre Selector Grid */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            1. Qual é o gênero ou área do e-book? <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {GENRE_PRESETS.map((preset) => {
              const isSelected = input.genre === preset.id;
              return (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => onChange({ genre: preset.id as EbookGenre })}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20 text-blue-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold leading-snug">{preset.label}</span>
                  <div
                    className={`w-2 h-2 rounded-full self-end ${
                      isSelected ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Custom Genre Input when 'outro' is selected */}
          {input.genre === 'outro' && (
            <div className="mt-3.5 p-4 rounded-xl bg-blue-50/60 border border-blue-200 animate-fadeIn">
              <label className="block text-xs font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Especifique o Gênero / Área do seu E-book: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={input.customGenre || ''}
                onChange={(e) => onChange({ customGenre: e.target.value })}
                placeholder="Ex: Arquitetura & Decoração, Astronomia, Artesanato, Fotografia, Psicologia..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-blue-300 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-xs font-medium outline-hidden"
                autoFocus
              />
              <p className="text-[11px] text-blue-700 mt-1">
                Este nome será utilizado no cabeçalho das páginas e na diagramação profissional do seu e-book.
              </p>
            </div>
          )}
        </div>

        {/* Title & Subtitle + AI Suggestion */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900">
              2. Título do E-book <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleSuggestTitles}
              disabled={loadingSuggestions}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <Wand2 className={`w-3.5 h-3.5 ${loadingSuggestions ? 'animate-spin' : ''}`} />
              {loadingSuggestions ? 'Gerando ideias...' : 'Sugerir Títulos com IA'}
            </button>
          </div>

          <input
            type="text"
            value={input.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Guia Definitivo do Marketing Digital para Iniciantes"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm font-medium outline-hidden"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtítulo (Opcional)
            </label>
            <input
              type="text"
              value={input.subtitle}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="Ex: Como atrair clientes todos os dias trabalhando em casa"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-800 text-xs font-medium outline-hidden"
            />
          </div>
        </div>

        {/* Description / Main Topic */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-1">
            3. Descrição / Tópicos Principais do Conteúdo <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Explique o que o e-book deve ensinar, quais problemas resolve e quais capítulos você quer incluir.
          </p>
          <textarea
            rows={4}
            value={input.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Ex: Quero um e-book prático com 5 passos claros para quem está começando um negócio. Inclua exemplos reais, listas de tarefas, dicas de divulgação e uma lista de verificação no final."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm font-normal outline-hidden"
          />
        </div>

        {/* Audience and Tone */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              4. Público-Alvo
            </label>
            <input
              type="text"
              value={input.targetAudience}
              onChange={(e) => onChange({ targetAudience: e.target.value })}
              placeholder="Ex: Empreendedores, estudantes, mães, profissionais de TI..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-xs font-medium outline-hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              5. Tom de Voz da Escrita
            </label>
            <CustomSelect
              value={input.tone}
              onChange={(val) => onChange({ tone: val as EbookTone })}
              options={TONE_OPTIONS}
            />
          </div>
        </div>

        {/* Page Count Selection Slider */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                6. Quantidade de Páginas
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {input.pageCount} Páginas
                </span>
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                {isPro
                  ? 'Seu Plano permite até 18 páginas por e-book.'
                  : 'Seu Plano Básico permite até 12 páginas por e-book.'}
              </p>
            </div>

            {!isPro && input.pageCount >= maxAllowedPages && (
              <button
                type="button"
                onClick={onOpenPlans}
                className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-lg border border-purple-300 transition-colors cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-purple-500 text-purple-600" />
                Desbloquear 18 Páginas (Plano Pro / Pro+)
              </button>
            )}
          </div>

          <input
            type="range"
            min={3}
            max={maxAllowedPages}
            step={1}
            value={input.pageCount}
            onChange={(e) => onChange({ pageCount: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-2">
            <span>3 págs (E-book Rápido)</span>
            <span>{Math.round(maxAllowedPages / 2)} págs (Médio)</span>
            <span>{maxAllowedPages} págs (Completo - Limite do Plano)</span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={onNext}
            disabled={!isFormValid}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
              isFormValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:scale-[1.01]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            Avançar para Diagramação
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      {showSuggestionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Ideias de Títulos Geradas pela IA
              </h3>
              <button
                onClick={() => setShowSuggestionsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 mb-6">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSuggestion(s.title, s.subtitle)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 cursor-pointer transition-all text-left"
                >
                  <p className="font-bold text-slate-900 text-sm">{s.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{s.subtitle}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowSuggestionsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 font-semibold text-xs text-slate-700 hover:bg-slate-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
