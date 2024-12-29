import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Auth interceptor called for:', req.url);
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    console.log('Adding auth token to request');
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq).pipe(
      tap({
        next: (event) => {
          console.log('Auth interceptor response:', event);
        },
        error: (error) => {
          console.error('Auth interceptor error:', error);
        }
      })
    );
  }

  console.log('No auth token found, proceeding with request');
  return next(req).pipe(
    tap({
      next: (event) => {
        console.log('Auth interceptor response:', event);
      },
      error: (error) => {
        console.error('Auth interceptor error:', error);
      }
    })
  );
};
