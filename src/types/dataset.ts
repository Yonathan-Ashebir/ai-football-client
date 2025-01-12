export type DatasetType = "match" | "player_statistics";

export const DatasetTypes: Record<string, DatasetType> = {
  MATCHES: "match",
  PLAYER_STATS: "player_statistics"
} as const

export interface Dataset {
  id: string;
  name: string;
  size: number;
  type: DatasetType;
  type_label: string;
  columns: string[];
  uploaded_at: string;
}
