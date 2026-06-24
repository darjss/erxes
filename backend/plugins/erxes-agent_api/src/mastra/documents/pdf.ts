import { createElement } from 'react';
import { Document, Page, renderToBuffer } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { markdownToPdfHtml, type DocumentChartRef } from './markdown';

// ---------------------------------------------------------------------------
// Markdown → HTML → PDF using @react-pdf/renderer (already a workspace dep) plus
// react-pdf-html's <Html> bridge. No headless browser, no native canvas. We
// build the element tree with React.createElement so the backend needs no JSX
// build step. Charts are embedded as PNG data URLs by markdownToHtmlDocument.
// ---------------------------------------------------------------------------

export async function renderPdfDocument(
  title: string,
  markdown: string,
  charts: DocumentChartRef[] = [],
): Promise<Buffer> {
  const html = markdownToPdfHtml(markdown, charts);

  const element = createElement(
    Document,
    { title },
    createElement(
      Page,
      { size: 'A4', style: { paddingTop: 48, paddingBottom: 56, paddingHorizontal: 48 } },
      createElement(Html, { children: html }),
    ),
  );

  // renderToBuffer accepts a Document element; the cast keeps us off `any`
  // while tolerating react-pdf-html's loose child typing.
  return renderToBuffer(element as Parameters<typeof renderToBuffer>[0]);
}
