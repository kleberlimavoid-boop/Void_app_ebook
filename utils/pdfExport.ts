import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ebook } from '../types';

// Global execution lock to strictly prevent duplicate simultaneous downloads
let isExportingPdfGlobalLock = false;

/**
 * Robust High-Definition PDF Generation and Direct File Downloader
 * 
 * Guarantees a physical .pdf file is downloaded directly to the user's device (single download).
 * Features:
 * 1. Isolated snapshot sandbox (794px x 1123px standard A4) to prevent responsive viewport distort.
 * 2. High-resolution canvas rasterization (scale 2.2 for razor sharp text without bloated filesize).
 * 3. Exact badge, checklist, typography, background-size cover, and gradient reproduction.
 * 4. Single, strictly debounced download trigger ensuring exactly 1 file is downloaded.
 */
export async function generateAndDownloadPdf(
  ebook: Ebook,
  containerPrefixOrProgress?: string | ((percent: number) => void),
  onProgress?: (percent: number) => void
): Promise<boolean> {
  if (isExportingPdfGlobalLock) {
    console.warn('[PDF Export] PDF generation already in progress, skipping duplicate call');
    return false;
  }
  isExportingPdfGlobalLock = true;

  const containerPrefix =
    typeof containerPrefixOrProgress === 'string'
      ? containerPrefixOrProgress
      : 'export-pdf-page-';

  const progressCallback =
    typeof containerPrefixOrProgress === 'function'
      ? containerPrefixOrProgress
      : onProgress;

  try {
    const is169 = ebook.aspectRatio === '16:9';
    const is45 = ebook.aspectRatio === '4:5';

    // Target dimensions in mm for PDF page
    const pdfWidthMm = is169 ? 297 : 210;
    const pdfHeightMm = is169 ? 210 : is45 ? 262 : 297;
    const orientation = is169 ? 'landscape' : 'portrait';

    // Target dimensions in px for snapshot rendering container
    const standardWidthPx = is169 ? 1123 : 794;
    const standardHeightPx = is169 ? 632 : is45 ? 992 : 1123;

    const totalPages = ebook.pages.length;
    if (totalPages === 0) return false;

    if (progressCallback) progressCallback(5);

    // Wait for document fonts to settle
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: [pdfWidthMm, pdfHeightMm],
      compress: true,
    });

    for (let i = 0; i < totalPages; i++) {
      // Look for the rendered page element by id
      const pageId = `${containerPrefix}${i}`;
      let pageEl = document.getElementById(pageId);

      // Fallback selectors
      if (!pageEl) {
        pageEl =
          document.getElementById(`direct-export-pdf-page-${i}`) ||
          document.getElementById(`export-pdf-page-${i}`) ||
          document.getElementById(`preview-page-${i}`);
      }

      if (!pageEl) {
        console.warn(`[PDF Export] Page element ${i} (${pageId}) not found, trying querySelector`);
        const allPages = document.querySelectorAll('.ebook-page, [id*="pdf-page-"]');
        if (allPages && allPages[i]) {
          pageEl = allPages[i] as HTMLElement;
        }
      }

      if (!pageEl) {
        console.error(`[PDF Export] Could not find DOM element for page ${i}`);
        continue;
      }

      // Create an isolated sandbox offscreen container to ensure exact desktop/A4 rendering
      const sandbox = document.createElement('div');
      sandbox.style.position = 'fixed';
      sandbox.style.left = '-9999px';
      sandbox.style.top = '0';
      sandbox.style.width = `${standardWidthPx}px`;
      sandbox.style.minWidth = `${standardWidthPx}px`;
      sandbox.style.maxWidth = `${standardWidthPx}px`;
      sandbox.style.height = `${standardHeightPx}px`;
      sandbox.style.minHeight = `${standardHeightPx}px`;
      sandbox.style.maxHeight = `${standardHeightPx}px`;
      sandbox.style.overflow = 'hidden';
      sandbox.style.zIndex = '-9999';
      sandbox.style.boxSizing = 'border-box';
      sandbox.style.backgroundColor = '#0f172a';

      const cloned = pageEl.cloneNode(true) as HTMLElement;
      cloned.style.width = `${standardWidthPx}px`;
      cloned.style.minWidth = `${standardWidthPx}px`;
      cloned.style.maxWidth = `${standardWidthPx}px`;
      cloned.style.height = `${standardHeightPx}px`;
      cloned.style.minHeight = `${standardHeightPx}px`;
      cloned.style.maxHeight = `${standardHeightPx}px`;
      cloned.style.display = 'flex';
      cloned.style.boxSizing = 'border-box';
      cloned.style.visibility = 'visible';
      cloned.style.opacity = '1';

      sandbox.appendChild(cloned);
      document.body.appendChild(sandbox);

      // Preload all regular images and background images in sandbox
      const imgs = Array.from(sandbox.querySelectorAll('img'));
      const bgElements = Array.from(sandbox.querySelectorAll<HTMLElement>('*')).filter(
        (el) => el.style.backgroundImage && el.style.backgroundImage.includes('url(')
      );
      const bgUrls = bgElements
        .map((el) => {
          const match = el.style.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
          return match ? match[1] : null;
        })
        .filter(Boolean) as string[];

      await Promise.all([
        ...imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalHeight !== 0) return resolve();
              img.crossOrigin = 'anonymous';
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        ),
        ...bgUrls.map(
          (url) =>
            new Promise<void>((resolve) => {
              const bgImg = new Image();
              bgImg.crossOrigin = 'anonymous';
              bgImg.onload = () => resolve();
              bgImg.onerror = () => resolve();
              bgImg.src = url;
            })
        ),
      ]);

      // Micro delay for layout settling
      await new Promise((resolve) => setTimeout(resolve, 80));

      // Capture high quality canvas
      const canvas = await html2canvas(cloned, {
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#0f172a',
        width: standardWidthPx,
        height: standardHeightPx,
        windowWidth: standardWidthPx,
        windowHeight: standardHeightPx,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * { box-sizing: border-box !important; }
            .badge, .checklist-item span { line-height: 1.2 !important; }
            .ebook-illustration-container { width: 100% !important; overflow: hidden !important; border-radius: 12px !important; margin: 14px 0 !important; }
            .ebook-illustration-box { width: 100% !important; height: 220px !important; background-size: cover !important; background-position: center center !important; background-repeat: no-repeat !important; border-radius: 12px !important; overflow: hidden !important; }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      // Cleanup sandbox
      if (document.body.contains(sandbox)) {
        document.body.removeChild(sandbox);
      }

      // Convert to JPEG for optimal file size and quality
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage([pdfWidthMm, pdfHeightMm], orientation);
      }

      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        pdfWidthMm,
        pdfHeightMm,
        undefined,
        'FAST'
      );

      const progress = Math.round(((i + 1) / totalPages) * 95);
      if (progressCallback) progressCallback(progress);
    }

    if (progressCallback) progressCallback(98);

    const rawTitle = (ebook.title || 'Ebook').trim();
    const sanitizedTitle = rawTitle.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 60);
    const fileName = `${sanitizedTitle || 'ebook'}.pdf`;

    // Strictly trigger a SINGLE download using standard Blob download
    try {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();

      setTimeout(() => {
        if (document.body.contains(downloadLink)) {
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobUrl);
      }, 3000);
    } catch {
      // Direct jsPDF fallback only if Blob creation failed
      pdf.save(fileName);
    }

    if (progressCallback) progressCallback(100);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    return false;
  } finally {
    // Release the global lock after a safety debounce interval
    setTimeout(() => {
      isExportingPdfGlobalLock = false;
    }, 2000);
  }
}

/**
 * Native Print dialog trigger
 */
export function printVectorPdf(): boolean {
  try {
    window.print();
    return true;
  } catch (err) {
    console.error('Print error:', err);
    return false;
  }
}
