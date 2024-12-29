import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <div class="toolbar-content">
        <div class="left-section">
          <a mat-button routerLink="/" class="home-link">
            <span class="site-title">My Website</span>
          </a>
          <nav class="nav-links">
            <a mat-button routerLink="/articles" routerLinkActive="active">Articles</a>
            <a mat-button routerLink="/about" routerLinkActive="active">About</a>
          </nav>
        </div>

        <div class="right-section">
          <ng-container *ngIf="auth.isAuthenticated$ | async; else loginButton">
            <button mat-button [matMenuTriggerFor]="userMenu">
              <mat-icon>account_circle</mat-icon>
              Admin
            </button>
            <mat-menu #userMenu="matMenu">
              <a mat-menu-item routerLink="/articles/new">
                <mat-icon>add</mat-icon>
                <span>New Article</span>
              </a>
              <button mat-menu-item (click)="auth.logout()">
                <mat-icon>exit_to_app</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-container>
          <ng-template #loginButton>
            <a mat-button routerLink="/auth/login">
              <mat-icon>login</mat-icon>
              Login
            </a>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .left-section,
    .right-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .home-link {
      text-decoration: none;
      color: inherit;
    }

    .site-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      margin-left: 16px;
    }

    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 600px) {
      .site-title {
        font-size: 1rem;
      }

      .nav-links {
        margin-left: 8px;
      }

      .toolbar-content {
        padding: 0 8px;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
}
