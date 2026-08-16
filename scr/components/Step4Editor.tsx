import React, { useState, useRef } from 'react';
import { Ebook } from '../types';
import { EbookPageCanvas } from './EbookPageCanvas';
import { CustomSelect, SelectOption } from './CustomSelect';
import { FONT_OPTIONS } from '../data/templates';
import { CoverImageSelectorModal } from './CoverImageSelectorModal';
import { reflowEbookForAspectRatio } from '../utils/pagination';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  BookOpen,
  CheckCircle2,
  Trash2,
  Type,
  Edit3,
  Palette,
  RotateCcw,
  Sparkles,
  Layout,
  Maximize2,
  Smartphone,
  FileText,
  Sliders,
  Layers,
} from 'lucide-react';

const FONT_SELECT_OPTIONS: SelectOption[] = FONT_OPTIONS.map((f) => ({
  value: f.value,
  label: f.name,
  category: f.category,
  fontFamily: f.value,
}));

interface Step4EditorProps {
  ebook: Ebook;
  onChangeEbook: (updated: Ebook) => void;
  onNextExport: () => void;
}

export const Step4Editor: React.FC<Step4EditorProps> = ({
  ebook,
  onChangeEbook,
  onNextExport,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'text_cover' | 'style_colors'>('text_cover');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPage = ebook.pages[currentPageIndex] || ebook.pages[0];

  // Handle Cover Image Upload from Device
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          onChangeEbook({ ...ebook, coverImageUrl: dataUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Cover Image
  const handleRemoveCoverImage = () => {
    onChangeEbook({ ...ebook, coverImageUrl: undefined });
  };

  // Title update handler
  const handleTitleChange = (newTitle: string) => {
    const updatedPages = ebook.pages.map((p) => {
      if (p.type === 'cover') {
        return { ...p, title: newTitle };
      }
      return p;
    });
    onChangeEbook({
      ...ebook,
      title: newTitle,
      pages: updatedPages,
    });
  };

  // Subtitle update handler
  const handleSubtitleChange = (newSubtitle: string) => {
    onChangeEbook({
      ...ebook,
      subtitle: newSubtitle,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 px-3 sm:px-6 animate-fadeIn pb-12">
      {/* Top Compact Control Bar: Title & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Editor & Leitura do E-book
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold hidden sm:inline-block">
                {ebook.pages.length} Páginas
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Altere fontes, cores, título, subtítulo e imagem da capa em tempo real.
            </p>
          </div>
        </div>

        {/* Aspect Ratio Selector & Next Step Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                const reflowed = reflowEbookForAspectRatio(ebook, 'A4');
                onChangeEbook(reflowed);
                setCurrentPageIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                (ebook.aspectRatio || 'A4') === 'A4'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              A4 (PDF)
            </button>

            <button
              type="button"
              onClick={() => {
                const reflowed = reflowEbookForAspectRatio(ebook, '16:9');
                onChangeEbook(reflowed);
                setCurrentPageIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                ebook.aspectRatio === '16:9'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              16:9
            </button>

            <button
              type="button"
              onClick={() => {
                const reflowed = reflowEbookForAspectRatio(ebook, '4:5');
                onChangeEbook(reflowed);
                setCurrentPageIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                ebook.aspectRatio === '4:5'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              4:5
            </button>
          </div>

          <button
            onClick={onNextExport}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Aprovar & Baixar PDF
          </button>
        </div>
      </div>

      {/* Page Navigation Strip */}
      <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentPageIndex === 0}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Anterior
        </button>

        {/* Thumbnails / Page Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 no-scrollbar">
          {ebook.pages.map((p, idx) => {
            const isActive = idx === currentPageIndex;
            return (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentPageIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                <span>Pág. {p.pageNumber}</span>
                <span className="text-[10px] opacity-80 max-w-[80px] truncate hidden sm:inline">
                  {p.type === 'cover' ? 'Capa' : p.type === 'toc' ? 'Sumário' : p.title}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setCurrentPageIndex((prev) => Math.min(ebook.pages.length - 1, prev + 1))}
          disabled={currentPageIndex === ebook.pages.length - 1}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
        >
          Próxima
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Layout: 2 Columns - Canvas Left & Sticky Side Editor Tools Right */}
      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* Left: Rendered Canvas Page */}
        <div className="lg:col-span-7 xl:col-span-8 flex justify-center">
          <EbookPageCanvas ebook={ebook} page={currentPage} />
        </div>

        {/* Right: Sticky Compact Toolset Panel */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          {/* Header of Tool Panel */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                {currentPage.type === 'cover' ? 'Edição da Capa & Livro' : 'Ferramentas de Estilo'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              Pág. {currentPage.pageNumber} de {ebook.pages.length}
            </span>
          </div>

          {/* Quick Tool Category Tabs (Keeps everything in viewport without long scrolling) */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('text_cover')}
              className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'text_cover'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Título & Capa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('style_colors')}
              className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'style_colors'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Fontes & Cores
            </button>
          </div>

          {/* Hidden File Input for Device Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCoverUpload}
            accept="image/*"
            className="hidden"
          />

          {/* TAB 1: Título, Subtítulo & Imagem da Capa */}
          {activeTab === 'text_cover' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Title & Subtitle Inputs */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-blue-600" />
                    Título do E-book
                  </label>
                  <input
                    type="text"
                    value={ebook.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Digite o título principal..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs font-medium text-slate-900 outline-hidden bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-blue-600" />
                    Subtítulo
                  </label>
                  <textarea
                    rows={2}
                    value={ebook.subtitle || ''}
                    onChange={(e) => handleSubtitleChange(e.target.value)}
                    placeholder="Digite o subtítulo..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs font-medium text-slate-900 outline-hidden resize-none bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Text Casing Toggles */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Caixa de Texto
                </span>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onChangeEbook({ ...ebook, titleTransform: 'uppercase' })}
                    className={`py-1 px-2 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                      ebook.titleTransform === 'uppercase'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    TÍTULO MAIÚSCULO
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEbook({ ...ebook, titleTransform: 'normal' })}
                    className={`py-1 px-2 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                      ebook.titleTransform === 'normal' || !ebook.titleTransform
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Título Normal
                  </button>
                </div>
              </div>

              {/* Cover Image Controls */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Imagem da Capa
                  </span>
                  {ebook.coverImageUrl && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Ativa
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="w-full py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Galeria (500+)
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    Do Computador
                  </button>
                </div>

                {ebook.coverImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveCoverImage}
                    className="w-full py-1.5 px-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remover Foto da Capa
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Fontes & Paleta de Cores */}
          {activeTab === 'style_colors' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Font Selection */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Type className="w-3 h-3 text-blue-600" />
                    Fonte dos Títulos
                  </label>
                  <CustomSelect
                    value={ebook.fontHeading || 'Plus Jakarta Sans'}
                    onChange={(val) => onChangeEbook({ ...ebook, fontHeading: val })}
                    options={FONT_SELECT_OPTIONS}
                    renderFontPreview={true}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Type className="w-3 h-3 text-blue-600" />
                    Fonte do Texto e Parágrafos
                  </label>
                  <CustomSelect
                    value={ebook.fontBody || 'Inter'}
                    onChange={(val) => onChangeEbook({ ...ebook, fontBody: val })}
                    options={FONT_SELECT_OPTIONS}
                    renderFontPreview={true}
                  />
                </div>
              </div>

              {/* Text Color Customization */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-blue-600" />
                    Cores dos Títulos & Texto
                  </span>
                  {(ebook.headingColor || ebook.bodyColor) && (
                    <button
                      type="button"
                      onClick={() => onChangeEbook({ ...ebook, headingColor: undefined, bodyColor: undefined })}
                      className="text-[9px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Restaurar
                    </button>
                  )}
                </div>

                {/* Heading Color Picker */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1">
                    <span>Cor dos Títulos:</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <input
                      type="color"
                      value={ebook.headingColor || '#2563EB'}
                      onChange={(e) => onChangeEbook({ ...ebook, headingColor: e.target.value })}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-200 p-0 overflow-hidden shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={ebook.headingColor || ''}
                      placeholder="Padrão do Modelo"
                      onChange={(e) => onChangeEbook({ ...ebook, headingColor: e.target.value })}
                      className="flex-1 px-2 py-1 rounded-lg border border-slate-300 text-[11px] font-mono font-bold text-slate-800 focus:border-blue-600 outline-hidden bg-white"
                    />
                  </div>

                  {/* Heading Swatches */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {[
                      { name: 'Branco', color: '#F8FAFC' },
                      { name: 'Dourado', color: '#F59E0B' },
                      { name: 'Ciano', color: '#38BDF8' },
                      { name: 'Azul', color: '#2563EB' },
                      { name: 'Verde', color: '#059669' },
                      { name: 'Grafite', color: '#0F172A' },
                    ].map((swatch) => (
                      <button
                        key={swatch.color}
                        type="button"
                        onClick={() => onChangeEbook({ ...ebook, headingColor: swatch.color })}
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs hover:scale-125 transition-all shrink-0 cursor-pointer"
                        style={{ backgroundColor: swatch.color }}
                        title={`${swatch.name} (${swatch.color})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Body Text Color Picker */}
                <div className="pt-1 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1">
                    <span>Cor do Texto:</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <input
                      type="color"
                      value={ebook.bodyColor || '#334155'}
                      onChange={(e) => onChangeEbook({ ...ebook, bodyColor: e.target.value })}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-200 p-0 overflow-hidden shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={ebook.bodyColor || ''}
                      placeholder="Padrão do Modelo"
                      onChange={(e) => onChangeEbook({ ...ebook, bodyColor: e.target.value })}
                      className="flex-1 px-2 py-1 rounded-lg border border-slate-300 text-[11px] font-mono font-bold text-slate-800 focus:border-blue-600 outline-hidden bg-white"
                    />
                  </div>

                  {/* Body Swatches */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {[
                      { name: 'Branco', color: '#FFFFFF' },
                      { name: 'Cinza Claro', color: '#CBD5E1' },
                      { name: 'Cinza Médio', color: '#64748B' },
                      { name: 'Slate Escuro', color: '#334155' },
                      { name: 'Preto', color: '#0F172A' },
                    ].map((swatch) => (
                      <button
                        key={swatch.color}
                        type="button"
                        onClick={() => onChangeEbook({ ...ebook, bodyColor: swatch.color })}
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs hover:scale-125 transition-all shrink-0 cursor-pointer"
                        style={{ backgroundColor: swatch.color }}
                        title={`${swatch.name} (${swatch.color})`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Page Info & Export Button Bottom Action */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onNextExport}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Aprovar & Baixar em PDF
            </button>
          </div>
        </div>
      </div>

      {/* Cover Background Image Selector Gallery Modal */}
      <CoverImageSelectorModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        currentCoverUrl={ebook.coverImageUrl}
        onSelectImage={(url) => {
          onChangeEbook({ ...ebook, coverImageUrl: url });
        }}
        genre={ebook.genre}
        title={ebook.title}
        description={ebook.description}
      />
    </div>
  );
};
