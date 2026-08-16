import JSZip from 'jszip';
import { Ebook, EbookPage, EbookPageBlock } from '../types';
import { DIAGRAMATION_TEMPLATES, FONT_OPTIONS } from '../data/templates';

/**
 * Helper to safely escape XML / XHTML strings
 */
function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Fetch and convert an image URL to ArrayBuffer for native EPUB asset packaging
 */
async function fetchImageAsBinary(url: string): Promise<{ data: ArrayBuffer; mimeType: string } | null> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) return null;
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const mimeType = blob.type || (url.endsWith('.png') ? 'image/png' : 'image/jpeg');
    return { data: arrayBuffer, mimeType };
  } catch {
    return null;
  }
}

/**
 * Get Google Fonts import URL for chosen typography
 */
function getFontImportUrl(fontName?: string): string {
  const fontObj = FONT_OPTIONS.find((f) => f.name === fontName || f.value === fontName);
  if (fontObj && fontObj.name) {
    const cleanFamily = fontObj.name.replace(/\s+/g, '+');
    return `https://fonts.googleapis.com/css2?family=${cleanFamily}:wght@300;400;600;700;800;900&display=swap`;
  }
  return 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap';
}

/**
 * Generates the complete CSS stylesheet for the EPUB
 */
function generateEpubCss(ebook: Ebook): string {
  const tmpl =
    DIAGRAMATION_TEMPLATES.find((t) => t.id === ebook.template) ||
    DIAGRAMATION_TEMPLATES[0];

  const primaryColor = ebook.primaryColor || tmpl.primaryColor || '#2563eb';
  const accentColor = ebook.accentColor || tmpl.accentColor || '#f59e0b';
  const bgTone = tmpl.bgTone || '#FAFAFA';
  const cardBg = tmpl.cardBg || '#FFFFFF';
  const fontHeading = ebook.fontHeading || tmpl.fontHeading || 'Plus Jakarta Sans, sans-serif';
  const fontBody = ebook.fontBody || tmpl.fontBody || 'Plus Jakarta Sans, sans-serif';

  return `
@import url('${getFontImportUrl(ebook.fontHeading)}');
@import url('${getFontImportUrl(ebook.fontBody)}');

:root {
  --primary: ${primaryColor};
  --accent: ${accentColor};
  --bg-tone: ${bgTone};
  --card-bg: ${cardBg};
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-tone);
  color: var(--text-main);
  font-family: ${fontBody};
  font-size: 1em;
  line-height: 1.65;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

.page-container {
  padding: 2.5rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  page-break-after: always;
  background-color: var(--bg-tone);
}

.top-accent-bar {
  height: 4px;
  background: var(--primary);
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.6rem;
  margin-bottom: 1.8rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 0.6rem;
  margin-top: 2.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.page-number {
  font-weight: 800;
  color: var(--primary);
}

/* COVER PAGE */
.cover-page {
  background-color: var(--primary);
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem 2rem;
  text-align: center;
  box-sizing: border-box;
}

.cover-badge {
  display: inline-block;
  background-color: var(--accent);
  color: #ffffff;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.cover-title {
  font-family: ${fontHeading};
  font-size: 2.4rem;
  font-weight: 900;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.cover-divider {
  width: 60px;
  height: 4px;
  background-color: var(--accent);
  margin: 1.5rem auto;
  border-radius: 2px;
}

.cover-subtitle {
  font-size: 1.15rem;
  font-weight: 400;
  color: #e2e8f0;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  line-height: 1.5;
}

.cover-author {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #f8fafc;
  margin-top: auto;
  padding-top: 2rem;
}

.cover-image-container {
  margin: 1.5rem auto;
  max-width: 480px;
}

.cover-image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

/* TABLE OF CONTENTS */
.toc-title {
  font-family: ${fontHeading};
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 1.5rem;
}

.toc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  margin-bottom: 0.8rem;
}

.toc-badge {
  background-color: var(--primary);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  margin-right: 0.8rem;
}

.toc-chapter-name {
  font-weight: 700;
  flex: 1;
  color: var(--text-main);
}

.toc-page-num {
  font-weight: 800;
  color: var(--accent);
  font-size: 0.85rem;
}

/* CONTENT BLOCKS */
.chapter-heading {
  font-family: ${fontHeading};
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 1.2rem;
  line-height: 1.3;
}

.block-heading {
  font-family: ${fontHeading};
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
  margin-top: 1.4rem;
  margin-bottom: 0.6rem;
}

.block-subheading {
  font-family: ${fontHeading};
  font-size: 1.05rem;
  font-weight: 700;
  color: #334155;
  margin-top: 1.1rem;
  margin-bottom: 0.4rem;
}

.block-paragraph {
  margin-bottom: 1rem;
  color: #334155;
  text-align: justify;
  line-height: 1.7;
}

.block-callout {
  background-color: var(--card-bg);
  border-left: 4px solid var(--accent);
  border-top: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem 1.2rem;
  margin: 1.2rem 0;
  color: var(--text-main);
  font-size: 0.95rem;
}

.block-quote {
  background-color: var(--card-bg);
  border-left: 4px solid var(--primary);
  border-radius: 6px;
  padding: 1rem 1.4rem;
  margin: 1.4rem 0;
  font-style: italic;
  color: #1e293b;
  font-size: 1rem;
}

.block-key-takeaways {
  background-color: var(--card-bg);
  border: 1.5px solid var(--primary);
  border-radius: 10px;
  padding: 1.2rem 1.4rem;
  margin: 1.4rem 0;
}

.takeaways-badge {
  display: inline-block;
  background-color: var(--primary);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}

.takeaway-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
}

.takeaway-dot {
  color: var(--accent);
  font-size: 1.1rem;
  line-height: 1;
  margin-right: 0.5rem;
}

.block-list {
  margin: 1rem 0 1rem 1.2rem;
  color: #334155;
}

.block-list li {
  margin-bottom: 0.4rem;
  padding-left: 0.3rem;
}

.block-checklist {
  list-style: none;
  padding-left: 0;
  margin: 1rem 0;
}

.block-checklist li {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #334155;
}

.check-box-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: #f1f5f9;
  border: 1px solid var(--primary);
  color: var(--primary);
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  margin-right: 0.6rem;
  flex-shrink: 0;
}

.block-image {
  margin: 1.4rem auto;
  text-align: center;
  overflow: hidden;
  border-radius: 12px;
  width: 100%;
}

.block-image img {
  width: 100% !important;
  height: 220px !important;
  max-height: 240px !important;
  object-fit: cover !important;
  object-position: center !important;
  border-radius: 12px !important;
  display: block !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.image-caption {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
  margin-top: 0.4rem;
}

.block-stat-grid {
  display: flex;
  gap: 1rem;
  margin: 1.4rem 0;
}

.stat-card {
  flex: 1;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary);
  margin-bottom: 0.2rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}
`;
}

/**
 * Generates XHTML markup for a single e-book block
 */
function renderBlockToXhtml(block: EbookPageBlock, imageManifest: Map<string, string>): string {
  switch (block.type) {
    case 'heading':
      return `<h2 class="block-heading">${escapeXml(String(block.content || ''))}</h2>`;

    case 'subheading':
      return `<h3 class="block-subheading">${escapeXml(String(block.content || ''))}</h3>`;

    case 'paragraph': {
      const text = typeof block.content === 'string' ? block.content : (block.content || []).join(' ');
      return `<p class="block-paragraph">${escapeXml(text)}</p>`;
    }

    case 'callout': {
      const text = typeof block.content === 'string' ? block.content : (block.content || []).join(' ');
      return `<div class="block-callout">${escapeXml(text)}</div>`;
    }

    case 'quote': {
      const text = typeof block.content === 'string' ? block.content : (block.content || []).join(' ');
      return `<blockquote class="block-quote">“${escapeXml(text)}”</blockquote>`;
    }

    case 'key_takeaways':
    case 'badge_features': {
      const items = Array.isArray(block.content)
        ? block.content
        : String(block.content || '').split('\n').filter(Boolean);

      const itemsHtml = items
        .map(
          (it) => `
        <div class="takeaway-item">
          <span class="takeaway-dot">✦</span>
          <span>${escapeXml(it)}</span>
        </div>`
        )
        .join('');

      return `
      <div class="block-key-takeaways">
        <span class="takeaways-badge">Pontos-Chave</span>
        ${itemsHtml}
      </div>`;
    }

    case 'bullet_list': {
      const items = Array.isArray(block.content)
        ? block.content
        : String(block.content || '').split('\n').filter(Boolean);

      const itemsHtml = items.map((it) => `<li>${escapeXml(it)}</li>`).join('');
      return `<ul class="block-list">${itemsHtml}</ul>`;
    }

    case 'checklist': {
      const items = Array.isArray(block.content)
        ? block.content
        : String(block.content || '').split('\n').filter(Boolean);

      const itemsHtml = items
        .map(
          (it) => `
        <li>
          <span class="check-box-icon">✓</span>
          <span>${escapeXml(it)}</span>
        </li>`
        )
        .join('');

      return `<ul class="block-checklist">${itemsHtml}</ul>`;
    }

    case 'image': {
      if (block.imageUrl && imageManifest.has(block.imageUrl)) {
        const localPath = imageManifest.get(block.imageUrl);
        return `
        <div class="block-image">
          <img src="${localPath}" alt="Ilustração do E-book" />
        </div>`;
      }
      return '';
    }

    case 'stat_grid':
    case 'kpi_trending': {
      const stat1 = block.stats?.[0] || { value: '+85%', label: 'Eficiência' };
      const stat2 = block.stats?.[1] || { value: '10x', label: 'Retorno' };

      return `
      <div class="block-stat-grid">
        <div class="stat-card">
          <div class="stat-value">${escapeXml(stat1.value)}</div>
          <div class="stat-label">${escapeXml(stat1.label)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color: var(--accent);">${escapeXml(stat2.value)}</div>
          <div class="stat-label">${escapeXml(stat2.label)}</div>
        </div>
      </div>`;
    }

    default:
      if (block.content) {
        return `<p class="block-paragraph">${escapeXml(String(block.content))}</p>`;
      }
      return '';
  }
}

/**
 * Main EPUB Generator Engine: builds a 100% compliant EPUB 3 / EPUB 2 digital book
 */
export async function generateAndDownloadEpub(
  ebook: Ebook,
  onProgress?: (percent: number) => void
): Promise<boolean> {
  try {
    if (onProgress) onProgress(5);

    const zip = new JSZip();

    // 1. mimetype (MUST be first file, uncompressed STORE)
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    // 2. META-INF/container.xml
    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
    zip.file('META-INF/container.xml', containerXml);

    // 3. Preload all images and add them to OEBPS/images/
    const imageManifest = new Map<string, string>(); // url -> relative path
    const imageFiles: Array<{ id: string; href: string; mimeType: string }> = [];

    // Check cover image
    if (ebook.coverImageUrl) {
      const coverBin = await fetchImageAsBinary(ebook.coverImageUrl);
      if (coverBin) {
        const coverExt = coverBin.mimeType.includes('png') ? 'png' : 'jpg';
        const coverHref = `images/cover.${coverExt}`;
        zip.file(`OEBPS/${coverHref}`, coverBin.data);
        imageManifest.set(ebook.coverImageUrl, coverHref);
        imageFiles.push({ id: 'cover-image', href: coverHref, mimeType: coverBin.mimeType });
      }
    }

    // Check page blocks images
    let imgIdx = 1;
    for (const page of ebook.pages) {
      for (const block of page.blocks || []) {
        if (block.type === 'image' && block.imageUrl && !imageManifest.has(block.imageUrl)) {
          const bin = await fetchImageAsBinary(block.imageUrl);
          if (bin) {
            const ext = bin.mimeType.includes('png') ? 'png' : 'jpg';
            const href = `images/img_${imgIdx}.${ext}`;
            zip.file(`OEBPS/${href}`, bin.data);
            imageManifest.set(block.imageUrl, href);
            imageFiles.push({ id: `image-${imgIdx}`, href, mimeType: bin.mimeType });
            imgIdx++;
          }
        }
      }
    }

    if (onProgress) onProgress(25);

    // 4. Stylesheet
    const cssContent = generateEpubCss(ebook);
    zip.file('OEBPS/style.css', cssContent);

    // 5. Generate XHTML Pages
    const pageManifest: Array<{ id: string; href: string; title: string }> = [];

    for (let pIdx = 0; pIdx < ebook.pages.length; pIdx++) {
      const page = ebook.pages[pIdx];
      const pageNum = page.pageNumber || pIdx + 1;
      const fileId = `page_${pIdx + 1}`;
      const fileHref = `${fileId}.xhtml`;

      let bodyHtml = '';

      if (page.type === 'cover') {
        const coverLocalImg = ebook.coverImageUrl ? imageManifest.get(ebook.coverImageUrl) : null;
        bodyHtml = `
        <div class="cover-page">
          <div>
            <span class="cover-badge">Edição Exclusiva</span>
            <h1 class="cover-title">${escapeXml(ebook.title)}</h1>
            <div class="cover-divider"></div>
            ${ebook.subtitle ? `<p class="cover-subtitle">${escapeXml(ebook.subtitle)}</p>` : ''}
          </div>

          ${
            coverLocalImg
              ? `<div class="cover-image-container"><img src="${coverLocalImg}" alt="${escapeXml(ebook.title)}" /></div>`
              : ''
          }

          <div class="cover-author">Por: ${escapeXml(ebook.author || 'Autor')}</div>
        </div>`;
      } else if (page.type === 'toc') {
        const chapters = ebook.pages.filter(
          (p) => p.type !== 'cover' && p.type !== 'toc' && p.type !== 'back_cover'
        );

        const tocRows = chapters
          .map(
            (c, cIdx) => `
          <div class="toc-item">
            <span class="toc-badge">${String(cIdx + 1).padStart(2, '0')}</span>
            <span class="toc-chapter-name">${escapeXml(c.title || `Capítulo ${cIdx + 1}`)}</span>
            <span class="toc-page-num">Pág. ${String(c.pageNumber).padStart(2, '0')}</span>
          </div>`
          )
          .join('');

        bodyHtml = `
        <div class="page-container">
          <div class="top-accent-bar"></div>
          <div class="page-header">
            <span>${escapeXml(ebook.title)}</span>
            <span>Sumário</span>
          </div>
          <h2 class="toc-title">Sumário Executivo</h2>
          <div class="toc-list">
            ${tocRows}
          </div>
          <div class="page-footer">
            <span class="page-number">${String(pageNum).padStart(2, '0')}</span>
            <span>Guia Oficial • ${escapeXml(ebook.author || '')}</span>
          </div>
        </div>`;
      } else {
        const blocksHtml = (page.blocks || [])
          .map((b) => renderBlockToXhtml(b, imageManifest))
          .join('\n');

        bodyHtml = `
        <div class="page-container">
          <div class="top-accent-bar"></div>
          <div class="page-header">
            <span>${escapeXml(ebook.title)}</span>
            <span>${escapeXml(page.title || '')}</span>
          </div>

          ${page.title ? `<h1 class="chapter-heading">${escapeXml(page.title)}</h1>` : ''}

          <div class="page-content-flow">
            ${blocksHtml}
          </div>

          <div class="page-footer">
            <span class="page-number">${String(pageNum).padStart(2, '0')}</span>
            <span>${escapeXml(ebook.author || 'E-book Digital')}</span>
          </div>
        </div>`;
      }

      const fullPageXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="pt">
<head>
  <meta charset="utf-8" />
  <title>${escapeXml(page.title || ebook.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

      zip.file(`OEBPS/${fileHref}`, fullPageXhtml);
      pageManifest.push({
        id: fileId,
        href: fileHref,
        title: page.title || `Página ${pIdx + 1}`,
      });
    }

    if (onProgress) onProgress(60);

    // 6. Navigation Document (OEBPS/nav.xhtml for EPUB3)
    const navTocItems = pageManifest
      .map((p) => `<li><a href="${p.href}">${escapeXml(p.title)}</a></li>`)
      .join('\n');

    const navXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="pt">
<head>
  <meta charset="utf-8" />
  <title>Índice de Navegação</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Índice de Navegação</h1>
    <ol>
      ${navTocItems}
    </ol>
  </nav>
</body>
</html>`;
    zip.file('OEBPS/nav.xhtml', navXhtml);

    // 7. NCX Document (OEBPS/toc.ncx for EPUB2 / Kindle compatibility)
    const ncxNavPoints = pageManifest
      .map(
        (p, idx) => `
    <navPoint id="navPoint-${idx + 1}" playOrder="${idx + 1}">
      <navLabel><text>${escapeXml(p.title)}</text></navLabel>
      <content src="${p.href}"/>
    </navPoint>`
      )
      .join('\n');

    const ncxXml = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:ebook-${Date.now()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="${pageManifest.length}"/>
    <meta name="dtb:maxPageNumber" content="${pageManifest.length}"/>
  </head>
  <docTitle>
    <text>${escapeXml(ebook.title)}</text>
  </docTitle>
  <navMap>
    ${ncxNavPoints}
  </navMap>
</ncx>`;
    zip.file('OEBPS/toc.ncx', ncxXml);

    // 8. Package Document (OEBPS/content.opf)
    const manifestItems = [
      `<item id="style" href="style.css" media-type="text/css"/>`,
      `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
      `<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`,
      ...pageManifest.map((p) => `<item id="${p.id}" href="${p.href}" media-type="application/xhtml+xml"/>`),
      ...imageFiles.map((img) => `<item id="${img.id}" href="${img.href}" media-type="${img.mimeType}" ${img.id === 'cover-image' ? 'properties="cover-image"' : ''}/>`),
    ].join('\n    ');

    const spineItems = pageManifest
      .map((p) => `<itemref idref="${p.id}"/>`)
      .join('\n    ');

    const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">urn:uuid:ebook-${Date.now()}</dc:identifier>
    <dc:title>${escapeXml(ebook.title)}</dc:title>
    <dc:creator>${escapeXml(ebook.author || 'Autor')}</dc:creator>
    <dc:language>pt-BR</dc:language>
    <dc:description>${escapeXml(ebook.subtitle || ebook.title)}</dc:description>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
    ${imageFiles.find((i) => i.id === 'cover-image') ? '<meta name="cover" content="cover-image"/>' : ''}
  </metadata>
  <manifest>
    ${manifestItems}
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
  <guide>
    <reference type="toc" title="Sumário" href="page_2.xhtml"/>
    <reference type="cover" title="Capa" href="page_1.xhtml"/>
  </guide>
</package>`;
    zip.file('OEBPS/content.opf', contentOpf);

    if (onProgress) onProgress(85);

    // 9. Generate final EPUB binary blob and trigger browser download
    const blob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/epub+zip',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    if (onProgress) onProgress(100);

    const cleanTitle = (ebook.title || 'E-book').replace(/[^a-zA-Z0-9]/g, '_');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanTitle}.epub`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (err) {
    console.error('Error generating original EPUB:', err);
    return false;
  }
}
