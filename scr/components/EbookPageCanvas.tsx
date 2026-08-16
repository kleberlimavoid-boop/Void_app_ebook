import React from 'react';
import { Ebook, EbookPage } from '../types';
import {
  Sparkles,
  Crown,
  Check,
  BookOpen,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Layers,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Compass,
  Zap,
  Target,
  Flame,
} from 'lucide-react';
import { DIAGRAMATION_TEMPLATES } from '../data/templates';

interface EbookPageCanvasProps {
  ebook: Ebook;
  page: EbookPage;
  elementId?: string;
  isPdfExport?: boolean;
}

// Helper function to convert list content into a clean string array
const parseListItems = (content: string | string[]): string[] => {
  if (Array.isArray(content)) {
    return content.map((item) => String(item).trim()).filter(Boolean);
  }
  const str = String(content || '').trim();
  if (!str) return [];

  // 1. If line breaks exist, split by newline
  if (str.includes('\n')) {
    return str
      .split('\n')
      .map((line) => line.replace(/^[•\-\*\d+\.\s]+/, '').trim())
      .filter(Boolean);
  }

  // 2. If numbered items like "1. Item 2. Item" or "1. Item, 2. Item"
  if (/\d+\.\s/.test(str)) {
    return str
      .split(/(?=\d+\.\s)/)
      .map((item) => item.replace(/^[•\-\*\d+\.\s]+/, '').trim())
      .filter(Boolean);
  }

  // 3. If comma-separated items
  if (str.includes(',') && str.split(',').length >= 3) {
    return str
      .split(',')
      .map((item) => item.replace(/^[•\-\*\d+\.\s]+/, '').trim())
      .filter(Boolean);
  }

  // 4. If semicolon-separated items
  if (str.includes(';') && str.split(';').length >= 2) {
    return str
      .split(';')
      .map((item) => item.replace(/^[•\-\*\d+\.\s]+/, '').trim())
      .filter(Boolean);
  }

  return [str.replace(/^[•\-\*\d+\.\s]+/, '').trim()];
};

export const EbookPageCanvas: React.FC<EbookPageCanvasProps> = ({
  ebook,
  page,
  elementId,
  isPdfExport = false,
}) => {
  // Resolve template configuration
  const tmpl =
    DIAGRAMATION_TEMPLATES.find((t) => t.id === ebook.template) ||
    DIAGRAMATION_TEMPLATES[0];

  const primaryColor = ebook.primaryColor || tmpl.primaryColor || '#2563EB';
  const accentColor = ebook.accentColor || tmpl.accentColor || '#F59E0B';
  const fontHeading = ebook.fontHeading || tmpl.fontHeading || 'Plus Jakarta Sans';
  const fontBody = ebook.fontBody || tmpl.fontBody || 'Inter';

  // Helper to calculate relative color luminance
  const getLuminance = (hex: string): number => {
    if (!hex || typeof hex !== 'string') return 255;
    const cleanHex = hex.replace('#', '').trim();
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    } else {
      return 255;
    }
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Background tone and dark theme check
  const bgTone = tmpl.bgTone || '#ffffff';
  const cardBg = tmpl.cardBg || '#f8fafc';
  const bgLuminance = getLuminance(bgTone);
  const isDarkTheme =
    bgLuminance < 140 ||
    ['#090d16', '#030712', '#0f172a', '#111827', '#18181b'].includes(
      bgTone.toLowerCase()
    );

  // Resolve Heading Color with high-contrast guarantee
  let textColorHeading = ebook.headingColor;
  if (!textColorHeading) {
    if (tmpl.id === 'pro_luxury') {
      textColorHeading = '#FCD34D'; // Bright Gold for Noir Luxury
    } else if (tmpl.id === 'pro_editorial_gold') {
      textColorHeading = '#D97706'; // Rich Amber Gold for Editorial Gold
    } else if (tmpl.id === 'pro_tech_dark') {
      textColorHeading = '#67E8F9'; // Neon Cyan for Cyber Tech
    } else if (tmpl.id === 'pro_magazine') {
      textColorHeading = '#DC2626'; // Vivid Red for Magazine
    } else if (tmpl.id === 'pro_royal_navy' && isDarkTheme) {
      textColorHeading = '#F59E0B'; // Gold Amber for Royal Navy
    } else if (isDarkTheme) {
      if (getLuminance(primaryColor) > 150) {
        textColorHeading = primaryColor;
      } else if (getLuminance(accentColor) > 150) {
        textColorHeading = accentColor;
      } else {
        textColorHeading = '#F8FAFC'; // Luminous off-white
      }
    } else {
      if (getLuminance(primaryColor) < 170) {
        textColorHeading = primaryColor;
      } else {
        textColorHeading = '#0F172A'; // High-contrast dark slate
      }
    }
  }

  // Resolve Body Text Color
  let textColorBody = ebook.bodyColor;
  if (!textColorBody) {
    textColorBody = isDarkTheme ? '#CBD5E1' : '#334155';
  }

  // Colors adapted to theme
  const textColorMain = isDarkTheme ? '#F8FAFC' : '#1E293B';
  const textColorMuted = isDarkTheme ? '#94A3B8' : '#64748B';
  const borderColorSubtle = isDarkTheme
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.08)';

  // Special template outer borders matching preview cards
  let templateOuterBorder = isDarkTheme
    ? '1px solid rgba(255, 255, 255, 0.15)'
    : '1px solid rgba(0, 0, 0, 0.08)';

  if (tmpl.id === 'pro_luxury') {
    templateOuterBorder = '2px solid #D97706'; // Gold frame
  } else if (tmpl.id === 'pro_editorial_gold') {
    templateOuterBorder = '1px solid rgba(180, 83, 9, 0.3)';
  } else if (tmpl.id === 'pro_tech_dark') {
    templateOuterBorder = '1px solid rgba(6, 182, 212, 0.4)';
  } else if (tmpl.id === 'pro_magazine') {
    templateOuterBorder = '1px solid rgba(220, 38, 38, 0.3)';
  }

  const is169 = ebook.aspectRatio === '16:9';
  const is45 = ebook.aspectRatio === '4:5';

  const previewAspectClass = is169
    ? 'w-full max-w-[720px] aspect-[16/9] overflow-hidden'
    : is45
    ? 'w-full max-w-[520px] aspect-[4/5] overflow-hidden'
    : 'w-full max-w-[560px] aspect-[1/1.414] overflow-hidden';

  const pdfWidthPx = is169 ? '1123px' : '794px';
  const pdfHeightPx = is169 ? '632px' : is45 ? '992px' : '1123px';
  const pdfPaddingClass = is169 ? 'p-6 px-10' : is45 ? 'p-8 px-10' : 'p-10 px-12 sm:p-14';

  const imageMaxHeight = is169
    ? (isPdfExport ? '160px' : '120px')
    : is45
    ? (isPdfExport ? '220px' : '160px')
    : (isPdfExport ? '260px' : '200px');

  if (page.type === 'cover') {
    return (
      <div
        id={elementId}
        className={
          isPdfExport
            ? `ebook-page flex flex-col justify-between relative overflow-hidden shrink-0 ${pdfPaddingClass}`
            : `${previewAspectClass} rounded-xl shadow-lg border ${
                is169 ? 'p-5 sm:p-6' : is45 ? 'p-6 sm:p-7' : 'p-6 sm:p-8'
              } flex flex-col justify-between relative overflow-hidden transition-all mx-auto`
        }
        style={{
          width: isPdfExport ? pdfWidthPx : undefined,
          height: isPdfExport ? pdfHeightPx : undefined,
          minWidth: isPdfExport ? pdfWidthPx : undefined,
          maxWidth: isPdfExport ? pdfWidthPx : undefined,
          minHeight: isPdfExport ? pdfHeightPx : undefined,
          maxHeight: isPdfExport ? pdfHeightPx : undefined,
          boxSizing: 'border-box',
          fontFamily: `${fontHeading}, sans-serif`,
          backgroundColor: isDarkTheme ? bgTone : '#0f172a',
          borderColor: isDarkTheme ? accentColor : '#e2e8f0',
          color: '#ffffff',
          WebkitPrintColorAdjust: 'exact',
          colorAdjust: 'exact',
          printColorAdjust: 'exact',
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          pageBreakAfter: 'always',
          breakAfter: 'page',
        }}
      >
        {ebook.coverImageUrl && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url("${ebook.coverImageUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <img
              src={ebook.coverImageUrl}
              alt="Capa do Ebook"
              className="w-full h-full object-cover opacity-0 pointer-events-none"
              crossOrigin="anonymous"
            />
          </div>
        )}
        <div
          className={`absolute inset-0 flex flex-col justify-between ${
            isPdfExport
              ? (is169 ? 'p-8 px-12' : is45 ? 'p-10 px-12' : 'p-12 sm:p-14')
              : (is169 ? 'p-5 sm:p-6' : is45 ? 'p-6 sm:p-7' : 'p-6 sm:p-8')
          }`}
          style={{
            background: ebook.coverImageUrl
              ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.88) 50%, rgba(15, 23, 42, 0.95) 100%)'
              : `linear-gradient(135deg, ${primaryColor} 0%, ${isDarkTheme ? bgTone : '#0F172A'} 100%)`,
          }}
        >
          {/* Top Cover Header Spacer */}
          <div className="relative z-10 h-2 sm:h-3"></div>

          {/* Title & Subtitle */}
          <div className="relative z-10 my-auto text-center px-4 sm:px-6">
            <h1
              className={`font-extrabold text-white leading-tight ${
                isPdfExport
                  ? (is169 ? 'text-3xl sm:text-4xl max-w-2xl mx-auto' : 'text-4xl sm:text-5xl max-w-2xl mx-auto')
                  : (is169 ? 'text-lg sm:text-xl' : is45 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl')
              }`}
              style={{
                fontFamily: fontHeading,
                textShadow: '0 4px 16px rgba(0,0,0,0.85)',
                lineHeight: 1.2,
                textTransform: ebook.titleTransform === 'uppercase' ? 'uppercase' : 'none',
                wordBreak: 'break-word',
              }}
            >
              {ebook.title}
            </h1>
            {ebook.subtitle && (
              <p
                className={`text-white font-medium leading-relaxed mx-auto ${
                  isPdfExport
                    ? (is169 ? 'mt-3 text-base sm:text-lg max-w-xl' : 'mt-4 text-lg sm:text-xl max-w-xl')
                    : (is169 ? 'mt-1.5 text-[11px] sm:text-xs max-w-md' : 'mt-2 text-xs sm:text-sm max-w-sm')
                }`}
                style={{
                  fontFamily: fontBody,
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  lineHeight: 1.35,
                  textTransform: ebook.subtitleTransform === 'uppercase' ? 'uppercase' : 'none',
                  wordBreak: 'break-word',
                }}
              >
                {ebook.subtitle}
              </p>
            )}
            <div
              className={`mx-auto rounded-full ${
                isPdfExport ? (is169 ? 'w-16 h-1.5 my-4' : 'w-24 h-2 my-6') : 'w-10 h-1 my-3'
              }`}
              style={{
                backgroundColor: accentColor,
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Footer Info */}
          {isPdfExport ? (
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                display: 'table',
                width: '100%',
                tableLayout: 'fixed',
                borderTop: '1px solid rgba(255,255,255,0.3)',
                paddingTop: '20px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                boxSizing: 'border-box',
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
              }}
            >
              <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'middle' }}>
                Por {ebook.author}
              </div>
              <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'middle', width: '160px' }}>
                {ebook.pages?.length || 1} Páginas
              </div>
            </div>
          ) : (
            <div
              className="relative z-10 flex items-center justify-between text-white border-t text-xs font-semibold pt-3"
              style={{
                borderColor: 'rgba(255,255,255,0.3)',
                textShadow: '0 2px 6px rgba(0,0,0,0.7)',
              }}
            >
              <span>Por {ebook.author}</span>
              <span>{ebook.pages?.length || 1} Páginas</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Exclude cover and the TOC itself from the chapters list
  const tocPages = ebook.pages.filter((p) => p.type !== 'cover' && p.type !== 'toc');

  // Render template-specific top header bar
  const renderTemplateHeader = () => {
    const displayTitle = ebook.title || 'E-Book';
    const pageNumStr = page.pageNumber < 10 ? `0${page.pageNumber}` : `${page.pageNumber}`;
    const cleanGenre = (!ebook.genre || ebook.genre.toLowerCase() === 'outro') ? '' : ebook.genre;

    if (isPdfExport) {
      return (
        <div
          style={{
            display: 'table',
            width: '100%',
            tableLayout: 'fixed',
            borderBottom: `1px solid ${borderColorSubtle}`,
            paddingBottom: '14px',
            marginBottom: '20px',
            boxSizing: 'border-box',
            breakInside: 'avoid',
            pageBreakInside: 'avoid',
          }}
        >
          <div
            style={{
              display: 'table-cell',
              textAlign: 'left',
              verticalAlign: 'middle',
              color: textColorHeading,
              fontWeight: 800,
              fontSize: '14px',
              wordBreak: 'break-word',
            }}
          >
            <span style={{ color: accentColor, marginRight: '8px' }}>◆</span>
            {cleanGenre ? <span style={{ textTransform: 'uppercase', marginRight: '6px' }}>{cleanGenre} •</span> : null}
            {displayTitle}
          </div>
          <div
            style={{
              display: 'table-cell',
              textAlign: 'right',
              verticalAlign: 'middle',
              width: '120px',
              color: textColorMuted,
              fontWeight: 700,
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            PÁG. {pageNumStr}
          </div>
        </div>
      );
    }

    if (tmpl.id === 'corporate') {
      return (
        <div
          className={`flex items-center justify-between border-b ${
            isPdfExport ? 'pt-2 pb-3 mb-6 text-sm' : 'pb-2 mb-4 text-[10px]'
          }`}
          style={{ borderColor: borderColorSubtle }}
        >
          <div className={`flex items-center gap-2 ${isPdfExport ? 'overflow-visible' : 'overflow-hidden'}`}>
            <span
              className={`font-mono font-extrabold uppercase tracking-wider shrink-0 ${
                isPdfExport ? 'text-xs' : 'text-[10px]'
              }`}
              style={{ lineHeight: '1.5', color: isDarkTheme ? '#E2E8F0' : '#1E293B' }}
            >
              {cleanGenre || 'EXECUTIVO'}
            </span>
            <span className="font-bold" style={{ color: borderColorSubtle }}>•</span>
            <span
              className={`font-mono font-semibold ${
                isPdfExport ? 'max-w-[480px]' : 'truncate max-w-[240px]'
              }`}
              style={{ lineHeight: '1.5', color: textColorMuted }}
            >
              {displayTitle}
            </span>
          </div>
          <span
            className="font-mono font-bold shrink-0 ml-2"
            style={{ lineHeight: '1.5', color: textColorMuted }}
          >
            PÁG. {pageNumStr}
          </span>
        </div>
      );
    }

    if (tmpl.id === 'pro_tech_dark') {
      return (
        <div
          className={`flex items-center justify-between border-b ${
            isPdfExport ? 'pt-2 pb-3 mb-6 text-sm' : 'pb-2 mb-4 text-[10px]'
          }`}
          style={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}
        >
          <div className={`flex items-center gap-2 ${isPdfExport ? 'overflow-visible' : 'overflow-hidden'}`}>
            <span
              className={`font-mono font-extrabold uppercase tracking-wider shrink-0 ${
                isPdfExport ? 'text-xs' : 'text-[10px]'
              }`}
              style={{ lineHeight: '1.5', color: '#22D3EE' }}
            >
              {cleanGenre || 'TECH'}
            </span>
            <span className="font-bold" style={{ color: '#0891B2' }}>•</span>
            <span
              className={`font-mono font-medium ${
                isPdfExport ? 'max-w-[480px]' : 'truncate max-w-[240px]'
              }`}
              style={{ lineHeight: '1.5', color: '#67E8F9' }}
            >
              {displayTitle}
            </span>
          </div>
          <span
            className="font-mono font-bold shrink-0 ml-2"
            style={{ lineHeight: '1.5', color: '#22D3EE' }}
          >
            PÁG. {pageNumStr}
          </span>
        </div>
      );
    }

    if (tmpl.id === 'pro_magazine') {
      return (
        <div
          className={`flex items-center justify-between border-b ${
            isPdfExport ? 'pt-2 pb-3 mb-6 text-sm' : 'pb-2 mb-4 text-[10px]'
          }`}
          style={{ borderColor: borderColorSubtle }}
        >
          <div className={`flex items-center gap-2 ${isPdfExport ? 'overflow-visible' : 'overflow-hidden'}`}>
            <span
              className={`font-black uppercase tracking-wider shrink-0 ${
                isPdfExport ? 'text-xs' : 'text-[10px]'
              }`}
              style={{ lineHeight: '1.5', color: '#DC2626' }}
            >
              {cleanGenre || 'EDITORIAL'}
            </span>
            <span className="font-bold" style={{ color: borderColorSubtle }}>•</span>
            <span
              className={`font-black ${
                isPdfExport ? 'max-w-[480px]' : 'truncate max-w-[240px]'
              }`}
              style={{ color: textColorHeading, lineHeight: '1.5' }}
            >
              {displayTitle}
            </span>
          </div>
          <span
            className="font-black shrink-0 ml-2"
            style={{ lineHeight: '1.5', color: '#DC2626' }}
          >
            Pág. {pageNumStr}
          </span>
        </div>
      );
    }

    if (tmpl.id === 'pro_luxury') {
      return (
        <div
          className={`flex items-center justify-between border-b ${
            isPdfExport ? 'pt-2 pb-3 mb-6 text-sm' : 'pb-2 mb-4 text-[10px]'
          }`}
          style={{ borderColor: 'rgba(217, 119, 6, 0.4)' }}
        >
          <div className={`flex items-center gap-2 ${isPdfExport ? 'overflow-visible' : 'overflow-hidden'}`}>
            <span
              className={`font-serif font-bold uppercase tracking-wider shrink-0 inline-flex items-center gap-1 ${
                isPdfExport ? 'text-xs' : 'text-[10px]'
              }`}
              style={{ lineHeight: '1.5', color: '#FBBF24' }}
            >
              <Crown className={isPdfExport ? 'w-3.5 h-3.5' : 'w-3 h-3'} style={{ color: '#FBBF24' }} />
              <span>LUXURY</span>
            </span>
            <span className="font-bold" style={{ color: 'rgba(217, 119, 6, 0.6)' }}>•</span>
            <span
              className={`font-serif font-bold ${
                isPdfExport ? 'max-w-[480px]' : 'truncate max-w-[240px]'
              }`}
              style={{ lineHeight: '1.5', color: '#FCD34D' }}
            >
              {displayTitle}
            </span>
          </div>
          <span
            className="font-serif font-bold shrink-0 ml-2"
            style={{ lineHeight: '1.5', color: '#FCD34D' }}
          >
            PÁG. {pageNumStr}
          </span>
        </div>
      );
    }

    if (tmpl.id === 'pro_royal_navy') {
      return (
        <div
          className={`flex items-center justify-between border-b ${
            isPdfExport ? 'pt-2 pb-3 mb-6 text-sm' : 'pb-2 mb-4 text-[10px]'
          }`}
          style={{ borderColor: borderColorSubtle }}
        >
          <div className={`flex items-center gap-2 ${isPdfExport ? 'overflow-visible' : 'overflow-hidden'}`}>
            <span
              className={`font-bold uppercase tracking-wider shrink-0 ${
                isPdfExport ? 'text-xs' : 'text-[10px]'
              }`}
              style={{ lineHeight: '1.5', color: isDarkTheme ? '#93C5FD' : '#1E3A8A' }}
            >
              {cleanGenre || 'EXECUTIVE'}
            </span>
            <span className="font-bold" style={{ color: borderColorSubtle }}>•</span>
            <span
              className={`font-bold ${
                isPdfExport ? 'max-w-[480px]' : 'truncate max-w-[240px]'
              }`}
              style={{ color: textColorHeading, lineHeight: '1.5' }}
            >
              {displayTitle}
            </span>
          </div>
          <span
            className="font-bold shrink-0 ml-2"
            style={{ lineHeight: '1.5', color: isDarkTheme ? '#60A5FA' : '#1E40AF' }}
          >
            PÁG. {pageNumStr}
          </span>
        </div>
      );
    }

    if (tmpl.id === 'warm' || tmpl.id === 'pro_nordic') {
      return (
        <div
          className={`flex items-center justify-between border-b ${
            isPdfExport ? 'pt-2 pb-3 mb-6 text-sm' : 'pb-2 mb-4 text-[10px]'
          }`}
          style={{ borderColor: borderColorSubtle }}
        >
          <div className={`flex items-center gap-2 ${isPdfExport ? 'overflow-visible' : 'overflow-hidden'}`}>
            <div
              className={`rounded-full shrink-0 ${isPdfExport ? 'w-2.5 h-2.5' : 'w-2 h-2'}`}
              style={{ backgroundColor: '#059669' }}
            />
            <span
              className={`font-bold ${
                isPdfExport ? 'max-w-[480px]' : 'truncate max-w-[280px]'
              }`}
              style={{ color: textColorHeading, lineHeight: '1.5' }}
            >
              {displayTitle}
            </span>
          </div>
          <span
            className="font-bold shrink-0 ml-2"
            style={{ lineHeight: '1.5', color: '#047857' }}
          >
            Pág. {pageNumStr}
          </span>
        </div>
      );
    }

    if (tmpl.id === 'pastel') {
      return (
        <div
          className={`flex items-center justify-between border-b ${
            isPdfExport ? 'pt-2 pb-3 mb-6 text-sm' : 'pb-2 mb-4 text-[10px]'
          }`}
          style={{ borderColor: borderColorSubtle }}
        >
          <div className={`flex items-center gap-2 ${isPdfExport ? 'overflow-visible' : 'overflow-hidden'}`}>
            <span
              className={`font-bold uppercase tracking-wider shrink-0 ${
                isPdfExport ? 'text-xs' : 'text-[10px]'
              }`}
              style={{ lineHeight: '1.5', color: '#115E59' }}
            >
              {cleanGenre || 'GUIA'}
            </span>
            <span className="font-bold" style={{ color: '#99F6E4' }}>•</span>
            <span
              className={`font-bold ${
                isPdfExport ? 'max-w-[480px]' : 'truncate max-w-[240px]'
              }`}
              style={{ color: textColorHeading, lineHeight: '1.5' }}
            >
              {displayTitle}
            </span>
          </div>
          <span
            className="font-bold shrink-0 ml-2"
            style={{ lineHeight: '1.5', color: '#F43F5E' }}
          >
            Pág. {pageNumStr}
          </span>
        </div>
      );
    }

    if (tmpl.id === 'minimalist') {
      return (
        <div
          className={`flex items-center justify-between border-b uppercase font-serif ${
            isPdfExport ? 'pt-2 pb-3 mb-6 text-xs tracking-widest' : 'pb-2 mb-4 text-[9px] tracking-widest'
          }`}
          style={{ borderColor: borderColorSubtle, color: textColorMuted }}
        >
          <span
            className={isPdfExport ? 'max-w-[480px]' : 'truncate max-w-[280px]'}
            style={{ lineHeight: '1.5', color: textColorMuted }}
          >
            {displayTitle}
          </span>
          <span
            className="shrink-0 ml-2"
            style={{ lineHeight: '1.5', color: textColorMuted }}
          >
            — PÁG. {pageNumStr} —
          </span>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-between border-b font-semibold uppercase tracking-wider ${
          isPdfExport ? 'pt-2 pb-3 mb-6 text-sm font-bold' : 'pb-2 mb-4 text-[10px]'
        }`}
        style={{ borderColor: borderColorSubtle, color: textColorMuted }}
      >
        <span
          className={`font-bold ${
            isPdfExport ? 'max-w-[480px]' : 'max-w-[380px] overflow-hidden text-ellipsis whitespace-nowrap block'
          }`}
          style={{ color: textColorHeading, lineHeight: '1.5' }}
        >
          {displayTitle}
        </span>
        <span
          style={{ color: textColorHeading, lineHeight: '1.5' }}
          className="font-extrabold shrink-0 ml-2 block"
        >
          Pág. {page.pageNumber}
        </span>
      </div>
    );
  };

  // Render template-specific title heading
  const renderTemplateTitle = () => {
    if (tmpl.id === 'corporate') {
      return (
        <div className="mb-6">
          <div
            className="font-mono text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: '#0284C7', marginBottom: isPdfExport ? '8px' : '4px' }}
          >
            // SEÇÃO 0{page.pageNumber}
          </div>
          <h2
            className={`font-mono font-bold tracking-tight uppercase ${
              isPdfExport ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
            }`}
            style={{ color: textColorHeading, lineHeight: '1.3' }}
          >
            {page.title}
          </h2>
        </div>
      );
    }

    if (tmpl.id === 'pro_tech_dark') {
      return (
        <div className="mb-6">
          <div
            className="font-mono text-xs font-bold uppercase tracking-wider"
            style={{ color: '#10B981', marginBottom: isPdfExport ? '8px' : '4px' }}
          >
            // [ PROTOCOLO TECH 0{page.pageNumber} ]
          </div>
          <h2
            className={`font-mono font-bold tracking-tight ${
              isPdfExport ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
            }`}
            style={{ color: '#67E8F9', lineHeight: '1.3' }}
          >
            [ {page.title} ]
          </h2>
          <div
            style={{
              height: isPdfExport ? '3px' : '2px',
              width: '100%',
              backgroundColor: '#0284C7',
              marginTop: isPdfExport ? '14px' : '8px',
              opacity: 0.6,
            }}
          />
        </div>
      );
    }

    if (tmpl.id === 'pro_editorial_gold') {
      return (
        <div
          className="mb-6"
          style={{
            borderLeft: isPdfExport ? '5px solid #B45309' : '4px solid #B45309',
            paddingLeft: isPdfExport ? '18px' : '12px',
            paddingTop: '2px',
            paddingBottom: '2px',
          }}
        >
          <h2
            className={`font-serif italic font-bold tracking-tight ${
              isPdfExport ? 'text-3xl sm:text-4xl' : 'text-lg sm:text-xl'
            }`}
            style={{ color: textColorHeading, lineHeight: '1.3' }}
          >
            {page.title}
          </h2>
        </div>
      );
    }

    if (tmpl.id === 'pro_luxury') {
      return (
        <div className="mb-6 text-center">
          <h2
            className={`font-serif font-black tracking-wide ${
              isPdfExport ? 'text-3xl sm:text-4xl' : 'text-lg sm:text-xl'
            }`}
            style={{ color: textColorHeading || '#FCD34D', lineHeight: '1.3' }}
          >
            {page.title}
          </h2>
          <div
            className="mx-auto"
            style={{
              width: isPdfExport ? '55%' : '60%',
              height: isPdfExport ? '3px' : '2px',
              backgroundColor: '#F59E0B',
              marginTop: isPdfExport ? '16px' : '8px',
              marginBottom: isPdfExport ? '16px' : '8px',
              borderRadius: '9999px',
            }}
          />
        </div>
      );
    }

    if (tmpl.id === 'minimalist') {
      return (
        <div className="mb-6 text-center">
          <h2
            className={`font-serif italic font-normal ${
              isPdfExport ? 'text-3xl sm:text-4xl' : 'text-lg sm:text-xl'
            }`}
            style={{ color: textColorHeading, lineHeight: '1.3' }}
          >
            {page.title}
          </h2>
          <div
            className="mx-auto"
            style={{
              width: isPdfExport ? '80px' : '64px',
              height: isPdfExport ? '3px' : '2px',
              backgroundColor: '#A1A1AA',
              marginTop: isPdfExport ? '14px' : '8px',
              marginBottom: isPdfExport ? '14px' : '8px',
            }}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center mb-6">
        <div
          className="rounded-full shrink-0"
          style={{
            backgroundColor: accentColor,
            width: isPdfExport ? '6px' : '4px',
            height: isPdfExport ? '32px' : '22px',
            marginRight: isPdfExport ? '16px' : '10px',
          }}
        />
        <h2
          className={`font-extrabold tracking-tight ${
            isPdfExport ? 'text-3xl sm:text-4xl' : 'text-lg sm:text-xl'
          }`}
          style={{
            fontFamily: fontHeading,
            color: textColorHeading,
            lineHeight: '1.25',
          }}
        >
          {page.title}
        </h2>
      </div>
    );
  };

  return (
    <div
      id={elementId}
      className={
        isPdfExport
          ? `ebook-page flex flex-col justify-between relative overflow-hidden shrink-0 ${pdfPaddingClass}`
          : `${previewAspectClass} rounded-xl shadow-lg border p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all mx-auto`
      }
      style={{
        width: isPdfExport ? pdfWidthPx : undefined,
        height: isPdfExport ? pdfHeightPx : undefined,
        minWidth: isPdfExport ? pdfWidthPx : undefined,
        maxWidth: isPdfExport ? pdfWidthPx : undefined,
        minHeight: isPdfExport ? pdfHeightPx : undefined,
        maxHeight: isPdfExport ? pdfHeightPx : undefined,
        boxSizing: 'border-box',
        fontFamily: `${fontBody}, sans-serif`,
        backgroundColor: bgTone,
        border: templateOuterBorder,
        color: textColorMain,
        WebkitPrintColorAdjust: 'exact',
        colorAdjust: 'exact',
        printColorAdjust: 'exact',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      {/* Header Bar */}
      {renderTemplateHeader()}

      {/* Main Content */}
      {page.type === 'toc' ? (
        <div className="flex-1 flex flex-col justify-center my-auto" style={{ minHeight: 'auto', breakInside: 'avoid' }}>
          <div className="border-b pb-3 mb-4 sm:mb-5" style={{ borderColor: borderColorSubtle }}>
            <h2
              className={`font-extrabold mb-1 ${isPdfExport ? 'text-3xl' : 'text-lg'}`}
              style={{ fontFamily: fontHeading, color: textColorHeading, lineHeight: '1.3', wordBreak: 'break-word' }}
            >
              Sumário do Conteúdo
            </h2>
            <p className={isPdfExport ? 'text-sm font-medium' : 'text-[11px]'} style={{ color: textColorMuted, lineHeight: '1.4', wordBreak: 'break-word' }}>
              Estrutura de capítulos deste e-book ({tocPages.length} seções)
            </p>
          </div>

          {isPdfExport ? (
            <div
              style={{
                width: '100%',
                boxSizing: 'border-box',
                display: tocPages.length > 7 ? 'grid' : 'block',
                gridTemplateColumns: tocPages.length > 7 ? '1fr 1fr' : '1fr',
                gap: tocPages.length > 7 ? '8px 12px' : '0px',
              }}
            >
              {tocPages.map((p, idx) => {
                const is2Col = tocPages.length > 7;
                return (
                  <div
                    key={p.pageNumber || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      border: `1px solid ${borderColorSubtle}`,
                      borderRadius: '10px',
                      backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : cardBg,
                      padding: is2Col ? '8px 12px' : '10px 14px',
                      marginBottom: is2Col ? '0px' : '8px',
                      boxSizing: 'border-box',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      minHeight: 'auto',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: is2Col ? '12px' : '14px',
                        color: textColorMain,
                        lineHeight: '1.35',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        marginRight: '8px',
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: is2Col ? '11px' : '12px',
                        fontWeight: 800,
                        color: accentColor,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      Pág. {p.pageNumber}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`grid ${
                tocPages.length >= 6 ? 'grid-cols-2 gap-x-3 gap-y-2' : 'grid-cols-1 gap-2.5'
              }`}
            >
              {tocPages.map((p, idx) => {
                const is2Col = tocPages.length >= 6;
                return (
                  <div
                    key={p.pageNumber || idx}
                    className={`flex items-center justify-between gap-2.5 rounded-xl border transition-all ${
                      is2Col ? 'p-2 px-3' : 'p-2.5 px-3.5'
                    }`}
                    style={{
                      backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : cardBg,
                      borderColor: borderColorSubtle,
                      minHeight: is2Col ? '32px' : '38px',
                    }}
                  >
                    <span
                      className={`font-bold flex-1 min-w-0 ${
                        is2Col ? 'text-[11px] truncate' : 'text-xs truncate'
                      }`}
                      style={{
                        color: textColorMain,
                        lineHeight: '1.4',
                      }}
                    >
                      {p.title}
                    </span>
                    <span
                      className="font-extrabold shrink-0 text-right"
                      style={{
                        color: accentColor,
                        fontSize: is2Col ? '10px' : '11px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Pág. {p.pageNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex-1 flex flex-col ${
            page.blocks.length <= 4 ? 'justify-center my-auto' : 'justify-start'
          }`}
        >
          {/* Chapter Title */}
          {renderTemplateTitle()}

          <div className={isPdfExport ? 'space-y-4' : 'space-y-2.5'}>
            {page.blocks.map((block) => (
              <div
                key={block.id}
                style={{
                  boxSizing: 'border-box',
                  breakInside: 'avoid',
                  pageBreakInside: 'avoid',
                  minHeight: 'auto',
                }}
              >
                {block.type === 'heading' && (
                  <h3
                    className={`font-bold mt-2 mb-2 ${isPdfExport ? 'text-2xl' : 'text-sm'}`}
                    style={{
                      fontFamily: fontHeading,
                      color: textColorHeading,
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                    }}
                  >
                    {String(block.content)}
                  </h3>
                )}

                {block.type === 'subheading' && (
                  <h4
                    className={`font-semibold mt-1.5 mb-1.5 ${isPdfExport ? 'text-xl' : 'text-xs'}`}
                    style={{
                      fontFamily: fontHeading,
                      color: textColorHeading,
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                    }}
                  >
                    {String(block.content)}
                  </h4>
                )}

                {block.type === 'paragraph' && (
                  <div
                    className={`rounded-xl transition-all ${
                      ['corporate', 'warm', 'pastel', 'pro_editorial_gold', 'pro_tech_dark', 'pro_magazine', 'pro_royal_navy', 'pro_luxury', 'pro_nordic'].includes(tmpl.id)
                        ? (isPdfExport ? 'p-4 border shadow-2xs my-2.5' : 'p-3.5 border shadow-2xs my-2')
                        : 'p-1'
                    }`}
                    style={{
                      backgroundColor: ['corporate', 'warm', 'pastel', 'pro_editorial_gold', 'pro_tech_dark', 'pro_magazine', 'pro_royal_navy', 'pro_luxury', 'pro_nordic'].includes(tmpl.id)
                        ? (isDarkTheme ? 'rgba(255,255,255,0.06)' : cardBg)
                        : 'transparent',
                      borderColor: borderColorSubtle,
                      minHeight: 'auto',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      wordBreak: 'break-word',
                    }}
                  >
                    <p
                      className={`font-medium ${
                        isPdfExport ? 'text-base sm:text-lg' : 'text-xs'
                      }`}
                      style={{
                        color: textColorBody,
                        lineHeight: '1.65',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {String(block.content)}
                    </p>
                  </div>
                )}
                {/* Vertical Clean Bullet List */}
                {block.type === 'bullet_list' && (() => {
                  const items = parseListItems(block.content);
                  if (isPdfExport) {
                    return (
                      <div style={{ width: '100%', margin: '8px 0', boxSizing: 'border-box', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              width: '100%',
                              border: `1px solid ${borderColorSubtle}`,
                              borderRadius: '10px',
                              backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : cardBg,
                              padding: '10px 14px',
                              marginBottom: '6px',
                              boxSizing: 'border-box',
                              breakInside: 'avoid',
                              pageBreakInside: 'avoid',
                              minHeight: 'auto',
                            }}
                          >
                            <span
                              style={{
                                color: accentColor,
                                fontSize: '15px',
                                fontWeight: 900,
                                lineHeight: '1.2',
                                marginRight: '10px',
                                flexShrink: 0,
                              }}
                            >
                              ◆
                            </span>
                            <div
                              style={{
                                flex: 1,
                                textAlign: 'left',
                                fontWeight: 500,
                                fontSize: '13px',
                                color: textColorBody,
                                lineHeight: '1.4',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div
                      className="space-y-2 my-2.5"
                      style={{ breakInside: 'avoid', pageBreakInside: 'avoid', minHeight: 'auto' }}
                    >
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl border transition-all p-2.5 text-xs"
                          style={{
                            backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : cardBg,
                            borderColor: borderColorSubtle,
                            color: textColorBody,
                            minHeight: 'auto',
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid',
                            wordBreak: 'break-word',
                          }}
                        >
                          <span
                            className="font-bold shrink-0 text-xs mt-0.5"
                            style={{ color: accentColor, lineHeight: '1' }}
                          >
                            ◆
                          </span>
                          <span
                            className="font-medium flex-1 my-auto"
                            style={{
                              lineHeight: '1.4',
                              paddingTop: '1px',
                              paddingBottom: '1px',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Checklist with Clean Direct Checkmarks */}
                {block.type === 'checklist' && (() => {
                  const items = parseListItems(block.content);
                  if (isPdfExport) {
                    return (
                      <div style={{ width: '100%', margin: '8px 0', boxSizing: 'border-box', breakInside: 'avoid', pageBreakInside: 'avoid', minHeight: 'auto' }}>
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              border: `1px solid ${borderColorSubtle}`,
                              borderRadius: '10px',
                              backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : cardBg,
                              padding: '10px 16px',
                              marginBottom: '8px',
                              boxSizing: 'border-box',
                              breakInside: 'avoid',
                              pageBreakInside: 'avoid',
                              minHeight: 'auto',
                            }}
                          >
                            <span
                              style={{
                                color: isDarkTheme ? '#34D399' : '#059669',
                                fontSize: '18px',
                                fontWeight: 900,
                                marginRight: '12px',
                                lineHeight: '1',
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </span>
                            <div
                              style={{
                                flex: 1,
                                textAlign: 'left',
                                fontWeight: 500,
                                fontSize: '13px',
                                color: textColorBody,
                                lineHeight: '1.4',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                boxSizing: 'border-box',
                                minHeight: 'auto',
                              }}
                            >
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div
                      className="space-y-2 my-2.5"
                      style={{ breakInside: 'avoid', pageBreakInside: 'avoid', minHeight: 'auto' }}
                    >
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 rounded-xl border transition-all text-xs"
                          style={{
                            backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : cardBg,
                            borderColor: borderColorSubtle,
                            color: textColorBody,
                            minHeight: 'auto',
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid',
                            wordBreak: 'break-word',
                            boxSizing: 'border-box',
                            padding: '8px 12px',
                          }}
                        >
                          <span
                            className="font-black shrink-0 text-sm"
                            style={{
                              color: isDarkTheme ? '#34D399' : '#059669',
                              lineHeight: '1',
                            }}
                          >
                            ✓
                          </span>
                          <span
                            className="font-medium flex-1 my-auto"
                            style={{
                              lineHeight: '1.4',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              boxSizing: 'border-box',
                              minHeight: 'auto',
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Key Takeaways Cards with Clean Typography */}
                {block.type === 'key_takeaways' && (() => {
                  const items = parseListItems(block.content);
                  if (isPdfExport) {
                    return (
                      <div
                        style={{
                          width: '100%',
                          margin: '10px 0',
                          padding: '12px 16px',
                          borderRadius: '14px',
                          border: `1px solid ${primaryColor}40`,
                          backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : `${primaryColor}08`,
                          boxSizing: 'border-box',
                          breakInside: 'avoid',
                          pageBreakInside: 'avoid',
                          minHeight: 'auto',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: '12px',
                            color: textColorHeading,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '8px',
                            wordBreak: 'break-word',
                          }}
                        >
                          ★ DESTAQUES E PONTOS-CHAVE:
                        </div>
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              border: `1px solid ${borderColorSubtle}`,
                              borderRadius: '10px',
                              backgroundColor: isDarkTheme ? 'rgba(0,0,0,0.25)' : '#ffffff',
                              padding: '10px 16px',
                              marginBottom: '8px',
                              boxSizing: 'border-box',
                              breakInside: 'avoid',
                              pageBreakInside: 'avoid',
                              minHeight: 'auto',
                            }}
                          >
                            <span
                              style={{
                                color: primaryColor,
                                fontWeight: 900,
                                fontSize: '14px',
                                marginRight: '10px',
                                flexShrink: 0,
                                lineHeight: '1',
                              }}
                            >
                              {idx + 1 < 10 ? `0${idx + 1}.` : `${idx + 1}.`}
                            </span>
                            <div
                              style={{
                                flex: 1,
                                textAlign: 'left',
                                fontWeight: 500,
                                fontSize: '13px',
                                color: textColorBody,
                                lineHeight: '1.4',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                boxSizing: 'border-box',
                                minHeight: 'auto',
                              }}
                            >
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div
                      className="space-y-2 my-3 p-3.5 rounded-2xl border"
                      style={{
                        backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : `${primaryColor}08`,
                        borderColor: `${primaryColor}30`,
                        minHeight: 'auto',
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                        wordBreak: 'break-word',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        className="font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs"
                        style={{ color: textColorHeading, wordBreak: 'break-word', lineHeight: '1.4' }}
                      >
                        <Sparkles className="text-amber-500 w-3.5 h-3.5" /> Destaques e Pontos-Chave:
                      </div>
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 rounded-xl transition-all border text-xs"
                          style={{
                            backgroundColor: isDarkTheme ? 'rgba(0,0,0,0.2)' : '#ffffff',
                            borderColor: borderColorSubtle,
                            color: textColorBody,
                            minHeight: 'auto',
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid',
                            wordBreak: 'break-word',
                            boxSizing: 'border-box',
                            padding: '8px 12px',
                          }}
                        >
                          <span
                            className="font-black shrink-0"
                            style={{
                              color: primaryColor,
                              fontSize: '11px',
                              lineHeight: '1',
                            }}
                          >
                            {idx + 1 < 10 ? `0${idx + 1}.` : `${idx + 1}.`}
                          </span>
                          <span
                            className="font-medium flex-1 my-auto"
                            style={{
                              lineHeight: '1.4',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              boxSizing: 'border-box',
                              minHeight: 'auto',
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {block.type === 'quote' && (
                  <div
                    className={`rounded-r-xl font-semibold italic border-l-4 my-2 ${
                      isPdfExport ? 'p-4 text-lg' : 'p-3 text-xs'
                    }`}
                    style={{
                      backgroundColor: isDarkTheme ? `${accentColor}25` : `${primaryColor}10`,
                      borderColor: accentColor,
                      color: textColorHeading,
                      lineHeight: isPdfExport ? 1.6 : 1.5,
                      minHeight: 'auto',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    "{String(block.content)}"
                  </div>
                )}

                {block.type === 'callout' && (
                  <div
                    className={`rounded-xl font-semibold border my-2 flex items-center ${
                      isPdfExport ? 'p-4 text-base gap-3' : 'p-3 text-[11px] gap-2.5'
                    }`}
                    style={{
                      backgroundColor: isDarkTheme ? `${accentColor}25` : `${accentColor}12`,
                      borderColor: isDarkTheme ? `${accentColor}60` : `${accentColor}40`,
                      lineHeight: isPdfExport ? 1.6 : 1.5,
                      minHeight: 'auto',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      wordBreak: 'break-word',
                    }}
                  >
                    <Sparkles
                      className={`shrink-0 ${isPdfExport ? 'w-5 h-5' : 'w-4 h-4'}`}
                      style={{ color: accentColor }}
                    />
                    <div
                      style={{
                        color: textColorBody,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                      className="flex-1 font-medium leading-normal my-auto"
                    >
                      {String(block.content)}
                    </div>
                  </div>
                )}

                {block.type === 'stat_grid' && block.stats && block.stats.length > 0 && (
                  isPdfExport ? (
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: '12px 0px',
                        margin: '14px 0',
                        tableLayout: 'fixed',
                        boxSizing: 'border-box',
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                      }}
                    >
                      <tbody>
                        <tr>
                          {block.stats.map((st, sIdx) => (
                            <td
                              key={sIdx}
                              style={{
                                width: `${100 / block.stats!.length}%`,
                                verticalAlign: 'top',
                                textAlign: 'center',
                                padding: '16px 14px',
                                borderRadius: '14px',
                                border: `1px solid ${isDarkTheme ? `${accentColor}40` : `${primaryColor}25`}`,
                                backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : `${primaryColor}08`,
                                boxSizing: 'border-box',
                                breakInside: 'avoid',
                                pageBreakInside: 'avoid',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '28px',
                                  fontWeight: 900,
                                  fontFamily: fontHeading,
                                  color: isDarkTheme ? '#FCD34D' : primaryColor,
                                  lineHeight: '1.2',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {st.value}
                              </div>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  marginTop: '6px',
                                  color: textColorHeading,
                                  lineHeight: '1.3',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {st.label}
                              </div>
                              {st.desc && (
                                <div
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    marginTop: '4px',
                                    color: textColorMuted,
                                    lineHeight: '1.3',
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {st.desc}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div
                      className={`my-3 grid ${
                        block.stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                      } gap-2.5 sm:gap-3`}
                      style={{ breakInside: 'avoid', pageBreakInside: 'avoid', minHeight: 'auto' }}
                    >
                      {block.stats.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="rounded-xl border flex flex-col justify-between text-center transition-all p-2.5 px-2"
                          style={{
                            backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : `${primaryColor}08`,
                            borderColor: isDarkTheme ? `${accentColor}40` : `${primaryColor}25`,
                            minHeight: 'auto',
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid',
                            wordBreak: 'break-word',
                          }}
                        >
                          <div
                            className="font-black tracking-tight text-base sm:text-lg"
                            style={{
                              color: isDarkTheme ? '#FCD34D' : primaryColor,
                              fontFamily: fontHeading,
                              lineHeight: '1.2',
                              wordBreak: 'break-word',
                            }}
                          >
                            {st.value}
                          </div>
                          <div
                            className="font-bold uppercase tracking-wider mt-1 text-[9px]"
                            style={{
                              color: textColorHeading,
                              lineHeight: '1.3',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          >
                            {st.label}
                          </div>
                          {st.desc && (
                            <div
                              className="font-medium mt-1 text-slate-500 dark:text-slate-400 text-[8px]"
                              style={{
                                lineHeight: '1.3',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {st.desc}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* KPI Trending Block */}
                {block.type === 'kpi_trending' && block.stats && block.stats.length > 0 && (
                  isPdfExport ? (
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: '12px 0px',
                        margin: '14px 0',
                        tableLayout: 'fixed',
                        boxSizing: 'border-box',
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                      }}
                    >
                      <tbody>
                        <tr>
                          {block.stats.map((kpi, kIdx) => (
                            <td
                              key={kIdx}
                              style={{
                                width: `${100 / block.stats!.length}%`,
                                verticalAlign: 'top',
                                padding: '16px 14px',
                                borderRadius: '14px',
                                border: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.15)' : `${primaryColor}20`}`,
                                backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : `${primaryColor}06`,
                                boxSizing: 'border-box',
                                breakInside: 'avoid',
                                pageBreakInside: 'avoid',
                              }}
                            >
                              <div style={{ display: 'table', width: '100%', marginBottom: '6px' }}>
                                <div
                                  style={{
                                    display: 'table-cell',
                                    verticalAlign: 'middle',
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    color: textColorMuted,
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {kpi.label}
                                </div>
                                <div
                                  style={{
                                    display: 'table-cell',
                                    verticalAlign: 'middle',
                                    textAlign: 'right',
                                    width: '24px',
                                  }}
                                >
                                  <span style={{ color: '#10B981', fontWeight: 900, fontSize: '14px' }}>▲</span>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: '28px',
                                  fontWeight: 900,
                                  fontFamily: fontHeading,
                                  color: isDarkTheme ? '#FCD34D' : primaryColor,
                                  lineHeight: '1.2',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {kpi.value}
                              </div>
                              {kpi.desc && (
                                <div
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    marginTop: '4px',
                                    color: textColorMuted,
                                    lineHeight: '1.3',
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {kpi.desc}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div
                      className={`my-3 grid ${
                        block.stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                      } gap-2.5 sm:gap-3`}
                      style={{ breakInside: 'avoid', pageBreakInside: 'avoid', minHeight: 'auto' }}
                    >
                      {block.stats.map((kpi, kIdx) => (
                        <div
                          key={kIdx}
                          className="rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden p-3"
                          style={{
                            backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : `${primaryColor}06`,
                            borderColor: isDarkTheme ? 'rgba(255,255,255,0.15)' : `${primaryColor}20`,
                            minHeight: 'auto',
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid',
                            wordBreak: 'break-word',
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="font-black uppercase tracking-wider text-[9px]"
                              style={{ color: textColorMuted, wordBreak: 'break-word' }}
                            >
                              {kpi.label}
                            </span>
                            <span
                              className="p-1 rounded-full text-emerald-500 bg-emerald-500/10 inline-flex items-center justify-center shrink-0"
                              title="Indicador positivo"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                lineHeight: '1',
                              }}
                            >
                              <TrendingUp className="w-3 h-3" />
                            </span>
                          </div>
                          <div
                            className="font-black tracking-tight text-base sm:text-lg"
                            style={{
                              color: isDarkTheme ? '#FCD34D' : primaryColor,
                              fontFamily: fontHeading,
                              lineHeight: '1.2',
                              wordBreak: 'break-word',
                            }}
                          >
                            {kpi.value}
                          </div>
                          {kpi.desc && (
                            <div
                              className="font-medium mt-1 text-slate-500 dark:text-slate-400 text-[9px]"
                              style={{
                                lineHeight: '1.3',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {kpi.desc}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* Process Timeline / Roadmap Flow Block */}
                {block.type === 'process_timeline' && (
                  isPdfExport ? (
                    <div
                      style={{
                        width: '100%',
                        margin: '14px 0',
                        padding: '16px 18px',
                        borderRadius: '16px',
                        border: `1px solid ${borderColorSubtle}`,
                        backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.04)' : cardBg,
                        boxSizing: 'border-box',
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: textColorHeading,
                          marginBottom: '12px',
                          wordBreak: 'break-word',
                        }}
                      >
                        ◆ {String(block.content || 'Fluxo de Execução e Fases:')}
                      </div>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'separate',
                          borderSpacing: '10px 0px',
                          tableLayout: 'fixed',
                          boxSizing: 'border-box',
                        }}
                      >
                        <tbody>
                          <tr>
                            {parseListItems(block.content).slice(0, 3).map((flowStep, fIdx) => (
                              <td
                                key={fIdx}
                                style={{
                                  width: '33.33%',
                                  verticalAlign: 'top',
                                  padding: '14px 14px',
                                  borderRadius: '12px',
                                  border: `1px solid ${fIdx === 0 ? accentColor : borderColorSubtle}`,
                                  backgroundColor: isDarkTheme ? 'rgba(0,0,0,0.25)' : '#ffffff',
                                  boxSizing: 'border-box',
                                  breakInside: 'avoid',
                                  pageBreakInside: 'avoid',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: isDarkTheme ? '#FCD34D' : primaryColor,
                                    lineHeight: '1.2',
                                    marginBottom: '6px',
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  Fase 0{fIdx + 1}
                                </div>
                                <div
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    lineHeight: '1.4',
                                    color: textColorBody,
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                  }}
                                >
                                  {flowStep}
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div
                      className="my-3 p-3 rounded-2xl border space-y-2.5"
                      style={{
                        backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.04)' : cardBg,
                        borderColor: borderColorSubtle,
                        minHeight: 'auto',
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                        wordBreak: 'break-word',
                      }}
                    >
                      <div
                        className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-[10px] mb-1.5"
                        style={{ color: textColorHeading, wordBreak: 'break-word' }}
                      >
                        <Layers className="text-blue-500 w-3 h-3" />
                        <span>{String(block.content || 'Fluxo de Execução e Fases:')}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {parseListItems(block.content).slice(0, 3).map((flowStep, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 text-[10px]"
                            style={{
                              backgroundColor: isDarkTheme ? 'rgba(0,0,0,0.25)' : '#ffffff',
                              borderColor: fIdx === 0 ? accentColor : borderColorSubtle,
                              minHeight: 'auto',
                              breakInside: 'avoid',
                              pageBreakInside: 'avoid',
                              wordBreak: 'break-word',
                            }}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span
                                className="text-[10px] font-black uppercase tracking-wider"
                                style={{
                                  color: isDarkTheme ? '#FCD34D' : primaryColor,
                                  lineHeight: '1.2',
                                }}
                              >
                                Fase 0{fIdx + 1}
                              </span>
                              {fIdx < 2 && <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />}
                            </div>
                            <p
                              className="font-medium leading-tight"
                              style={{
                                color: textColorBody,
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                lineHeight: '1.4',
                              }}
                            >
                              {flowStep}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Badge Features / Strategic Highlights */}
                {block.type === 'badge_features' && (
                  <div
                    style={{
                      width: '100%',
                      margin: '14px 0',
                      padding: isPdfExport ? '16px 20px' : '12px 16px',
                      borderRadius: '16px',
                      border: `1px solid ${borderColorSubtle}`,
                      backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.04)' : `${primaryColor}06`,
                      boxSizing: 'border-box',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      minHeight: 'auto',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: isPdfExport ? '13px' : '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: textColorHeading,
                        marginBottom: '10px',
                        wordBreak: 'break-word',
                      }}
                    >
                      🛡 PONTOS ESTRATÉGICOS DE DESTAQUE:
                    </div>

                    <div style={{ boxSizing: 'border-box' }}>
                      {parseListItems(block.content).map((bItem, bIdx) => (
                        <div
                          key={bIdx}
                          style={{
                            display: 'inline-block',
                            margin: '4px 6px 4px 0',
                            padding: isPdfExport ? '6px 12px' : '4px 10px',
                            borderRadius: '8px',
                            border: `1px solid ${isDarkTheme ? `${accentColor}50` : `${primaryColor}30`}`,
                            backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : '#ffffff',
                            color: textColorHeading,
                            fontSize: isPdfExport ? '13px' : '10px',
                            fontWeight: 700,
                            lineHeight: '1.4',
                            verticalAlign: 'middle',
                            boxSizing: 'border-box',
                            wordBreak: 'break-word',
                          }}
                        >
                          <span style={{ color: isDarkTheme ? '#34D399' : '#059669', marginRight: '6px', fontWeight: 900 }}>✓</span>
                          {bItem}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Bar Charts Block (PRO) */}
                {block.type === 'chart_bars' && block.chartItems && block.chartItems.length > 0 && (
                  <div
                    style={{
                      width: '100%',
                      margin: '14px 0',
                      padding: isPdfExport ? '16px 18px' : '12px 14px',
                      borderRadius: '16px',
                      border: `1px solid ${borderColorSubtle}`,
                      backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.04)' : cardBg,
                      boxSizing: 'border-box',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      minHeight: 'auto',
                    }}
                  >
                    {block.content && (
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: isPdfExport ? '13px' : '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: textColorHeading,
                          marginBottom: '12px',
                          wordBreak: 'break-word',
                        }}
                      >
                        📊 {String(block.content)}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isPdfExport ? '12px' : '8px' }}>
                      {block.chartItems.map((item, cIdx) => (
                        <div key={cIdx} style={{ width: '100%' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '5px',
                              fontSize: isPdfExport ? '13px' : '11px',
                              fontWeight: 700,
                            }}
                          >
                            <span style={{ color: textColorHeading }}>{item.label}</span>
                            <span style={{ color: primaryColor, fontWeight: 900 }}>
                              {item.valueStr || `${item.percentage}%`}
                            </span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: isPdfExport ? '10px' : '7px',
                              borderRadius: '9999px',
                              backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(Math.max(item.percentage, 5), 100)}%`,
                                height: '100%',
                                borderRadius: '9999px',
                                backgroundColor: primaryColor,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Radial / Circle Metrics Block (PRO) */}
                {block.type === 'circle_metrics' && block.chartItems && block.chartItems.length > 0 && (
                  <div
                    style={{
                      width: '100%',
                      margin: '14px 0',
                      padding: isPdfExport ? '16px 18px' : '12px 14px',
                      borderRadius: '16px',
                      border: `1px solid ${borderColorSubtle}`,
                      backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.04)' : cardBg,
                      boxSizing: 'border-box',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      minHeight: 'auto',
                    }}
                  >
                    {block.content && (
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: isPdfExport ? '13px' : '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: textColorHeading,
                          marginBottom: '12px',
                          wordBreak: 'break-word',
                        }}
                      >
                        🎯 {String(block.content)}
                      </div>
                    )}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.min(block.chartItems.length, 3)}, 1fr)`,
                        gap: '12px',
                        textAlign: 'center',
                      }}
                    >
                      {block.chartItems.map((item, mIdx) => (
                        <div
                          key={mIdx}
                          style={{
                            padding: '12px 8px',
                            borderRadius: '12px',
                            border: `1px solid ${isDarkTheme ? `${accentColor}40` : `${primaryColor}20`}`,
                            backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.04)' : `${primaryColor}06`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: isPdfExport ? '22px' : '16px',
                              fontWeight: 900,
                              color: isDarkTheme ? '#FCD34D' : primaryColor,
                              fontFamily: fontHeading,
                            }}
                          >
                            {item.valueStr || `${item.percentage}%`}
                          </div>
                          <div
                            style={{
                              fontSize: isPdfExport ? '12px' : '10px',
                              fontWeight: 700,
                              color: textColorHeading,
                              marginTop: '4px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comparison Table Block (PRO) */}
                {block.type === 'comparison_table' && block.tableData && block.tableData.headers && (
                  <div
                    style={{
                      width: '100%',
                      margin: '14px 0',
                      borderRadius: '14px',
                      border: `1px solid ${borderColorSubtle}`,
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      minHeight: 'auto',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', boxSizing: 'border-box' }}>
                      <thead>
                        <tr style={{ backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : `${primaryColor}12` }}>
                          {block.tableData.headers.map((h, hIdx) => (
                            <th
                              key={hIdx}
                              style={{
                                padding: isPdfExport ? '10px 14px' : '8px 10px',
                                textAlign: 'left',
                                fontWeight: 900,
                                fontSize: isPdfExport ? '12px' : '10px',
                                textTransform: 'uppercase',
                                color: textColorHeading,
                                borderBottom: `1px solid ${borderColorSubtle}`,
                                wordBreak: 'break-word',
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(block.tableData.rows || []).map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            style={{
                              backgroundColor: rIdx % 2 === 0
                                ? (isDarkTheme ? 'rgba(255,255,255,0.02)' : '#ffffff')
                                : (isDarkTheme ? 'rgba(255,255,255,0.05)' : `${primaryColor}04`),
                            }}
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                style={{
                                  padding: isPdfExport ? '10px 14px' : '8px 10px',
                                  fontSize: isPdfExport ? '13px' : '11px',
                                  fontWeight: 500,
                                  color: textColorBody,
                                  borderBottom: rIdx < block.tableData!.rows.length - 1 ? `1px solid ${borderColorSubtle}` : 'none',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Image Block with proportional HD rendering (never stretched or squished) */}
                {((block.type === 'image' && (block.imageUrl || (block as any).image_url || (block as any).url || (block as any).illustration_id)) || block.imageUrl) && (() => {
                  const imgSrc = block.imageUrl || (block as any).image_url || (block as any).url || (block as any).illustration_id || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop";
                  const imgHeight = isPdfExport ? (is169 ? '180px' : is45 ? '220px' : '230px') : (is169 ? '150px' : is45 ? '200px' : '220px');

                  return (
                    <div
                      className="ebook-illustration-container"
                      style={{
                        width: '100%',
                        margin: '14px 0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `1px solid ${borderColorSubtle}`,
                        boxSizing: 'border-box',
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                        backgroundColor: isDarkTheme ? '#1e293b' : '#f8fafc',
                      }}
                    >
                      <div
                        className="ebook-illustration-box"
                        style={{
                          width: '100%',
                          height: imgHeight,
                          maxHeight: '240px',
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '12px',
                          backgroundImage: `url("${imgSrc}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      >
                        <img
                          className="ebook-illustration-img"
                          src={imgSrc}
                          alt="Ilustração do Ebook"
                          style={{
                            width: '100%',
                            height: imgHeight,
                            objectFit: 'cover',
                            objectPosition: 'center',
                            opacity: 0,
                            pointerEvents: 'none',
                            display: 'block',
                          }}
                          crossOrigin="anonymous"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop";
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Bar */}
      {isPdfExport ? (
        <div
          style={{
            display: 'table',
            width: '100%',
            tableLayout: 'fixed',
            borderTop: `1px solid ${borderColorSubtle}`,
            paddingTop: '16px',
            marginTop: '24px',
            color: textColorMuted,
            fontWeight: 700,
            fontSize: '13px',
            boxSizing: 'border-box',
            breakInside: 'avoid',
            pageBreakInside: 'avoid',
          }}
        >
          <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'middle', wordBreak: 'break-word' }}>
            {ebook.author}
          </div>
          <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'middle', width: '120px' }}>
            Página {page.pageNumber}
          </div>
        </div>
      ) : (
        <div
          className="border-t font-bold flex items-center justify-between pt-2 mt-4 text-[10px]"
          style={{ borderColor: borderColorSubtle, color: textColorMuted }}
        >
          <span>{ebook.author}</span>
          <span>Página {page.pageNumber}</span>
        </div>
      )}
    </div>
  );
};

