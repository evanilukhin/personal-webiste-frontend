export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
