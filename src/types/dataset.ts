export class DatasetTypes {
  static MATCHES = "match";
  static PLAYER_STATS = "player_statistics";
}

export type DatasetType =  "match" | "player_statistics";

export interface Dataset {
  id: string;
  name: string;
  size: number;
  type: DatasetType;
  type_label: string;
  columns: string[];
  uploaded_at: string;
}
