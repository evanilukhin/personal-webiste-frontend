import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="nav-toolbar">
      <button 
        mat-icon-button 
        (click)="mobileMenu.toggle()"
        class="mobile-menu-button">
        <mat-icon>menu</mat-icon>
      </button>

      <a routerLink="/" class="brand">Ivan Iliukhin</a>

      <div class="spacer"></div>

      <nav class="desktop-nav">
        <a mat-button routerLink="/articles" routerLinkActive="active">
          <mat-icon>article</mat-icon>
          <span>Articles</span>
        </a>
        <a mat-button routerLink="/about" routerLinkActive="active">
          <mat-icon>person</mat-icon>
          <span>About</span>
        </a>
      </nav>

      <span class="spacer"></span>

      <ng-container *ngIf="authService.isAuthenticated$ | async; else loginButton">
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
          <mat-icon>account_circle</mat-icon>
          <span class="user-email">{{ (authService.currentUser$ | async)?.email }}</span>
        </button>
        <mat-menu #userMenu="matMenu" class="user-menu">
          <ng-container *ngIf="authService.isAdmin$ | async">
            <a mat-menu-item routerLink="/articles/new">
              <mat-icon>post_add</mat-icon>
              <span>New Article</span>
            </a>
            <mat-divider></mat-divider>
          </ng-container>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </ng-container>
      
      <ng-template #loginButton>
        <a mat-button routerLink="/auth/login" class="login-button">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </a>
      </ng-template>
    </mat-toolbar>

    <mat-sidenav-container class="mobile-menu-container">
      <mat-sidenav #mobileMenu="matSidenav" mode="over" class="mobile-menu">
        <mat-nav-list>
          <a mat-list-item routerLink="/about" (click)="mobileMenu.close()">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>About</span>
          </a>
          <a mat-list-item routerLink="/articles" (click)="mobileMenu.close()">
            <mat-icon matListItemIcon>article</mat-icon>
            <span matListItemTitle>Articles</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <ng-container *ngIf="authService.isAdmin$ | async">
            <a mat-list-item routerLink="/articles/new" (click)="mobileMenu.close()">
              <mat-icon matListItemIcon>post_add</mat-icon>
              <span matListItemTitle>New Article</span>
            </a>
            <mat-divider></mat-divider>
          </ng-container>
          
          <ng-container *ngIf="authService.isAuthenticated$ | async; else mobileLoginButton">
            <button mat-list-item (click)="logout(); mobileMenu.close()">
              <mat-icon matListItemIcon>logout</mat-icon>
              <span matListItemTitle>Logout</span>
            </button>
          </ng-container>
          
          <ng-template #mobileLoginButton>
            <a mat-list-item routerLink="/auth/login" (click)="mobileMenu.close()">
              <mat-icon matListItemIcon>login</mat-icon>
              <span matListItemTitle>Login</span>
            </a>
          </ng-template>
        </mat-nav-list>
      </mat-sidenav>
    </mat-sidenav-container>
  `,
  styles: [`
    :host {
      display: block;
    }

    .nav-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background-color: #1e1e1e;
      color: rgba(255, 255, 255, 0.95);
      height: 64px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .brand {
      text-decoration: none;
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      margin-right: 24px;
      white-space: nowrap;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 8px;

      a {
        height: 36px;
        padding: 0 16px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        
        mat-icon {
          margin-right: 4px;
          opacity: 0.9;
        }
        
        span {
          margin-top: 2px;
        }
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    .active {
      background-color: rgba(255, 255, 255, 0.15) !important;
      color: #fff !important;
      
      mat-icon {
        opacity: 1 !important;
      }
    }

    .user-menu-button {
      height: 36px;
      color: #fff;
      font-weight: 500;
      padding: 0 12px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.1);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      
      mat-icon {
        margin-right: 8px;
        color: #fff;
      }
      
      .user-email {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.25px;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
    }

    .login-button {
      height: 36px;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      
      &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      mat-icon {
        margin-right: 4px;
        opacity: 0.9;
      }
    }

    .mobile-menu-button {
      display: none;
      color: rgba(255, 255, 255, 0.9);
      
      &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .mobile-menu-container {
      display: none;
    }

    .mobile-menu {
      width: 280px;
      background-color: #1e1e1e;
      
      .mat-nav-list {
        padding-top: 8px;
        
        a {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: #fff;
          }
          
          mat-icon {
            opacity: 0.9;
          }
        }
      }
    }

    ::ng-deep .user-menu {
      background-color: #1e1e1e;
      
      .mat-mdc-menu-content {
        padding: 8px 0;
      }
      
      .mat-mdc-menu-item {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        
        mat-icon {
          color: rgba(255, 255, 255, 0.9);
          margin-right: 8px;
        }
      }
    }

    @media (max-width: 768px) {
      .nav-toolbar {
        height: 56px;
        padding: 0 8px;
      }

      .brand {
        font-size: 18px;
        margin-right: 16px;
      }

      .desktop-nav {
        display: none;
      }

      .mobile-menu-button {
        display: block;
      }

      .mobile-menu-container {
        display: block;
      }

      .user-menu-button .user-email {
        display: none;
      }
    }
  `]
})
export class NavMenuComponent {
  @ViewChild('mobileMenu') mobileMenu!: MatSidenav;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
