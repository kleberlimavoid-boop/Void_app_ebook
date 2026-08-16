import React, { useState } from 'react';
import { Ebook } from '../types';
import { Folder, X, Trash2, Download, BookOpen, PlusCircle, Loader2, Eye, FileText } from 'lucide-react';

interface MyEbooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  ebooks: Ebook[];
  onOpenEbook: (ebook: Ebook) => void;
  onDownloadPdfDirectly: (ebook: Ebook) => Promise<void>;
  onDeleteEbook: (id: string) => void;
  onNewEbook: () => void;
}

export const MyEbooksModal: React.FC<MyEbooksModalProps> = ({
  isOpen,
  onClose,
  ebooks,
  onOpenEbook,
  onDownloadPdfDirectly,
  onDeleteEbook,
  onNewEbook,
}) => {
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);
  const [ebookToDelete, setEbookToDelete] = useState<Ebook | null>(null);

  if (!isOpen) return null;

  const handleDownloadPdf = async (e: Ebook) => {
    setDownloadingPdfId(e.id);
    try {
      await onDownloadPdfDirectly(e);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPdfId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (ebookToDelete) {
      onDeleteEbook(ebookToDelete.id);
      setEbookToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Sua Biblioteca de E-books</h3>
              <p className="text-xs text-slate-500">{ebooks.length} e-book(s) salvos na sua conta (Acesso Instantâneo)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {ebooks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-600 text-sm">Você ainda não criou nenhum e-book</p>
              <p className="text-slate-400 mt-1">Clique em "Novo E-book" para começar agora mesmo!</p>
              <button
                onClick={() => {
                  onClose();
                  onNewEbook();
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Criar Meu Primeiro E-book
              </button>
            </div>
          ) : (
            ebooks.map((e) => (
              <div
                key={e.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-14 rounded-md shadow-xs flex items-center justify-center text-white text-[10px] font-bold text-center px-1 shrink-0"
                    style={{ backgroundColor: e.primaryColor || '#2563EB' }}
                  >
                    PDF
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{e.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {e.pages?.length || 0} páginas • {e.genre || 'Geral'} • Formato A4 HD
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadPdf(e)}
                    disabled={downloadingPdfId === e.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-extrabold rounded-lg shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
                    title="Baixar PDF"
                  >
                    {downloadingPdfId === e.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Baixando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Baixar PDF
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onOpenEbook(e);
                      onClose();
                    }}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Visualizar e Editar E-book"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setEbookToDelete(e)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Excluir E-book"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal for Deleting E-book */}
      {ebookToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
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

