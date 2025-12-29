import * as XLSX from 'xlsx';
import { TerminalRecord, SearchResult } from '@/types/terminal';

let cachedData: TerminalRecord[] | null = null;

export async function loadTerminalData(): Promise<TerminalRecord[]> {
  if (cachedData) {
    return cachedData;
  }

  try {
    // Use import.meta.env.BASE_URL for GitHub Pages compatibility
    const basePath = import.meta.env.BASE_URL || '/';
    const response = await fetch(`${basePath}data/terminals.xlsx`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
    
    if (jsonData.length < 2) {
      return [];
    }

    // Get headers from first row
    const headers = jsonData[0] as string[];
    
    // Map column indices
    const colMap: Record<string, number> = {};
    headers.forEach((header, idx) => {
      const normalized = String(header).toLowerCase().trim();
      if (normalized.includes('tid') || normalized === 'terminal id') {
        colMap['tid'] = idx;
      } else if (normalized.includes('serial')) {
        colMap['serialNo'] = idx;
      } else if (normalized.includes('city')) {
        colMap['city'] = idx;
      } else if (normalized.includes('model') || normalized.includes('current model')) {
        colMap['currentModel'] = idx;
      } else if (normalized.includes('merchant') || normalized.includes('mid')) {
        colMap['merchantNameMid'] = idx;
      } else if (normalized.includes('date') || normalized.includes('assignment')) {
        colMap['assignmentDate'] = idx;
      }
    });

    // Parse data rows
    const records: TerminalRecord[] = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as unknown[];
      if (!row || row.length === 0) continue;
      
      const tid = String(row[colMap['tid']] || '').trim();
      const serialNo = String(row[colMap['serialNo']] || '').trim();
      
      if (!tid && !serialNo) continue;
      
      // Parse date - Excel dates are numbers
      let assignmentDate: Date;
      const dateValue = row[colMap['assignmentDate']];
      
      if (typeof dateValue === 'number') {
        // Excel date serial number
        assignmentDate = new Date((dateValue - 25569) * 86400 * 1000);
      } else if (dateValue instanceof Date) {
        assignmentDate = dateValue;
      } else if (typeof dateValue === 'string') {
        assignmentDate = new Date(dateValue);
      } else {
        assignmentDate = new Date(0);
      }
      
      records.push({
        tid,
        serialNo,
        city: String(row[colMap['city']] || '').trim(),
        currentModel: String(row[colMap['currentModel']] || '').trim(),
        merchantNameMid: String(row[colMap['merchantNameMid']] || '').trim(),
        assignmentDate,
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
  const matches = data.filter(record => 
    record.tid.toUpperCase() === normalizedQuery || 
    record.serialNo.toUpperCase() === normalizedQuery
  );
  
  if (matches.length === 0) {
    return null;
  }
  
  // If we found by serial number, return that exact record
  const serialMatch = matches.find(r => r.serialNo.toUpperCase() === normalizedQuery);
  if (serialMatch) {
    return serialMatch;
  }
  
  // For TID matches, return the one with the latest assignment date
  const sortedMatches = matches.sort((a, b) => 
    b.assignmentDate.getTime() - a.assignmentDate.getTime()
  );
  
  return sortedMatches[0];
}

export function getDataStats(data: TerminalRecord[]): { totalRecords: number; uniqueTerminals: number } {
  const uniqueTids = new Set(data.map(r => r.tid));
  return {
    totalRecords: data.length,
    uniqueTerminals: uniqueTids.size,
  };
}
