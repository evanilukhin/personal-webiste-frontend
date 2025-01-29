import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './core/components/nav-menu/nav-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavMenuComponent
  ],
  template: `
    <div class="app-container mat-app-background mat-typography" [class.dark-theme]="true">
      <app-nav-menu></app-nav-menu>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #1a1a1a;
    }

    .main-content {
      flex: 1;
      padding: 84px 20px 20px; /* Increased top padding to account for navbar */
      background-color: #1a1a1a;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }

    .dark-theme {
      color: white;
      background-color: #1a1a1a;
    }

    /* Adjust padding for mobile screens */
    @media (max-width: 599px) {
      .main-content {
        padding-top: 76px; /* Adjust for smaller navbar on mobile */
      }
    }
  `]
})
export class AppComponent {
  title = 'frontend';
}
