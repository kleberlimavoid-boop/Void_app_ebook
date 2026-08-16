import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Image as ImageIcon,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import { VISUAL_IMAGE_LIBRARY, VisualImageItem } from '../data/visualLibrary';
import { COVER_IMAGE_LIBRARY, CoverImageItem, getCategoryName } from '../data/coverImages';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLibraryModal: React.FC<ImageLibraryModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; category: string } | null>(null);

  // Combine both visual library and cover image library to provide full access to all 500+ assets
  const allImages = useMemo(() => {
    const list: Array<{
      id: string;
      url: string;
      title: string;
      category: string;
      keywords: string[];
    }> = [];

    // From VISUAL_IMAGE_LIBRARY
    Object.entries(VISUAL_IMAGE_LIBRARY).forEach(([catKey, catObj]) => {
      catObj.images.forEach((img) => {
        list.push({
          id: `vis-${img.id}`,
          url: img.url,
          title: img.title,
          category: catObj.name,
          keywords: img.keywords || [],
        });
      });
    });

    // From COVER_IMAGE_LIBRARY
    Object.entries(COVER_IMAGE_LIBRARY).forEach(([catKey, catObj]) => {
      catObj.images.forEach((img) => {
        if (!list.some((existing) => existing.url === img.url)) {
          list.push({
            id: `cov-${img.id}`,
            url: img.url,
            title: img.title,
            category: getCategoryName(catKey),
            keywords: img.keywords || [],
          });
        }
      });
    });

    return list;
  }, []);

  // Category list
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    allImages.forEach((img) => {
      map.set(img.category, (map.get(img.category) || 0) + 1);
    });

    const items = Array.from(map.entries()).map(([name, count]) => ({
      id: name,
      label: name,
      count,
    }));

    return [
      { id: 'all', label: 'Todas as Categorias', count: allImages.length },
      ...items.sort((a, b) => b.count - a.count),
    ];
  }, [allImages]);

  // Filtered images
  const filteredImages = useMemo(() => {
    let result = allImages;

    if (selectedCategory !== 'all') {
      result = result.filter((img) => img.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (img) =>
          img.title.toLowerCase().includes(term) ||
          img.category.toLowerCase().includes(term) ||
          img.keywords.some((k) => k.toLowerCase().includes(term))
      );
    }

    return result;
  }, [allImages, selectedCategory, searchTerm]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Biblioteca de Imagens do Aplicativo
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-black">
                  {allImages.length} Fotos HD
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Acervo profissional curado de alta resolução integrado ao gerador de e-books.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por palavra-chave (ex: inteligência artificial, negócios, academia, culinária, finanças)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-hidden font-medium text-slate-800"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 font-semibold shrink-0">
              Exibindo <strong className="text-slate-900">{filteredImages.length}</strong> de{' '}
              {allImages.length}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Images Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-3 flex flex-col justify-between">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopyUrl(img.url)}
                        className="p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-blue-600 transition-colors backdrop-blur-xs cursor-pointer"
                        title="Copiar URL da Imagem"
                      >
                        {copiedUrl === img.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setPreviewImage(img)}
                        className="p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-blue-600 transition-colors backdrop-blur-xs cursor-pointer"
                        title="Visualizar em Alta Resolução"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-300 block line-clamp-1">
                        {img.category}
                      </span>
                      <p className="text-xs font-bold text-white leading-tight line-clamp-2 mt-0.5">
                        {img.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
              <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">
                Nenhuma imagem encontrada
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tente buscar com outra palavra-chave ou selecione outra categoria.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Imagens licenciadas de alta definição hospedadas via CDN Unsplash.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer"
          >
            Fechar Biblioteca
          </button>
        </div>
      </div>

      {/* Expanded Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl p-4 max-w-3xl w-full text-white space-y-3 border border-slate-800 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-400">
                  {previewImage.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {previewImage.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handleCopyUrl(previewImage.url)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedUrl === previewImage.url ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    URL Copiada!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Link Direto
                  </>
                )}
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
