import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MarkdownModule
  ],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  loading = true;
  error: string | null = null;
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
    const id = Number(this.route.snapshot.params['id']);
    this.loadArticle(id);
  }

  loadArticle(id: number): void {
    this.loading = true;
    this.error = null;
    this.articleService.getArticle(id).subscribe({
      next: (article) => {
        this.article = article;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load article';
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
