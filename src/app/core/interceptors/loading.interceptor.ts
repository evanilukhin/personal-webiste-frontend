import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Skip loading indicator for specific endpoints
  const skipLoading = [
    '/auth/refresh-token',
    '/auth/check-session'
  ].some(url => req.url.includes(url));

  if (!skipLoading) {
    loadingService.setLoading(req.url, true);
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.setLoading(req.url, false);
      }
    })
  );
};
