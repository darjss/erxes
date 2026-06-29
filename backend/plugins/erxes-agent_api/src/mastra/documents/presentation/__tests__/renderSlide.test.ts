import { renderSlidePng } from '../renderSlide';
import { renderPptxDocument } from '~/mastra/documents/pptx';
import { RENDER_SCALE, SLIDE_H, SLIDE_W } from '../theme';
import type { DocumentChartRef } from '~/mastra/documents/markdown';

// Each slide is a real Satori + resvg (+ echarts) render, so allow generous
// time — a full 40-slide deck rasterises many images.
jest.setTimeout(120_000);

// PNG signature + IHDR width/height live at fixed offsets — enough to assert the
// raster is a real PNG of the expected @2x dimensions without an image lib.
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function pngInfo(buf: Buffer): { ok: boolean; width: number; height: number } {
  return {
    ok: buf.length > 8 && buf.subarray(0, 8).equals(PNG_SIG),
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

const SAMPLE_SLIDE = `
<div class="slide">
  <div class="accent-bar mb-md"></div>
  <div class="h1">Quarterly Review · Өсөлтийн тойм</div>
  <div class="bullets mt-lg">
    <div class="bullet"><span class="dot"></span><span>Net revenue retention 118%</span></div>
    <div class="bullet"><span class="dot"></span><span>Onboarding cut to 6 days</span></div>
  </div>
</div>`;

const CHART: DocumentChartRef = {
  id: 'rev',
  spec: {
    chartType: 'bar',
    title: 'Revenue',
    series: [{ key: 'rev', label: 'Revenue' }],
    data: [
      { label: 'Q1', rev: 10 },
      { label: 'Q2', rev: 24 },
      { label: 'Q3', rev: 31 },
    ],
  },
};

const CHART_SLIDE = `
<div class="slide">
  <div class="h2 mb-md">Revenue by segment</div>
  <div class="row grow gap-lg items-center">
    <div class="grow body">Enterprise overtook SMB this quarter.</div>
    <div class="grow2"><div class="chart-frame"><img class="chart" src="chart:rev"></div></div>
  </div>
</div>`;

describe('renderSlidePng', () => {
  it('renders a non-empty PNG at the expected @2x dimensions', async () => {
    const png = await renderSlidePng(SAMPLE_SLIDE);
    const info = pngInfo(png);
    expect(info.ok).toBe(true);
    expect(png.length).toBeGreaterThan(1000);
    expect(info.width).toBe(SLIDE_W * RENDER_SCALE);
    expect(info.height).toBe(SLIDE_H * RENDER_SCALE);
  });

  it('substitutes a chart:ID reference with the rendered chart image', async () => {
    const withChart = await renderSlidePng(CHART_SLIDE, [CHART]);
    const withoutChart = await renderSlidePng(CHART_SLIDE, []);
    expect(pngInfo(withChart).ok).toBe(true);
    // The embedded chart adds real pixels, so the raster is meaningfully larger
    // than the same slide with the reference stripped.
    expect(withChart.length).toBeGreaterThan(withoutChart.length);
  });

  it('does not throw on empty / messy input', async () => {
    const png = await renderSlidePng('<div class="slide"><script>x</script></div>');
    expect(pngInfo(png).ok).toBe(true);
  });
});

describe('renderPptxDocument', () => {
  it('returns a .pptx buffer plus one PNG per slide', async () => {
    const slides = [{ html: SAMPLE_SLIDE }, { html: CHART_SLIDE }];
    const { pptx, slidePngs } = await renderPptxDocument('Deck', slides, [CHART]);
    // .pptx is a ZIP — starts with "PK".
    expect(pptx.subarray(0, 2).toString('ascii')).toBe('PK');
    expect(pptx.length).toBeGreaterThan(1000);
    expect(slidePngs).toHaveLength(slides.length);
    for (const png of slidePngs) expect(pngInfo(png).ok).toBe(true);
  });

  it('caps the deck at 40 slides', async () => {
    const many = Array.from({ length: 45 }, () => ({ html: SAMPLE_SLIDE }));
    const { slidePngs } = await renderPptxDocument('Big', many);
    expect(slidePngs).toHaveLength(40);
  });
});
