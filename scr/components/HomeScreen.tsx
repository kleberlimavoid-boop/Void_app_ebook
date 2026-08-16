import React, { useState } from 'react';
import { UserAccount, Ebook, isProUser } from '../types';
import {
  Sparkles,
  Download,
  Eye,
  Trash2,
  BookOpen,
  Folder,
  Loader2,
  User,
  Crown,
  UserCheck,
  MessageCircle,
  ExternalLink,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';
import { ImageLibraryModal } from './ImageLibraryModal';
import { FAQSection } from './FAQSection';

interface HomeScreenProps {
  user: UserAccount;
  ebooks: Ebook[];
  onStartNewEbook: () => void;
  onOpenEbook: (ebook: Ebook) => void;
  onDownloadPdfDirectly: (ebook: Ebook) => Promise<void>;
  onDeleteEbook: (id: string) => void;
  onOpenProfile: () => void;
  onOpenPlans: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  ebooks,
  onStartNewEbook,
  onOpenEbook,
  onDownloadPdfDirectly,
  onDeleteEbook,
  onOpenProfile,
  onOpenPlans,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [ebookToDelete, setEbookToDelete] = useState<Ebook | null>(null);
  const [showImageLibrary, setShowImageLibrary] = useState<boolean>(false);

  // Extract first name or full name for personalized greeting
  const displayName = user.name ? user.name.trim() : 'Criador';
  const isPro = isProUser(user.plan);
  const isAnnual = user.plan === 'pro_annual' || user.plan === 'pro_plus' || user.plan === 'premium';

  // Handle direct download click
  const handleDownload = async (ebook: Ebook) => {
    setDownloadingId(ebook.id);
    try {
      await onDownloadPdfDirectly(ebook);
    } catch (err) {
      console.error('Erro ao baixar e-book:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (ebookToDelete) {
      onDeleteEbook(ebookToDelete.id);
      setEbookToDelete(null);
    }
  };

  // WhatsApp VIP Group URL requested by user
  const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/GPzdMpKv33wFRVEZ4HACaF?s=cl&p=a&ilr=0';

  const handleOpenWhatsAppGroup = () => {
    window.open(WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 pb-20 animate-fadeIn font-sans">
      {/* Top Header with Clean "Olá, [nome do usuário]" */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Olá, {displayName}
          </h1>
        </div>

        {/* Top Right Quick Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPlans}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer ${
              isAnnual
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : isPro
                ? 'border-purple-200 bg-purple-50 text-purple-900'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            {isAnnual ? (
              <span className="flex items-center gap-1 text-amber-900 font-extrabold">
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                <span className="hidden sm:inline">Pro+ Anual (VIP)</span>
              </span>
            ) : isPro ? (
              <span className="flex items-center gap-1 text-purple-900 font-bold">
                <Crown className="w-3.5 h-3.5 text-purple-600 fill-purple-500" />
                <span className="hidden sm:inline">Plano Pro</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-700">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Plano Básico</span>
              </span>
            )}
          </button>

          <button
            onClick={onOpenProfile}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-full transition-colors text-slate-700 shadow-2xs cursor-pointer"
            title="Ver Meu Perfil"
          >
            <User className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* HERO / CENTER ACTION BUTTON SECTION */}
        <section className="text-center py-6 sm:py-10 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/80 p-8 shadow-sm relative overflow-hidden">
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Gerador de E-books com IA</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Pronto para transformar suas ideias em um e-book profissional?
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Crie estruturas completas, textos enriquecidos e diagramação impecável pronta para baixar em PDF.
            </p>

            {/* MAIN CENTER GRADIENT ANIMATED BUTTON */}
            <div className="pt-2">
              <button
                onClick={onStartNewEbook}
                className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 text-white font-black text-base sm:lg rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 animate-blue-glow border border-blue-400/40"
              >
                {/* Floating soft glowing patches inside the button */}
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-xl pointer-events-none animate-patch-1 bg-cyan-400/40" />
                <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full blur-xl pointer-events-none animate-patch-2 bg-indigo-300/40" />

                <div className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-xs group-hover:rotate-12 transition-transform border bg-white/20 text-white border-white/20">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="relative z-10 font-black">
                  Criar Novo E-book
                </span>
                <Sparkles className="relative z-10 w-5 h-5 animate-pulse text-amber-300" />
              </button>
            </div>
          </div>
        </section>

        {/* LIBRARY WINDOW SECTION */}
        <section className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 relative">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center font-bold">
                <Folder className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                  Sua Biblioteca de E-books
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Seus e-books gerados ficam salvos com acesso rápido para baixar em PDF
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
              {ebooks.length} {ebooks.length === 1 ? 'E-book' : 'E-books'}
            </span>
          </div>

          {/* E-books List Container (Limited to 3 visible items with smooth scrolling) */}
          {ebooks.length === 0 ? (
            <div className="py-10 text-center text-slate-400 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-slate-700 text-sm">
                  Nenhum e-book criado ainda
                </p>
                <p className="text-xs text-slate-400 mt-0.5 max-w-sm mx-auto">
                  Clique no botão "Criar Agora" acima para gerar seu primeiro e-book completo com Inteligência Artificial!
                </p>
              </div>
              <button
                onClick={onStartNewEbook}
                className="mt-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Criar Meu Primeiro E-book
              </button>
            </div>
          ) : (
            <div className="max-h-[290px] overflow-y-auto pr-1.5 space-y-2.5 rounded-2xl">
              {ebooks.map((eb) => (
                <div
                  key={eb.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Cover Badge */}
                    <div
                      className="w-10 h-14 rounded-lg shadow-xs flex items-center justify-center text-white text-[10px] font-black tracking-widest text-center px-1 shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: eb.primaryColor || '#2563EB' }}
                    >
                      PDF
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate leading-snug">
                        {eb.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
                        <span>{eb.pages?.length || 0} páginas</span>
                        <span>•</span>
                        <span className="capitalize">{eb.genre || 'Geral'}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">Salvo</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDownload(eb)}
                      disabled={downloadingId === eb.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                      title="Baixar PDF diretamente do e-book"
                    >
                      {downloadingId === eb.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="hidden sm:inline">Baixando...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar PDF</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenEbook(eb)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                      title="Visualizar e Abrir E-book"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setEbookToDelete(eb)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir E-book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VIP WHATSAPP GROUP COMMUNITY BUTTON SECTION */}
        <section className="pt-2">
          <div
            onClick={handleOpenWhatsAppGroup}
            className="group relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-600/20 border border-emerald-400/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
          >
            {/* Subtle glow background */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

            <div className="flex items-center gap-4 sm:gap-5 text-left relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-white fill-white/20" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-200 bg-black/20 px-2.5 py-0.5 rounded-full mb-1">
                  <span>Comunidade Exclusiva & Networking</span>
                </div>
                <h3 className="font-black text-lg sm:text-2xl text-white tracking-tight">
                  Entre no Grupo VIP de Criadores (WhatsApp)
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1 max-w-xl">
                  Junte-se ao nosso grupo exclusivo para trocar ideias, tirar dúvidas, fazer networking de alto nível e dê vida as suas ideias com outros criadores!
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 bg-white text-emerald-800 font-black text-sm rounded-xl shadow-md group-hover:bg-emerald-50 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer">
                <span>Participar Agora</span>
                <ExternalLink className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </div>
        </section>

        {/* FAQ (PERGUNTAS FREQUENTES) SECTION */}
        <FAQSection />

        {/* Discreet Image Library button at the bottom */}
        <div className="pt-4 pb-4 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowImageLibrary(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 text-xs font-semibold border border-slate-200 transition-all cursor-pointer shadow-2xs group"
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span>Biblioteca de imagens</span>
          </button>
        </div>
      </div>

      {/* Image Library Modal */}
      <ImageLibraryModal
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
      />

      {/* Confirmation Modal for Deleting E-book */}
      {ebookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Excluir E-book?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tem certeza que deseja excluir "<span className="font-semibold text-slate-700">{ebookToDelete.title}</span>"? Esta ação não poderá ser desfeita.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setEbookToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Não, cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
