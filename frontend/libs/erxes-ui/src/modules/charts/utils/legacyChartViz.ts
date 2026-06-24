import type { ChartSpec, ChartType } from '../types';

// Adapter for the legacy in-chat chart payload (the ```chart-viz``` fenced block
// that the old render-chart tool emitted). New conversations stream a chart
// artifact instead, but historical messages still carry these blocks — convert
// them to a ChartSpec so they render through the same ECharts surface.

const LEGACY_TYPES: ChartType[] = ['bar', 'line', 'area', 'pie'];

export function legacyPayloadToChartSpec(raw: unknown): ChartSpec | null {
  const payload = raw as
    | {
        chartType?: unknown;
        title?: unknown;
        description?: unknown;
        series?: unknown;
        data?: unknown;
      }
    | null
    | undefined;

  if (!payload || !Array.isArray(payload.series) || !Array.isArray(payload.data)) {
    return null;
  }

  const chartType = LEGACY_TYPES.includes(payload.chartType as ChartType)
    ? (payload.chartType as ChartType)
    : 'bar';

  const series = payload.series
    .filter(
      (s): s is { key: string; label?: string; color?: string } =>
        !!s && typeof (s as { key?: unknown }).key === 'string',
    )
    .map((s) => ({
      key: s.key,
      label: typeof s.label === 'string' ? s.label : s.key,
      color: typeof s.color === 'string' ? s.color : undefined,
    }));

  if (!series.length) return null;

  return {
    chartType,
    title: typeof payload.title === 'string' ? payload.title : 'Chart',
    description:
      typeof payload.description === 'string' ? payload.description : undefined,
    series,
    data: payload.data as ChartSpec['data'],
  };
}
