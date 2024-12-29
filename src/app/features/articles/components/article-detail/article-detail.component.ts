import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarkdownModule } from 'ngx-markdown';
import { Observable } from 'rxjs';

import { ArticleService } from '../../../../core/services/article.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Article } from '../../../../core/models/article.model';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MarkdownModule
  ],
  template: `
    <div class="article-container">
      <!-- Loading State -->
      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Article Content -->
      <mat-card *ngIf="!loading && article" class="article-card">
        <!-- Cover Image -->
        <img *ngIf="article.coverImage"
             [src]="article.coverImage"
             [alt]="article.title"
             class="cover-image">

        <mat-card-header>
          <mat-card-title>{{ article.title }}</mat-card-title>
          <mat-card-subtitle>
            {{ article.createdAt | date }}
            · {{ article.readTime }} min read
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Tags -->
          <div class="tags-container">
            <mat-chip-listbox>
              <mat-chip *ngFor="let tag of article.tags">{{ tag }}</mat-chip>
            </mat-chip-listbox>
          </div>

          <!-- Summary -->
          <p class="summary">{{ article.summary }}</p>

          <!-- Content -->
          <div class="content">
            <markdown [data]="article.content"></markdown>
          </div>
        </mat-card-content>

        <!-- Admin Actions -->
        <mat-card-actions *ngIf="isAdmin$ | async">
          <button mat-button color="primary" (click)="editArticle()">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-button color="warn" (click)="deleteArticle()">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Error State -->
      <div class="error-state" *ngIf="!loading && !article">
        <p>Article not found</p>
        <button mat-raised-button color="primary" (click)="goBack()">
          Go Back
        </button>
      </div>
    </div>
  `,
  styles: [`
    .article-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .article-card {
      margin-bottom: 20px;
    }

    .cover-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 4px 4px 0 0;
    }

    .tags-container {
      margin: 16px 0;
    }

    .summary {
      font-size: 1.1em;
      line-height: 1.6;
      color: rgba(0, 0, 0, 0.7);
      margin: 16px 0;
      padding: 16px;
      background: rgba(0, 0, 0, 0.03);
      border-radius: 4px;
    }

    .content {
      margin-top: 24px;
      line-height: 1.7;
    }

    .error-state {
      text-align: center;
      padding: 40px;
      color: rgba(0, 0, 0, 0.54);
    }

    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 16px;
    }

    @media (max-width: 768px) {
      .cover-image {
        height: 200px;
      }
    }
  `]
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  loading = true;
  isAdmin$: Observable<boolean>;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.isAdmin$ = this.authService.isAdmin$;
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    this.loadArticle(slug);
  }

  loadArticle(slug: string): void {
    this.loading = true;
    this.articleService.getArticleBySlug(slug).subscribe({
      next: (article) => {
        this.article = article;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load article', 'Close', { duration: 5000 });
      }
    });
  }

  editArticle(): void {
    if (this.article) {
      this.router.navigate(['/articles', this.article.id, 'edit']);
    }
  }

  deleteArticle(): void {
    if (this.article && confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(this.article.id).subscribe({
        next: () => {
          this.snackBar.open('Article deleted', 'Close', { duration: 3000 });
          this.router.navigate(['/articles']);
        },
        error: () => {
          this.snackBar.open('Failed to delete article', 'Close', { duration: 5000 });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/articles']);
  }
}
