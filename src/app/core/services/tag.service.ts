import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Tag } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/tags`;
  private tagsCache$: Observable<Tag[]> | null = null;

  constructor(private http: HttpClient) { }

  getTags(refresh = false): Observable<Tag[]> {
    if (!this.tagsCache$ || refresh) {
      this.tagsCache$ = this.http.get<Tag[]>(this.apiUrl).pipe(
        shareReplay(1),
        catchError(() => of([]))
      );
    }
    return this.tagsCache$;
  }

  searchTags(query: string): Observable<Tag[]> {
    return this.getTags().pipe(
      map(tags => tags.filter(tag => 
        tag.name.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  createTag(name: string): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl, { name }).pipe(
      catchError(error => {
        console.error('Error creating tag:', error);
        throw error;
      })
    );
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
