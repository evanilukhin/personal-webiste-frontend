import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { ArticleService } from '../../../../core/services/article.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Article, ArticleFilters } from '../../../../core/models/article.model';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSlideToggleModule
  ]
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  loading = false;
  error: string | null = null;
  totalArticles = 0;
  pageSize = 10;
  currentPage = 0;
  filterForm: FormGroup;
  isAdmin$: Observable<boolean>;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    console.log('ArticleListComponent constructor called');
    this.isAdmin$ = this.authService.isAdmin$;
    this.filterForm = this.formBuilder.group({
      published: [null],
      featured: [null]
    });
  }

  ngOnInit(): void {
    console.log('ArticleListComponent initialized');
    this.loadArticles();
  }

  loadArticles(): void {
    console.log('loadArticles called');
    console.log('Current state:', {
      loading: this.loading,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      filterForm: this.filterForm?.value
    });

    if (this.loading) {
      console.log('Already loading, skipping...');
      return; // Prevent multiple concurrent loads
    }
    
    this.loading = true;
    this.error = null;
    console.log('Starting to load articles...');
    
    try {
      // Create base filters with pagination
      const filters: ArticleFilters = {
        page: this.currentPage + 1, // Convert to 1-based page number
        limit: this.pageSize
      };
      
      // Add form filters if they have values
      const formValues = this.filterForm?.value || {};
      if (typeof formValues.published === 'boolean') {
        filters.published = formValues.published;
      }
      
      if (typeof formValues.featured === 'boolean') {
        filters.featured = formValues.featured;
      }

      console.log('Calling articleService.getArticles with filters:', filters);

      this.articleService.getArticles(filters).subscribe({
        next: (response) => {
          console.log('Articles response:', JSON.stringify(response, null, 2));
          if (response.items && response.items.length > 0) {
            console.log('First article:', JSON.stringify(response.items[0], null, 2));
            console.log('First article tags:', JSON.stringify(response.items[0].tags, null, 2));
          }
          this.articles = response.items || [];
          this.totalArticles = response.total || 0;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading articles:', error);
          this.articles = [];
          this.totalArticles = 0;
          this.loading = false;
          this.error = 'Failed to load articles. Please try again later.';
          this.snackBar.open(
            error.message || 'Error loading articles. Please try again later.',
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    } catch (error) {
      console.error('Error in loadArticles:', error);
      this.articles = [];
      this.totalArticles = 0;
      this.loading = false;
      this.error = 'An unexpected error occurred. Please try again later.';
      this.snackBar.open(
        'An unexpected error occurred. Please try again later.',
        'Close',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        }
      );
    }
  }

  loadArticlesSnakeCase(): void {
    this.loading = true;
    this.error = null;
    
    this.articleService.getArticles({
      page: this.currentPage,
      limit: this.pageSize,
      published: true
    }).subscribe({
      next: (response) => {
        console.log('Articles response:', response);
        console.log('First article tags:', response.items[0]?.tags);
        this.articles = response.items;
        this.totalArticles = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.error = 'Failed to load articles. Please try again later.';
        this.loading = false;
      }
    });
  }

  toggleFilter(filter: 'published' | 'featured'): void {
    const currentValue = this.filterForm.get(filter)?.value;
    this.filterForm.patchValue({ [filter]: currentValue === true ? null : true });
    this.currentPage = 0;
    this.loadArticles();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadArticles();
  }

  viewArticle(article: Article): void {
    this.router.navigate(['/articles', article.slug]);
  }

  editArticle(article: Article): void {
    this.router.navigate(['/articles', article.id, 'edit']);
  }

  togglePublished(article: Article): void {
    this.articleService.updateArticle(article.id, {
      published: !article.published
    }).subscribe({
      next: () => {
        article.published = !article.published;
        this.snackBar.open(
          `Article ${article.published ? 'published' : 'unpublished'}`,
          'Close',
          { duration: 3000 }
        );
      },
      error: () => {
        this.snackBar.open('Failed to update article', 'Close', { duration: 5000 });
      }
    });
  }

  deleteArticle(articleId: number): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(articleId).subscribe({
        next: () => {
          this.snackBar.open('Article deleted successfully', 'Close', { duration: 3000 });
          this.loadArticles();
        },
        error: (err) => {
          console.error('Error deleting article:', err);
          this.snackBar.open('Failed to delete article', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
