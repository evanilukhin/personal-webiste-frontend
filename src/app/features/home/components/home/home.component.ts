import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { ArticleService } from '../../../../core/services/article.service';
import { Article } from '../../../../core/models/article.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <h1>Welcome to My Personal Website</h1>
        <p class="subtitle">Senior Software Engineer & Technical Writer</p>
        <div class="hero-actions">
          <a mat-raised-button color="primary" routerLink="/articles">
            Read Articles
          </a>
          <a mat-stroked-button color="primary" routerLink="/about">
            About Me
          </a>
        </div>
      </section>

      <!-- Featured Articles Section -->
      <section class="featured-articles" *ngIf="featuredArticles$ | async as articles">
        <h2>Featured Articles</h2>
        <div class="articles-grid">
          <mat-card *ngFor="let article of articles" class="article-card">
            <mat-card-header>
              <mat-card-title>{{ article.title }}</mat-card-title>
              <mat-card-subtitle>
                {{ article.createdAt | date:'mediumDate' }}
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ article.summary }}</p>
              <mat-chip-set>
                <mat-chip *ngFor="let tag of article.tags">
                  {{ tag.name }}
                </mat-chip>
              </mat-chip-set>
            </mat-card-content>
            <mat-card-actions>
              <a mat-button color="primary" [routerLink]="['/articles', article.id]">
                Read More
                <mat-icon>arrow_forward</mat-icon>
              </a>
            </mat-card-actions>
          </mat-card>
        </div>
      </section>

      <!-- Latest Articles Link -->
      <section class="latest-articles-link">
        <a mat-raised-button color="accent" routerLink="/articles">
          View All Articles
          <mat-icon>article</mat-icon>
        </a>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 4rem;
      padding: 4rem 0;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 8px;

      h1 {
        font-size: 2.5rem;
        margin: 0 0 1rem;
        color: #2c3e50;
      }

      .subtitle {
        font-size: 1.25rem;
        color: #34495e;
        margin-bottom: 2rem;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        
        a {
          min-width: 150px;
        }
      }
    }

    .featured-articles {
      margin-bottom: 4rem;

      h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #2c3e50;
        text-align: center;
      }

      .articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .article-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease-in-out;

        &:hover {
          transform: translateY(-4px);
        }

        mat-card-content {
          flex-grow: 1;
          
          p {
            margin-bottom: 1rem;
          }
        }

        mat-card-actions {
          padding: 16px;
          margin: 0;
        }

        mat-chip-set {
          margin-top: 1rem;
        }
      }
    }

    .latest-articles-link {
      text-align: center;
      margin-top: 2rem;

      a {
        font-size: 1.1rem;
        padding: 0.5rem 2rem;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 2rem 1rem;

        h1 {
          font-size: 2rem;
        }

        .subtitle {
          font-size: 1.1rem;
        }

        .hero-actions {
          flex-direction: column;
          align-items: stretch;
        }
      }

      .featured-articles {
        .articles-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredArticles$: Observable<Article[]>;

  constructor(private articleService: ArticleService) {
    this.featuredArticles$ = this.articleService.getArticles({ featured: true }).pipe(
      map(response => response.items.slice(0, 3))
    );
  }

  ngOnInit(): void {}
}
