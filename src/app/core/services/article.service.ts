import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Article, 
  ArticleCreate, 
  ArticleUpdate, 
  ArticleFilters, 
  ArticleResponse,
  Tag 
} from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // Ensure we have a valid API URL
    if (!environment.apiUrl) {
      console.error('API URL is not configured in environment');
      this.apiUrl = '/api'; // Fallback to a default
    } else {
      this.apiUrl = environment.apiUrl;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.detail) {
        errorMessage += `\nDetails: ${error.error.detail}`;
      }
    }
    
    console.error('ArticleService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Get articles with filters and pagination
  getArticles(filters: ArticleFilters = {}): Observable<ArticleResponse> {
    let queryParams: any = {
      page: filters.page || 1,
      per_page: filters.limit || 10,
      published_only: filters.published !== undefined ? filters.published : true
    };

    if (filters.search) {
      queryParams['search'] = filters.search;
    }

    if (filters.tags && filters.tags.length > 0) {
      queryParams['tag'] = filters.tags[0];
    }

    if (filters.order_by) {
      queryParams['sort_by'] = filters.order_by;
    }

    if (filters.order) {
      queryParams['sort_order'] = filters.order;
    }

    if (filters.featured !== undefined) {
      queryParams['featured'] = filters.featured;
    }

    return this.http.get<ArticleResponse>(`${this.apiUrl}/articles/`, { params: queryParams }).pipe(
      map(response => {
        console.log('Raw API response:', JSON.stringify(response, null, 2));
        return {
          ...response,
          items: response.items.map(article => {
            // Ensure tags is an array and transform each tag
            const tags = Array.isArray(article.tags) ? article.tags : [];
            const transformedTags = tags.map(tag => ({
              id: tag.id,
              name: tag.name,
              created_at: new Date(tag.created_at)
            }));

            return {
              ...article,
              created_at: new Date(article.created_at),
              updated_at: new Date(article.updated_at),
              published_at: article.published_at ? new Date(article.published_at) : null,
              tags: transformedTags
            };
          })
        };
      }),
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Get a single article by ID
  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${id}`).pipe(
      tap(article => console.log('Fetched article:', article)),
      catchError(this.handleError)
    );
  }

  // Create a new article
  createArticle(article: ArticleCreate): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles`, article).pipe(
      map(response => ({
        ...response,
        created_at: new Date(response.created_at),
        updated_at: new Date(response.updated_at),
        published_at: response.published_at ? new Date(response.published_at) : null,
        tags: response.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          created_at: new Date(tag.created_at)
        }))
      })),
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Update an existing article
  updateArticle(id: number, article: ArticleUpdate): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/articles/${id}`, article).pipe(
      map(response => ({
        ...response,
        created_at: new Date(response.created_at),
        updated_at: new Date(response.updated_at),
        published_at: response.published_at ? new Date(response.published_at) : null,
        tags: response.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          created_at: new Date(tag.created_at)
        }))
      })),
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Delete an article
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Get all tags
  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/tags`).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Create a new tag
  createTag(name: string): Observable<Tag> {
    return this.http.post<Tag>(`${environment.apiUrl}/tags`, { name }).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Get recent articles
  getRecentArticles(): Observable<Article[]> {
    return this.getArticles({ 
      limit: 3, 
      order_by: 'created_at', 
      order: 'desc',
      published: true 
    }).pipe(
      map(response => response.items)
    );
  }

  // Get latest published articles
  getLatestArticles(limit: number = 5): Observable<Article[]> {
    return this.getArticles({ 
      limit, 
      order_by: 'published_at', 
      order: 'desc',
      published: true 
    }).pipe(
      map(response => response.items)
    );
  }

  // Get related articles
  getRelatedArticles(articleId: number, limit: number = 3): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles/${articleId}/related`, {
      params: { limit }
    }).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Search articles
  searchArticles(query: string, limit: number = 5): Observable<Article[]> {
    return this.getArticles({ 
      search: query, 
      limit,
      published: true 
    }).pipe(
      map(response => response.items)
    );
  }

  // Toggle article featured status
  toggleFeatured(id: number): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/articles/${id}/featured`, {}).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Toggle article published status
  togglePublished(id: number): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/articles/${id}/published`, {}).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Upload article cover image
  uploadCoverImage(id: number, file: File): Observable<Article> {
    const formData = new FormData();
    formData.append('cover_image', file);
    return this.http.post<Article>(`${this.apiUrl}/articles/${id}/cover-image`, formData).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  // Calculate read time for an article
  calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}
