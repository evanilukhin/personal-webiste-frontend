import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <!-- Main Footer -->
        <div class="footer-main">
          <!-- About Section -->
          <div class="footer-section">
            <h3>About</h3>
            <p>
              Personal website showcasing articles, projects, and professional experience
              in software development and technical writing.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="footer-section">
            <h3>Quick Links</h3>
            <nav class="footer-links">
              <a routerLink="/">Home</a>
              <a routerLink="/articles">Articles</a>
              <a routerLink="/about">About</a>
            </nav>
          </div>

          <!-- Connect -->
          <div class="footer-section">
            <h3>Connect</h3>
            <div class="social-links">
              <a href="https://github.com/yourusername" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 mat-icon-button
                 matTooltip="GitHub">
                <mat-icon svgIcon="github"></mat-icon>
              </a>
              <a href="https://linkedin.com/in/yourusername" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 mat-icon-button
                 matTooltip="LinkedIn">
                <mat-icon svgIcon="linkedin"></mat-icon>
              </a>
              <a href="https://twitter.com/yourusername" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 mat-icon-button
                 matTooltip="Twitter">
                <mat-icon svgIcon="twitter"></mat-icon>
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div class="footer-bottom">
          <div class="copyright">
            © {{ currentYear }} Your Name. All rights reserved.
          </div>
          <div class="legal-links">
            <a routerLink="/privacy">Privacy Policy</a>
            <span class="separator">•</span>
            <a routerLink="/terms">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #2c3e50;
      color: #ecf0f1;
      padding: 3rem 0 1.5rem;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .footer-main {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section {
      h3 {
        color: #3498db;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        font-weight: 500;
      }

      p {
        line-height: 1.6;
        margin: 0;
        opacity: 0.8;
      }
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      a {
        color: #ecf0f1;
        text-decoration: none;
        opacity: 0.8;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 1;
          color: #3498db;
        }
      }
    }

    .social-links {
      display: flex;
      gap: 0.5rem;

      a {
        color: #ecf0f1;
        opacity: 0.8;
        transition: all 0.2s ease;

        &:hover {
          opacity: 1;
          color: #3498db;
          transform: translateY(-2px);
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid rgba(236, 240, 241, 0.1);
      padding-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      opacity: 0.8;

      .legal-links {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        a {
          color: #ecf0f1;
          text-decoration: none;
          transition: color 0.2s ease;

          &:hover {
            color: #3498db;
          }
        }

        .separator {
          color: #3498db;
        }
      }
    }

    @media (max-width: 768px) {
      .footer {
        padding: 2rem 0 1rem;
      }

      .footer-main {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        text-align: center;
      }

      .footer-links {
        align-items: center;
      }

      .social-links {
        justify-content: center;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;

        .legal-links {
          justify-content: center;
        }
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
