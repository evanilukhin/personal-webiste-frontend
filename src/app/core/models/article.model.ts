import { Time } from "@angular/common";

export interface Tag {
  id: number;
  name: string;
  created_at: Date;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  published: boolean;
  featured: boolean;
  cover_image: string | null;
  reading_time: number | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  author_id: number;
  tags: Tag[];
}

export interface ArticleCreate {
  title: string;
  content: string;
  summary?: string;
  published?: boolean;
  featured?: boolean;
  cover_image?: string;
  reading_time?: number;
  tag_ids?: number[];
}

export interface ArticleUpdate extends Partial<ArticleCreate> {}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
  order_by?: 'created_at' | 'published_at' | 'title';
  order?: 'asc' | 'desc';
}

export interface ArticleResponse {
  items: Article[];
  total: number;
  page: number;
  total_pages: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginationParams {
  page: number;
  per_page: number;
  search?: string;
  tag?: string;
  featured?: boolean;
  published?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
