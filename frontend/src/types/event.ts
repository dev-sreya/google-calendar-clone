export interface Event {
  id: number;
  title: string;
  description?: string;
  start_time: string; // ISO 8601 datetime string
  end_time: string;   // ISO 8601 datetime string
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface EventCreate {
  title: string;
  description?: string;
  start_time: string; // ISO 8601 datetime string
  end_time: string;   // ISO 8601 datetime string
  color?: string;
}

export interface EventUpdate {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  color?: string;
}
