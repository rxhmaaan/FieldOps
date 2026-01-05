import * as XLSX from 'xlsx';
import { TerminalRecord, SearchResult } from '@/types/terminal';

let cachedData: TerminalRecord[] | null = null;

function parseExcelDate(dateValue: unknown): Date | undefined {
  if (!dateValue) return undefined;

  if (typeof dateValue === 'number') {
    // Excel date serial number
    return new Date((dateValue - 25569) * 86400 * 1000);
  } else if (dateValue instanceof Date) {
    return dateValue;
  } else if (typeof dateValue === 'string' && dateValue.trim()) {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }
  return undefined;
}

type XlsxCellWithMeta = XLSX.CellObject & {
  // xlsx uses `l` for cell hyperlinks
  l?: { Target?: string; target?: string } | string;
  f?: string; // formula
  w?: string; // formatted text
  v?: unknown; // raw value
};

function normalizeUrl(url: unknown): string | undefined {
  if (typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.toLowerCase() === 'undefined') return undefined;
  return trimmed;
}

function extractUrlFromFormula(formula: string | undefined): string | undefined {
  if (!formula) return undefined;
  // Supports: HYPERLINK("https://...","label")
  const match = formula.match(/HYPERLINK\(\s*"([^"]+)"/i);
  return normalizeUrl(match?.[1]);
}

function extractUrlFromStringValue(value: unknown): string | undefined {
  const url = normalizeUrl(value);
  if (!url) return undefined;
  // Only treat as URL if it looks like one
  if (/^https?:\/\//i.test(url)) return url;
  return undefined;
}

function getDeliveryNoteUrl(
  worksheet: XLSX.WorkSheet,
  rowIndex: number,
  colIndex: number,
  rowValue: unknown
): string | undefined {
  const addr = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
  const cell = worksheet[addr] as XlsxCellWithMeta | undefined;

  // 1) Real Excel hyperlink relationship
  const l = cell?.l as any;
  const linkTarget =
    typeof l === 'string' ? l : (l?.Target as unknown) ?? (l?.target as unknown);
  const urlFromLink = normalizeUrl(linkTarget);

  // 2) Formula hyperlinks (HYPERLINK("url","label"))
  const urlFromFormula = extractUrlFromFormula(cell?.f);

  // 3) If the value itself is a URL
  const urlFromCellValue = extractUrlFromStringValue(cell?.v);
  const urlFromFormatted = extractUrlFromStringValue(cell?.w);
  const urlFromRowValue = extractUrlFromStringValue(rowValue);

  return urlFromLink || urlFromFormula || urlFromCellValue || urlFromFormatted || urlFromRowValue;
}

export async function loadTerminalData(): Promise<TerminalRecord[]> {
  // Clear cache to ensure fresh data load with new columns
  // TODO: Remove this after confirming data loads correctly
  cachedData = null;

  try {
    // Use import.meta.env.BASE_URL for GitHub Pages compatibility
    const basePath = import.meta.env.BASE_URL || '/';

    // Avoid stale browser caching of the XLSX when users update the file
    const response = await fetch(`${basePath}data/terminals.xlsx`, {
      cache: 'no-store',
    });

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    }) as unknown[][];

    if (jsonData.length < 2) {
      return [];
    }

    // Get headers from first row
    const headers = jsonData[0] as string[];
    console.log('Excel headers found:', headers);

    // Map column indices
    const colMap: Record<string, number> = {};
    const replacementCols: number[] = [];

    headers.forEach((header, idx) => {
      if (!header) return;

      // Normalize whitespace to avoid subtle header issues
      const normalized = String(header).toLowerCase().replace(/\s+/g, ' ').trim();

      if (normalized.includes('tid') || normalized === 'terminal id') {
        colMap['tid'] = idx;
      } else if (normalized.includes('serial')) {
        colMap['serialNo'] = idx;
      } else if (normalized.includes('city')) {
        colMap['city'] = idx;
      } else if (normalized.includes('model')) {
        colMap['currentModel'] = idx;
      } else if (normalized.includes('merchant')) {
        colMap['merchantNameMid'] = idx;
      } else if (normalized.includes('assignment')) {
        colMap['assignmentDate'] = idx;
      } else if (normalized.includes('installation')) {
        colMap['installationDate'] = idx;
      } else if (normalized.includes('replacement')) {
        replacementCols.push(idx);
      } else if (/\bdelivery\b/.test(normalized) && /\bnote\b/.test(normalized)) {
        colMap['deliveryNoteUrl'] = idx;
        console.log('Found Delivery Note column at index:', idx, 'Header:', header);
      }
    });

    console.log('Column mapping:', colMap);
    console.log('Replacement date columns:', replacementCols);

    // Parse data rows
    const records: TerminalRecord[] = [];

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as unknown[];
      if (!row || row.length === 0) continue;

      const tid = String(row[colMap['tid']] || '').trim();
      const serialNo = String(row[colMap['serialNo']] || '').trim();

      if (!tid && !serialNo) continue;

      // Parse assignment date
      const assignmentDate = parseExcelDate(row[colMap['assignmentDate']]) || new Date(0);

      // Parse installation date
      const installationDate = parseExcelDate(row[colMap['installationDate']]);

      // Parse replacement dates (only include valid dates)
      const replacementDates: Date[] = [];
      for (const colIdx of replacementCols) {
        const date = parseExcelDate(row[colIdx]);
        if (date) {
          replacementDates.push(date);
        }
      }
      // Sort replacement dates chronologically
      replacementDates.sort((a, b) => a.getTime() - b.getTime());

      // Delivery Note URL: supports actual hyperlinks + HYPERLINK() formulas + raw URLs
      const deliveryColIdx = colMap['deliveryNoteUrl'];
      const deliveryNoteUrl =
        deliveryColIdx !== undefined
          ? getDeliveryNoteUrl(worksheet, i, deliveryColIdx, row[deliveryColIdx])
          : undefined;

      records.push({
        tid,
        serialNo,
        city: String(row[colMap['city']] || '').trim(),
        currentModel: String(row[colMap['currentModel']] || '').trim(),
        merchantNameMid: String(row[colMap['merchantNameMid']] || '').trim(),
        assignmentDate,
        installationDate,
        replacementDates,
        deliveryNoteUrl,
      });
    }

    cachedData = records;
    return records;
  } catch (error) {
    console.error('Error loading terminal data:', error);
    return [];
  }
}

export function searchTerminals(data: TerminalRecord[], query: string): SearchResult | null {
  if (!query.trim()) {
    return null;
  }

  const normalizedQuery = query.trim().toUpperCase();

  // Find all matching records (by TID or Serial Number)
  const matches = data.filter(
    (record) => record.tid.toUpperCase() === normalizedQuery || record.serialNo.toUpperCase() === normalizedQuery
  );

  if (matches.length === 0) {
    return null;
  }

  // If we found by serial number, return that exact record
  const serialMatch = matches.find((r) => r.serialNo.toUpperCase() === normalizedQuery);
  if (serialMatch) {
    console.log('Search result (serial match):', {
      ...serialMatch,
      installationDate: serialMatch.installationDate?.toISOString(),
      replacementDates: serialMatch.replacementDates.map((d) => d.toISOString()),
      deliveryNoteUrl: serialMatch.deliveryNoteUrl,
    });
    return serialMatch;
  }

  // For TID matches, return the one with the latest assignment date
  const sortedMatches = matches.sort((a, b) => b.assignmentDate.getTime() - a.assignmentDate.getTime());

  const result = sortedMatches[0];
  console.log('Search result (TID match):', {
    ...result,
    installationDate: result.installationDate?.toISOString(),
    replacementDates: result.replacementDates.map((d) => d.toISOString()),
    deliveryNoteUrl: result.deliveryNoteUrl,
  });
  return result;
}

export function getDataStats(data: TerminalRecord[]): { totalRecords: number; uniqueTerminals: number } {
  const uniqueTids = new Set(data.map((r) => r.tid));
  return {
    totalRecords: data.length,
    uniqueTerminals: uniqueTids.size,
  };
}
