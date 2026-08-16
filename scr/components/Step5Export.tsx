import React, { useState } from 'react';
import { Ebook } from '../types';
import { Download, CheckCircle2, ArrowLeft, Loader2, FolderPlus, Eye, BookOpen, FileText, Sparkles, Printer } from 'lucide-react';
import { EbookPageCanvas } from './EbookPageCanvas';
import { generateAndDownloadPdf, printVectorPdf } from '../utils/pdfExport';

interface Step5ExportProps {
  ebook: Ebook;
  onBackToEditor: () => void;
  onSaveToLibrary: () => void;
  isReadOnly?: boolean;
}

export const Step5Export: React.FC<Step5ExportProps> = ({
  ebook,
  onBackToEditor,
  onSaveToLibrary,
  isReadOnly = false,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const [previewPageIndex, setPreviewPageIndex] = useState(0);

  const handleExportPDF = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setPdfProgress(5);
    setPdfSuccess(false);

    try {
      const ok = await generateAndDownloadPdf(ebook, 'export-pdf-page-', (pct) => {
        setPdfProgress(pct);
      });
      if (ok) {
        setPdfSuccess(true);
      } else {
        alert('Ocorreu um erro ao gerar o arquivo PDF. Tente novamente.');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Ocorreu um erro ao gerar o PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const is169 = ebook.aspectRatio === '16:9';
  const is45 = ebook.aspectRatio === '4:5';
  const containerWidth = is169 ? 1123 : 794;
  const containerHeight = is169 ? 632 : is45 ? 992 : 1123;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Offscreen Container: Ready for High-Resolution PDF Snapshot Generation */}
      <div
        id="ebook-print-root"
        className="fixed top-0 -left-[9999px] pointer-events-none opacity-0 z-[-9999] print:static print:opacity-100 print:left-0 print:block"
        style={{
          width: `${containerWidth}px`,
          minWidth: `${containerWidth}px`,
          maxWidth: `${containerWidth}px`,
          boxSizing: 'border-box',
        }}
      >
        {ebook.pages.map((page, idx) => (
          <div
            key={page.id || idx}
            id={`export-pdf-page-${idx}`}
            className="ebook-page shrink-0 overflow-hidden"
            style={{
              width: `${containerWidth}px`,
              height: `${containerHeight}px`,
              minWidth: `${containerWidth}px`,
              maxWidth: `${containerWidth}px`,
              minHeight: `${containerHeight}px`,
              maxHeight: `${containerHeight}px`,
              boxSizing: 'border-box',
            }}
          >
            <EbookPageCanvas ebook={ebook} page={page} isPdfExport={true} />
          </div>
        ))}
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-lg text-center relative overflow-hidden app-screen-content">
        {/* Decorative Top Accent */}
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
          <FileText className="w-6 h-6" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> E-book Concluído & Diagramado
        </span>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Baixar E-book em PDF
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          "<strong>{ebook.title}</strong>" • {ebook.pages.length} páginas no formato padrão A4 com diagramação preservada.
        </p>

        {/* Ebook Summary Card */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-14 rounded-md shadow-xs flex items-center justify-center text-white font-extrabold text-[11px] shrink-0"
              style={{ backgroundColor: ebook.primaryColor || '#2563EB' }}
            >
              PDF
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-xs line-clamp-1">{ebook.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Autor: {ebook.author} • {ebook.pages.length} Páginas • Formato A4 (210 × 297 mm)
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200/80 shrink-0">
            Formato Editorial A4
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 max-w-md mx-auto">
          {/* Main Primary Button: Baixar ebook em PDF */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="w-full py-3.5 px-5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-600/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isExportingPdf ? (
              <div className="flex items-center gap-2 py-0.5">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Baixando ebook em PDF ({pdfProgress}%)...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Baixar ebook em PDF</span>
              </div>
            )}
          </button>

          {pdfSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl animate-fadeIn flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Download do E-book em PDF concluído com sucesso!
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={onSaveToLibrary}
              className="py-2.5 px-3 rounded-lg font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
              Salvar na Biblioteca
            </button>

            {!isReadOnly && (
              <button
                onClick={onBackToEditor}
                className="py-2.5 px-3 rounded-lg font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                Voltar ao Editor
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-left">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              Visualização das Páginas do E-book
            </h3>
            <span className="text-[11px] text-slate-500">
              Página {previewPageIndex + 1} de {ebook.pages.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Thumbnail Navigation */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {ebook.pages.map((p, idx) => (
                <button
                  key={p.id || idx}
                  onClick={() => setPreviewPageIndex(idx)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                    previewPageIndex === idx
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="line-clamp-1">{p.title}</span>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-2">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Preview Box */}
            <div className="md:col-span-2 bg-slate-100 p-4 rounded-xl border border-slate-200 flex justify-center items-center">
              <EbookPageCanvas ebook={ebook} page={ebook.pages[previewPageIndex]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
