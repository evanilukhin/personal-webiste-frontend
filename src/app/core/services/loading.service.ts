import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMap = new Map<string, boolean>();

  isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  setLoading(url: string, loading: boolean): void {
    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSubject.next(true);
    } else {
      this.loadingMap.delete(url);
      this.loadingSubject.next(this.loadingMap.size > 0);
    }
  }
}
