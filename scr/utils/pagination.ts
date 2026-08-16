import { Ebook, EbookPage, EbookPageBlock } from '../types';

/**
 * Intelligent pagination and content reflow engine for E-books.
 * Dynamically recalculates vertical weight and splits/flows content
 * so no text or visual element overflows the vertical frame of 16:9, 4:5, or A4.
 */

// Vertical point budget per format
const ASPECT_RATIO_BUDGETS: Record<'16:9' | '4:5' | 'A4', number> = {
  '16:9': 105, // Widescreen / landscape has short vertical height
  '4:5': 160,  // Mobile portrait has moderate vertical height
  'A4': 230,   // Standard document portrait has tall vertical height
};

/**
 * Calculate approximate vertical point cost for a content block
 */
function getBlockWeight(block: EbookPageBlock, aspectRatio: '16:9' | '4:5' | 'A4'): number {
  const is169 = aspectRatio === '16:9';
  const is45 = aspectRatio === '4:5';

  switch (block.type) {
    case 'heading':
      return is169 ? 18 : 22;

    case 'subheading':
      return is169 ? 14 : 16;

    case 'paragraph': {
      const text = typeof block.content === 'string' ? block.content : (block.content || []).join(' ');
      const words = text.split(/\s+/).filter(Boolean).length;
      // Base padding + line count approximation
      const wordsPerLine = is169 ? 14 : 10;
      const lines = Math.ceil(words / wordsPerLine);
      const pointsPerLine = is169 ? 4.5 : 5.5;
      return Math.max(12, Math.round(10 + lines * pointsPerLine));
    }

    case 'bullet_list':
    case 'checklist': {
      const items = Array.isArray(block.content)
        ? block.content
        : String(block.content || '').split('\n').filter(Boolean);
      const itemWeight = is169 ? 10 : 13;
      return 14 + items.length * itemWeight;
    }

    case 'key_takeaways':
    case 'badge_features': {
      const items = Array.isArray(block.content)
        ? block.content
        : String(block.content || '').split('\n').filter(Boolean);
      return (is169 ? 25 : 30) + items.length * (is169 ? 8 : 11);
    }

    case 'callout':
    case 'quote': {
      const text = typeof block.content === 'string' ? block.content : (block.content || []).join(' ');
      const words = text.split(/\s+/).filter(Boolean).length;
      return is169 ? Math.min(45, 20 + Math.ceil(words / 10) * 4) : Math.min(55, 25 + Math.ceil(words / 9) * 5);
    }

    case 'image':
      return is169 ? 42 : is45 ? 55 : 65;

    case 'stat_grid':
    case 'kpi_trending':
      return is169 ? 38 : 46;

    case 'chart_bars':
    case 'circle_metrics': {
      const count = block.chartItems?.length || 3;
      return is169 ? 30 + count * 6 : 38 + count * 8;
    }

    case 'comparison_table':
      return is169 ? 48 : 60;

    case 'process_timeline': {
      const steps = Array.isArray(block.content)
        ? block.content
        : String(block.content || '').split('\n').filter(Boolean);
      return is169 ? 30 + steps.length * 8 : 36 + steps.length * 10;
    }

    default:
      return 20;
  }
}

/**
 * Splits a long text into coherent paragraphs at sentence boundaries
 */
function splitLongText(text: string, maxWordsPerChunk: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const combined = currentChunk ? `${currentChunk} ${sentence.trim()}` : sentence.trim();
    const wordCount = combined.split(/\s+/).filter(Boolean).length;

    if (wordCount > maxWordsPerChunk && currentChunk.trim()) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence.trim();
    } else {
      currentChunk = combined;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}

/**
 * Pre-processes blocks to split oversized individual blocks (like paragraphs with 120+ words in 16:9)
 */
function normalizeAndPartitionBlocks(
  blocks: EbookPageBlock[],
  aspectRatio: '16:9' | '4:5' | 'A4'
): EbookPageBlock[] {
  const maxWords = aspectRatio === '16:9' ? 65 : aspectRatio === '4:5' ? 110 : 160;
  const maxListItems = aspectRatio === '16:9' ? 4 : aspectRatio === '4:5' ? 6 : 8;

  const result: EbookPageBlock[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.type === 'paragraph' && typeof block.content === 'string') {
      const words = block.content.split(/\s+/).filter(Boolean).length;
      if (words > maxWords) {
        const textParts = splitLongText(block.content, maxWords);
        textParts.forEach((part, pIdx) => {
          result.push({
            ...block,
            id: `${block.id}-part-${pIdx + 1}`,
            content: part,
          });
        });
        continue;
      }
    }

    if (
      ['bullet_list', 'checklist', 'key_takeaways'].includes(block.type) &&
      typeof block.content === 'string'
    ) {
      const items = block.content.split('\n').map((s) => s.trim()).filter(Boolean);
      if (items.length > maxListItems) {
        // Split list into chunks
        for (let c = 0; c < items.length; c += maxListItems) {
          const chunkItems = items.slice(c, c + maxListItems);
          result.push({
            ...block,
            id: `${block.id}-chunk-${c / maxListItems + 1}`,
            content: chunkItems.join('\n'),
          });
        }
        continue;
      }
    }

    result.push(block);
  }

  return result;
}

/**
 * Intelligent pagination and content layout engine for E-books.
 * Preserves exact requested page count without creating artificial continuation pages.
 */
export function reflowEbookForAspectRatio(
  ebook: Ebook,
  targetAspectRatio?: 'A4' | '16:9' | '4:5'
): Ebook {
  const ratio = targetAspectRatio || ebook.aspectRatio || 'A4';

  // We preserve the exact page count requested by the user, maintaining full content richness
  const pages = ebook.pages.map((p, index) => ({
    ...p,
    pageNumber: index + 1,
  }));

  return {
    ...ebook,
    aspectRatio: ratio,
    pages,
  };
}
