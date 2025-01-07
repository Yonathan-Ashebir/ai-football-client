export interface Dataset {
  id: string;
  name: string;
  size: number;
  type: string;
  columns: string[];
  uploadDate: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}