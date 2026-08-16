import React, { useState, useMemo } from 'react';
import {
  COVER_IMAGE_LIBRARY,
  CoverImageItem,
  getCategoryName,
  getSmartCoverImageList,
} from '../data/coverImages';
import {
  X,
  Sparkles,
  Check,
  Search,
  Image as ImageIcon,
  Shuffle,
  Filter,
} from 'lucide-react';

interface CoverImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoverUrl?: string;
  onSelectImage: (url: string) => void;
  genre?: string;
  title?: string;
  description?: string;
}

export const CoverImageSelectorModal: React.FC<CoverImageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentCoverUrl,
  onSelectImage,
  genre = '',
  title = '',
  description = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // AI-suggested smart images for this specific ebook
  const smartMatches = useMemo(() => {
    return getSmartCoverImageList(genre, title, description, 6);
  }, [genre, title, description]);

  // Available categories list
  const totalCount = useMemo(() => {
    return Object.values(COVER_IMAGE_LIBRARY).reduce((acc, cat) => acc + cat.images.length, 0);
  }, []);

  const categories = useMemo(() => {
    const keys = Object.keys(COVER_IMAGE_LIBRARY) as Array<keyof typeof COVER_IMAGE_LIBRARY>;
    return [
      { id: 'all', label: `Todas (${totalCount} Imagens)` },
      ...keys.map((k) => ({
        id: k,
        label: `${getCategoryName(k)} (${COVER_IMAGE_LIBRARY[k].images.length})`,
      })),
    ];
  }, [totalCount]);

  // Filtered image list
  const filteredImages = useMemo(() => {
    let images: CoverImageItem[] = [];

    if (selectedCategory === 'all') {
      images = Object.entries(COVER_IMAGE_LIBRARY).flatMap(([catKey, catObj]) =>
        catObj.images.map((img) => ({ ...img, category: catKey }))
      );
    } else if (selectedCategory in COVER_IMAGE_LIBRARY) {
      const catObj = COVER_IMAGE_LIBRARY[selectedCategory];
      images = catObj.images.map((img) => ({ ...img, category: selectedCategory }));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      images = images.filter(
        (img) =>
          img.title.toLowerCase().includes(term) ||
          img.keywords.some((kw) => kw.toLowerCase().includes(term))
      );
    }

    return images;
  }, [selectedCategory, searchTerm]);

  // Handle 1-click random selection from current filtered pool
  const handleRandomSelect = () => {
    if (filteredImages.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredImages.length);
    const chosen = filteredImages[randomIndex];
    onSelectImage(chosen.url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Galeria de Capas Profissionais
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-extrabold">
                  {totalCount} Imagens Únicas
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Clique em qualquer imagem para aplicar instantaneamente como plano de fundo da capa do seu e-book.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* AI Recommended Section */}
          {smartMatches.length > 0 && !searchTerm && selectedCategory === 'all' && (
            <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 p-4 rounded-xl border border-blue-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Recomendadas para seu tema ({title ? `"${title.slice(0, 30)}..."` : 'E-book'})
                </span>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                  Combinação Inteligente
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {smartMatches.map((img) => {
                  const isSelected = currentCoverUrl === img.url;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        onSelectImage(img.url);
                      }}
                      className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 text-left transition-all duration-200 focus:outline-hidden ${
                        isSelected
                          ? 'border-blue-600 ring-4 ring-blue-600/20 shadow-md scale-102'
                          : 'border-slate-200/80 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-2 flex flex-col justify-between">
                        <div className="flex justify-end">
                          {isSelected && (
                            <span className="bg-blue-600 text-white p-1 rounded-full shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white line-clamp-1">
                            {img.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Controls Bar: Category Tabs & Search & Shuffle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar imagem por palavra-chave (ex: castelo, finanças, código, treino)..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-hidden bg-white font-medium"
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomSelect}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-all shrink-0"
              >
                <Shuffle className="w-3.5 h-3.5 text-blue-600" />
                Sortear 1 Imagem
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Images */}
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredImages.map((img) => {
                const isSelected = currentCoverUrl === img.url;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      onSelectImage(img.url);
                    }}
                    className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 text-left transition-all duration-200 focus:outline-hidden ${
                      isSelected
                        ? 'border-blue-600 ring-4 ring-blue-600/20 shadow-md scale-102'
                        : 'border-slate-200 hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="flex justify-end">
                        {isSelected ? (
                          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Ativo
                          </span>
                        ) : (
                          <span className="bg-slate-900/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            1 Clique
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-300 block">
                          {getCategoryName(img.category)}
                        </span>
                        <p className="text-xs font-bold text-white leading-tight line-clamp-1">
                          {img.title}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">
                Nenhuma imagem encontrada para os filtros selecionados.
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Tente buscar com outra palavra-chave ou selecione a categoria "Todas".
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <span className="text-xs font-medium text-slate-500">
            Exibindo <strong className="text-slate-800">{filteredImages.length}</strong> opções
            curadas de alta definição.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};
