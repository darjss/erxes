import { IModels } from '~/connectionResolvers';

/**
 * Booking/activity export is not available in this service build (no booking models).
 * Returns a minimal CSV header when callers expect a string.
 */
export async function generateCSVExport(
  _models: IModels,
  providerId: string,
  _startDate?: Date,
  _endDate?: Date,
): Promise<string> {
  return `Provider ID,Note\n"${providerId}","Export requires full onefit booking module"\n`;
}

export async function generatePDFExport(
  models: IModels,
  providerId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<string> {
  const csvData = await generateCSVExport(
    models,
    providerId,
    startDate,
    endDate,
  );
  return `PDF export for provider ${providerId} — ${csvData.length} bytes`;
}
