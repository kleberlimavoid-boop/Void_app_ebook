import React, { useState } from 'react';
import { EbookInput, LayoutTemplate, UserAccount, isProUser } from '../types';
import { DIAGRAMATION_TEMPLATES, FONT_OPTIONS } from '../data/templates';
import { CustomSelect, SelectOption } from './CustomSelect';
import {
  ArrowLeft,
  Palette,
  Type,
  Check,
  Sparkles,
  User,
  Crown,
  Globe,
  Lock,
  Layout,
  Maximize2,
  Smartphone,
  FileText,
} from 'lucide-react';

const FONT_SELECT_OPTIONS: SelectOption[] = FONT_OPTIONS.map((f) => ({
  value: f.value,
  label: f.name,
  category: f.category,
  fontFamily: f.value,
}));

const LANGUAGE_SELECT_OPTIONS: SelectOption[] = [
  { value: 'Português', label: 'Português' },
  { value: 'Inglês', label: 'Inglês (English)' },
  { value: 'Espanhol', label: 'Espanhol (Español)' },
  { value: 'Francês', label: 'Francês (Français)' },
  { value: 'Mandarim (Chinês)', label: 'Mandarim (Chinês / 中文)' },
  { value: 'Japonês', label: 'Japonês (日本語)' },
];

interface Step2DesignProps {
  input: EbookInput;
  onChange: (updated: Partial<EbookInput>) => void;
  onBack: () => void;
  onGenerate: () => void;
  user?: UserAccount;
  onOpenUpgradeModal?: () => void;
}

export const Step2Design: React.FC<Step2DesignProps> = ({
  input,
  onChange,
  onBack,
  onGenerate,
  user,
  onOpenUpgradeModal,
}) => {
  const isPro = isProUser(user?.plan);
  const selectedTemplate =
    DIAGRAMATION_TEMPLATES.find((t) => t.id === input.template) ||
    DIAGRAMATION_TEMPLATES[0];

  const [activeTab, setActiveTab] = useState<'basico' | 'pro'>(() => {
    return selectedTemplate.tier === 'pro' ? 'pro' : 'basico';
  });

  const displayedTemplates = DIAGRAMATION_TEMPLATES.filter(
    (t) => (t.tier || 'basico') === activeTab
  );

  const handleSelectTemplate = (templateId: LayoutTemplate) => {
    const t = DIAGRAMATION_TEMPLATES.find((item) => item.id === templateId);
    if (!t) return;

    if (t.tier === 'pro' && !isPro) {
      if (onOpenUpgradeModal) {
        onOpenUpgradeModal();
      } else {
        alert(
          'Esta pré-definição de diagramação é exclusiva dos Planos PRO / Pro+ Anual. Faça o upgrade para utilizar!'
        );
      }
      return;
    }

    onChange({
      template: templateId,
      primaryColor: t.primaryColor,
      accentColor: t.accentColor,
      fontHeading: t.fontHeading,
      fontBody: t.fontBody,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Banner */}
      <div className="mb-8 text-center sm:text-left bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent p-6 rounded-2xl border border-purple-100">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
          <Palette className="w-3.5 h-3.5" /> Etapa 2 de 4
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Modelos de Diagramação & Estilo Visual
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Escolha um modelo pré-definido e visualize miniaturas em tempo real do perfil de cada diagrama para deixar seu e-book com acabamento editorial.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-7 space-y-8">
          {/* Templates Section - Visual Miniatures Grid with Tabs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  1. Selecione a Pré-definição de Diagramação
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Navegue pelas abinhas Básico e PRO para ver as opções.
                </p>
              </div>

              {/* Tabs Bar: Básico vs PRO */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setActiveTab('basico')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === 'basico'
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Básico</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700 text-[10px]">
                    6
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pro')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === 'pro'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50/60'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>PRO</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                      activeTab === 'pro'
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    6 Novas
                  </span>
                </button>
              </div>
            </div>

            {/* Info Notice when viewing PRO tab */}
            {activeTab === 'pro' && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pré-definições Ultra Profissionais (PRO):</span>
                  <span className="ml-1 text-amber-800">
                    Sua conta permite visualizar e explorar todas as 6 opções de altíssimo nível. {!isPro && 'Faça upgrade para os Planos PRO ou Pro+ Anual para aplicar e utilizar no e-book.'}
                  </span>
                </div>
              </div>
            )}

            {/* Grid of Templates for Active Tab */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedTemplates.map((tmpl) => {
                const isSelected = input.template === tmpl.id;
                const isProTemplate = tmpl.tier === 'pro';
                const isLocked = isProTemplate && !isPro;

                return (
                  <button
                    type="button"
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between group overflow-hidden ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/30 shadow-md'
                        : isProTemplate
                        ? 'border-amber-200 hover:border-amber-400 bg-gradient-to-br from-amber-50/20 via-white to-white hover:shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    {/* Card Top Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="pr-2 min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block group-hover:text-blue-700 transition-colors truncate">
                          {tmpl.name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 block truncate">
                          {tmpl.tagline}
                        </span>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : isLocked ? (
                        <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-amber-700" /> PRO
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md shrink-0">
                          {tmpl.badgeText}
                        </span>
                      )}
                    </div>

                    {/* Miniature Canvas Previews */}
                    <div
                      className="w-full h-36 rounded-xl border p-2.5 flex flex-col justify-between my-2 relative overflow-hidden transition-all shadow-2xs"
                      style={{
                        backgroundColor: tmpl.bgTone || '#FFFFFF',
                        borderColor: '#E2E8F0',
                      }}
                    >
                      {/* 1. Editorial Template */}
                      {tmpl.id === 'editorial' && (
                        <>
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200 text-[8px] text-slate-400 font-semibold uppercase">
                            <span>E-book • Cap. 1</span>
                            <span style={{ color: tmpl.primaryColor }} className="font-bold">Pág. 01</span>
                          </div>
                          <div className="my-auto space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1 h-3 rounded-full shrink-0" style={{ backgroundColor: tmpl.accentColor }} />
                              <div className="font-extrabold text-[10px]" style={{ fontFamily: tmpl.fontHeading, color: tmpl.primaryColor }}>
                                Estratégia Editorial
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-1 bg-slate-200 rounded-full w-full" />
                              <div className="h-1 bg-slate-200 rounded-full w-5/6" />
                            </div>
                            <div className="p-1 rounded bg-blue-50/80 border-l-2 border-blue-600 text-[7px] text-blue-900 font-medium italic truncate">
                              "Conhecimento com estrutura editorial."
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[7px] text-slate-400">
                            <span>Seção 01</span>
                            <span style={{ color: tmpl.primaryColor }} className="font-extrabold">VOID</span>
                          </div>
                        </>
                      )}

                      {/* 2. Minimalist Template */}
                      {tmpl.id === 'minimalist' && (
                        <>
                          <div className="text-center pb-1 text-[7px] tracking-widest text-zinc-400 uppercase font-serif">
                            — I N T R O D U Ç Ã O —
                          </div>
                          <div className="my-auto text-center px-1 space-y-1.5">
                            <div className="font-serif italic font-normal text-[11px]" style={{ color: tmpl.primaryColor }}>
                              A Arte do Essencial
                            </div>
                            <div className="space-y-1 max-w-[140px] mx-auto">
                              <div className="h-0.5 bg-zinc-300 rounded-full w-full" />
                              <div className="h-0.5 bg-zinc-300 rounded-full w-3/4 mx-auto" />
                            </div>
                            <div className="text-[7px] font-serif italic text-zinc-500 pt-1">
                              Sem ruídos, apenas clareza e ritmo de leitura.
                            </div>
                          </div>
                          <div className="text-center pt-1 text-[7px] text-zinc-400 font-serif">
                            1
                          </div>
                        </>
                      )}

                      {/* 3. Creative Template */}
                      {tmpl.id === 'creative' && (
                        <>
                          <div className="flex items-center justify-between p-1 rounded-md bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[8px] font-black tracking-wide">
                            <span>IDEIA CRIATIVA</span>
                            <span className="bg-white/20 px-1 rounded text-[7px]">PRO</span>
                          </div>
                          <div className="my-auto space-y-1.5">
                            <div className="font-black text-[11px] text-purple-900 leading-tight">
                              Pensamento Fora da Caixa
                            </div>
                            <div className="flex gap-1">
                              <div className="w-2/3 space-y-1">
                                <div className="h-1 bg-purple-200 rounded-full w-full" />
                                <div className="h-1 bg-purple-200 rounded-full w-4/5" />
                              </div>
                              <div className="w-1/3 bg-pink-100 rounded-md p-1 flex items-center justify-center text-[7px] font-bold text-pink-700">
                                Destaque
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end pt-1 border-t border-purple-100 text-[7px] font-extrabold text-purple-600">
                            Pág. 03
                          </div>
                        </>
                      )}

                      {/* 4. Corporate Template */}
                      {tmpl.id === 'corporate' && (
                        <>
                          <div className="bg-slate-900 text-white p-1 rounded flex items-center justify-between text-[7px] font-bold uppercase tracking-wider">
                            <span>Relatório de Impacto</span>
                            <span className="text-sky-400">B2B</span>
                          </div>
                          <div className="my-auto space-y-1">
                            <div className="font-mono text-[9px] font-bold text-slate-900 uppercase">
                              // 01. Metodologia Executiva
                            </div>
                            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-[7px]">
                              <div className="font-bold text-slate-700">Meta: 100%</div>
                              <div className="text-sky-700 font-semibold text-right">Escala OKR</div>
                            </div>
                            <div className="h-1 bg-slate-300 rounded-full w-full" />
                          </div>
                          <div className="flex items-center justify-between text-[7px] font-bold text-slate-400 border-t border-slate-200 pt-1">
                            <span>CONFIDENCIAL</span>
                            <span>PÁG. 04</span>
                          </div>
                        </>
                      )}

                      {/* 5. Warm / Sereno Template */}
                      {tmpl.id === 'warm' && (
                        <>
                          <div className="flex items-center gap-1 pb-1 border-b border-amber-200/60 text-[8px] font-semibold text-emerald-800">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>Harmonia & Equilíbrio</span>
                          </div>
                          <div className="my-auto p-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 space-y-1">
                            <div className="font-serif font-bold text-[10px] text-emerald-900">
                              Hábitos de Bem-Estar
                            </div>
                            <div className="text-[7px] text-amber-900 italic">
                              Rituais diários para clareza mental e serenidade.
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 text-[7px] font-medium text-emerald-700">
                            <span>Capítulo 05</span>
                            <span className="font-bold">Pág. 05</span>
                          </div>
                        </>
                      )}

                      {/* 6. Pastel Soft Template */}
                      {tmpl.id === 'pastel' && (
                        <>
                          <div className="flex items-center justify-between text-[8px] font-bold text-teal-800">
                            <span className="bg-teal-100 px-1.5 py-0.5 rounded-full">Manual Prático</span>
                            <span className="text-rose-500">Passo 1</span>
                          </div>
                          <div className="my-auto space-y-1">
                            <div className="font-bold text-[10px] text-teal-900">
                              Aprendizado Descomplicado
                            </div>
                            <div className="space-y-1 p-1 bg-white rounded-md border border-teal-100 text-[7px]">
                              <div className="h-1 bg-teal-100 rounded-full w-full" />
                              <div className="h-1 bg-rose-100 rounded-full w-2/3" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-teal-100 text-[7px] text-teal-600 font-semibold">
                            <span>Guia de Estudos</span>
                            <span>Pág. 06</span>
                          </div>
                        </>
                      )}

                      {/* PRO 1. Noir Luxury & Ouro */}
                      {tmpl.id === 'pro_luxury' && (
                        <>
                          <div className="flex items-center justify-between pb-1 border-b border-amber-500/30 text-[8px] text-amber-400 font-bold uppercase tracking-wider">
                            <span>NOIR LUXURY</span>
                            <span className="text-amber-300 font-extrabold flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5" /> VIP
                            </span>
                          </div>
                          <div className="my-auto text-center space-y-1 py-1">
                            <div className="font-serif text-[11px] font-black text-amber-300 tracking-wide">
                              ALTA GASTRONOMIA & LUXO
                            </div>
                            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent w-3/4 mx-auto" />
                            <div className="text-[7px] text-slate-300 font-serif italic">
                              "Elegância extrema com acabamento em ouro."
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-amber-500/30 text-[7px] text-amber-400/80">
                            <span>EDIÇÃO EXCLUSIVA</span>
                            <span className="font-bold text-amber-300">Pág. 01</span>
                          </div>
                        </>
                      )}

                      {/* PRO 2. Vogue & Editorial Ouro */}
                      {tmpl.id === 'pro_editorial_gold' && (
                        <>
                          <div className="flex items-center justify-between pb-1 border-b border-stone-300 text-[8px] text-stone-600 font-bold uppercase tracking-widest font-serif">
                            <span>VOGUE EDITORIAL</span>
                            <span className="text-amber-800 font-extrabold">VOL. 01</span>
                          </div>
                          <div className="my-auto space-y-1">
                            <div className="font-serif italic font-bold text-[11px] text-stone-900 leading-tight">
                              ARQUITETURA & DESIGN
                            </div>
                            <div className="p-1.5 rounded bg-amber-50/80 border-l-2 border-amber-700 text-[7px] text-amber-900 font-serif italic">
                              "Refinamento estético das grandes publicações."
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-[7px] text-stone-500 font-serif">
                            <span>E-BOOK EXECUTIVO</span>
                            <span className="font-bold text-stone-800">Pág. 02</span>
                          </div>
                        </>
                      )}

                      {/* PRO 3. Cyber Tech & Neon */}
                      {tmpl.id === 'pro_tech_dark' && (
                        <>
                          <div className="flex items-center justify-between p-1 rounded bg-slate-900 border border-cyan-500/40 text-[7px] font-mono font-bold text-cyan-400">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> // CYBER IA & TECH
                            </span>
                            <span className="text-emerald-400">ONLINE</span>
                          </div>
                          <div className="my-auto space-y-1 p-1 bg-slate-900/90 rounded border border-cyan-900 text-[7px]">
                            <div className="font-mono font-bold text-[10px] text-cyan-300">
                              ALGORITMOS & FUTURO
                            </div>
                            <div className="h-1 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full w-full" />
                          </div>
                          <div className="flex items-center justify-between text-[7px] font-mono text-slate-400 pt-0.5">
                            <span>SYS.V2.0</span>
                            <span className="text-cyan-400 font-bold">PÁG. 03</span>
                          </div>
                        </>
                      )}

                      {/* PRO 4. Nordic Zen & Sage */}
                      {tmpl.id === 'pro_nordic' && (
                        <>
                          <div className="flex items-center justify-between pb-1 border-b border-emerald-200 text-[8px] text-emerald-800 font-bold tracking-wider">
                            <span>NORDIC ZEN & SAGE</span>
                            <span className="bg-emerald-100 text-emerald-800 px-1 rounded text-[7px]">PRO</span>
                          </div>
                          <div className="my-auto space-y-1">
                            <div className="font-bold text-[10px] text-emerald-950">
                              PRODUTIVIDADE ORGÂNICA
                            </div>
                            <div className="p-1 bg-white rounded-lg border border-emerald-100 text-[7px] text-emerald-900 shadow-2xs">
                              Tons de sálvia e harmonia escandinava.
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-emerald-200 text-[7px] text-emerald-700 font-semibold">
                            <span>MENTALIDADE</span>
                            <span>Pág. 04</span>
                          </div>
                        </>
                      )}

                      {/* PRO 5. Revista Contemporânea */}
                      {tmpl.id === 'pro_magazine' && (
                        <>
                          <div className="bg-red-600 text-white p-1 rounded-md flex items-center justify-between text-[8px] font-black uppercase tracking-wide">
                            <span>REVISTA IMPACTO</span>
                            <span className="bg-white text-red-700 px-1 rounded text-[7px]">NOVO</span>
                          </div>
                          <div className="my-auto space-y-1">
                            <div className="font-black text-[11px] text-red-950 leading-tight">
                              LANÇAMENTOS & MÍDIA
                            </div>
                            <div className="p-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded text-[7px] font-extrabold text-center shadow-2xs">
                              ALTA CONVERSÃO
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-red-200 text-[7px] font-black text-red-600">
                            <span>SÉRIE ESPECIAL</span>
                            <span>Pág. 05</span>
                          </div>
                        </>
                      )}

                      {/* PRO 6. Royal Navy & Champagne */}
                      {tmpl.id === 'pro_royal_navy' && (
                        <>
                          <div className="bg-blue-900 text-white p-1 rounded flex items-center justify-between text-[7px] font-extrabold uppercase tracking-widest border border-blue-700">
                            <span>ROYAL NAVY</span>
                            <span className="text-amber-400 font-bold">EXECUTIVE</span>
                          </div>
                          <div className="my-auto space-y-1 p-1 bg-white rounded border border-blue-200 shadow-2xs">
                            <div className="font-serif font-extrabold text-[10px] text-blue-950">
                              AUTORIDADE CORPORATIVA
                            </div>
                            <div className="h-1 bg-amber-500 rounded-full w-full" />
                          </div>
                          <div className="flex items-center justify-between text-[7px] font-bold text-blue-900 border-t border-blue-100 pt-1">
                            <span>CONSULTORIA B2B</span>
                            <span className="text-amber-600 font-extrabold">Pág. 06</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Typography Tag */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-1">
                      <span className="truncate">
                        {tmpl.fontHeading.split(' ')[0]} + {tmpl.fontBody.split(' ')[0]}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <div
                          className="w-3 h-3 rounded-full border border-black/10"
                          style={{ backgroundColor: tmpl.primaryColor }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-black/10"
                          style={{ backgroundColor: tmpl.accentColor }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Depth Selection Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  2. Nível de Profundidade do Conteúdo
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Escolha o nível de densidade dos argumentos e textos gerados em cada capítulo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Option 1: Standard / Resumido */}
              <button
                type="button"
                onClick={() => onChange({ contentDepth: 'standard' })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  input.contentDepth === 'standard' || !input.contentDepth
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900">Conteúdo Direto & Resumido</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                      Plano Básico
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Texto objetivo, focado em conceitos rápidos, pontos-chave e leitura simplificada.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Densidade padrão</span>
                  {input.contentDepth === 'standard' || !input.contentDepth ? (
                    <span className="text-blue-700 font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ativo
                    </span>
                  ) : null}
                </div>
              </button>

              {/* Option 2: Deep / Profundo (PRO) */}
              <button
                type="button"
                onClick={() => {
                  if (isPro) {
                    onChange({ contentDepth: 'deep' });
                  } else if (onOpenUpgradeModal) {
                    onOpenUpgradeModal();
                  }
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                  input.contentDepth === 'deep' && isPro
                    ? 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-600/30 shadow-xs'
                    : 'border-purple-200/80 bg-gradient-to-br from-purple-50/30 via-indigo-50/20 to-white hover:border-purple-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      Conteúdo Profundo & Argumentado
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black shadow-2xs">
                      PRO 👑
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Textos completos com argumentos aprofundados, exemplos práticos e explicações ricas detalhadas.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-purple-200/60 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-purple-900">Alta densidade textual</span>
                  {input.contentDepth === 'deep' && isPro ? (
                    <span className="text-purple-700 font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ativo
                    </span>
                  ) : (
                    <span className="text-amber-600 font-extrabold flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" /> Desbloquear
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Visual Illustrations & Native Charts Selection Card (PRO Exclusive) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  3. Ilustrações com Gráficos Visuais & Infográficos
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Defina se a IA deve enriquecer os capítulos do e-book com ilustrações conceituais, métricas e infográficos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Option 1: Standard (Texto e diagramação editorial limpa) */}
              <button
                type="button"
                onClick={() => onChange({ useAiIllustrations: false, useNativeCharts: false })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  !input.useAiIllustrations && !input.useNativeCharts
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900">Apenas Texto & Diagramação</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                      Padrão Editorial
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Estrutura editorial limpa e direta com foco estrito em leitura textual, parágrafos, listas e citações.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Sem gráficos pesados</span>
                  {!input.useAiIllustrations && !input.useNativeCharts ? (
                    <span className="text-blue-700 font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ativo
                    </span>
                  ) : null}
                </div>
              </button>

              {/* Option 2: Visual Graphics & Charts (PRO) */}
              <button
                type="button"
                onClick={() => {
                  if (isPro) {
                    onChange({ useAiIllustrations: true, useNativeCharts: true });
                  } else if (onOpenUpgradeModal) {
                    onOpenUpgradeModal();
                  }
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                  (input.useAiIllustrations || input.useNativeCharts) && isPro
                    ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/30 shadow-xs'
                    : 'border-amber-200/80 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      Ilustrações com Gráficos Visuais
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black shadow-2xs">
                      PLANO PRO 👑
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gera ilustrações contextuais em alta definição, gráficos de barras percentuais, KPIs, tabelas e roadmaps.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-amber-900">Visual de alto impacto</span>
                  {(input.useAiIllustrations || input.useNativeCharts) && isPro ? (
                    <span className="text-amber-700 font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ativo
                    </span>
                  ) : (
                    <span className="text-amber-600 font-extrabold flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" /> Desbloquear no PRO
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Typography & Author Customization */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            {/* Author Name */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                4. Nome do Autor / Marca
              </label>
              <input
                type="text"
                value={input.author}
                onChange={(e) => onChange({ author: e.target.value })}
                placeholder="Ex: Dra. Juliana Ramos ou Editora Digital"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-xs font-medium outline-hidden"
              />
            </div>

            {/* Font Options */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                Tipografia (Fontes)
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Fonte dos Títulos
                  </label>
                  <CustomSelect
                    value={input.fontHeading}
                    onChange={(val) => onChange({ fontHeading: val })}
                    options={FONT_SELECT_OPTIONS}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Fonte do Texto
                  </label>
                  <CustomSelect
                    value={input.fontBody}
                    onChange={(val) => onChange({ fontBody: val })}
                    options={FONT_SELECT_OPTIONS}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Aspect Ratio / Format Selection Card (Standard A4 Only) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-600" />
                5. Formato & Dimensões do E-book
              </label>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                Padrão Editorial A4
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Formato internacional padrão A4 (210 × 297 mm) otimizado para leitura digital em smartphones, tablets, computadores e impressão de alta fidelidade.
            </p>

            <div className="p-3.5 rounded-xl border border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Formato A4 Retrato (210 × 297 mm)</div>
                  <div className="text-[11px] text-slate-500 font-medium">Exportação nativa em PDF de Ultra Resolução (HD)</div>
                </div>
              </div>
              <span className="text-blue-700 font-extrabold text-xs flex items-center gap-1">
                <Check className="w-4 h-4" /> Ativo
              </span>
            </div>
          </div>

          {/* Language Selection Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              6. Idioma do E-book
            </label>
            <p className="text-xs text-slate-500">
              Selecione em qual idioma a Inteligência Artificial deverá gerar todo o conteúdo e capítulos do seu e-book.
            </p>
            <CustomSelect
              value={input.language || 'Português'}
              onChange={(val) => onChange({ language: val })}
              options={LANGUAGE_SELECT_OPTIONS}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <button
              type="button"
              onClick={onGenerate}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.01] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Criar E-book com IA Agora
            </button>
          </div>
        </div>

        {/* Right Column: Live Book Cover Preview Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pré-visualização da Capa
              </span>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {selectedTemplate.name}
              </span>
            </div>

            {/* E-book Mockup Preview Card */}
            <div
              className="aspect-[3/4] rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden transition-all duration-300"
              style={{
                background: input.coverImageUrl
                  ? `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url("${input.coverImageUrl}") center/cover no-repeat`
                  : `linear-gradient(135deg, ${input.primaryColor} 0%, #1E293B 100%)`,
                fontFamily: input.fontHeading,
              }}
            >
              {/* Background decorative graphic */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-25 blur-xl"
                style={{ backgroundColor: input.accentColor }}
              />

              {/* Header badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  {input.genre.toUpperCase()}
                </span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>

              {/* Center Title & Subtitle */}
              <div className="relative z-10 my-auto text-center px-2">
                <h3 className="text-xl sm:text-2xl font-extrabold leading-tight text-white drop-shadow-xs">
                  {input.title || 'Título do seu E-book'}
                </h3>
                {input.subtitle && (
                  <p className="mt-2 text-xs font-medium text-white/80 leading-relaxed max-w-xs mx-auto">
                    {input.subtitle}
                  </p>
                )}
                <div
                  className="w-12 h-1 mx-auto my-4 rounded-full"
                  style={{ backgroundColor: input.accentColor }}
                />
              </div>

              {/* Footer Author & Page Count */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-white/90 border-t border-white/15 pt-3">
                <span>Por {input.author || 'Autor Especialista'}</span>
                <span>{input.pageCount} Páginas</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-4">
              O layout e a tipografia escolhidos serão aplicados com harmonia a todas as páginas do e-book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
