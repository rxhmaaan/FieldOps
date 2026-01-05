export interface TerminalRecord {
  tid: string;
  serialNo: string;
  city: string;
  currentModel: string;
  merchantNameMid: string;
  assignmentDate: Date;
  installationDate?: Date;
  replacementDates: Date[];
  deliveryNoteUrl?: string;
}

export interface SearchResult {
  tid: string;
  serialNo: string;
  city: string;
  currentModel: string;
  merchantNameMid: string;
  assignmentDate: Date;
  installationDate?: Date;
  replacementDates: Date[];
  deliveryNoteUrl?: string;
}
