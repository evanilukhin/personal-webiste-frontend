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
    <div class="app-container">
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
      background-color: #fafafa;
    }

    .main-content {
      flex: 1;
      padding: 84px 20px 20px;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      position: relative;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 76px 16px 16px;
      }
    }
  `]
})
export class AppComponent {}
