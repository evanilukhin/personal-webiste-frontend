import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { MarkdownModule } from 'ngx-markdown';

import { ArticleService } from '../../../../core/services/article.service';
import { Article, Tag } from '../../../../core/models/article.model';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MarkdownModule
  ],
  template: `
    <div class="editor-container">
      <mat-card class="editor-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit' : 'Create' }} Article</mat-card-title>
        </mat-card-header>

        <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

        <form [formGroup]="articleForm" (ngSubmit)="onSubmit()">
          <mat-card-content>
            <!-- Title -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter article title">
              <mat-error *ngIf="articleForm.get('title')?.errors?.['required']">
                Title is required
              </mat-error>
            </mat-form-field>

            <!-- Summary -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Summary</mat-label>
              <textarea matInput formControlName="summary" rows="3"
                        placeholder="Enter a brief summary"></textarea>
              <mat-error *ngIf="articleForm.get('summary')?.errors?.['required']">
                Summary is required
              </mat-error>
            </mat-form-field>

            <!-- Content -->
            <div class="content-container">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Content</mat-label>
                <textarea matInput formControlName="content" rows="20"
                          placeholder="Write your article in Markdown"></textarea>
                <mat-error *ngIf="articleForm.get('content')?.errors?.['required']">
                  Content is required
                </mat-error>
              </mat-form-field>

              <!-- Markdown Preview -->
              <div class="preview-container">
                <h3>Preview</h3>
                <button mat-button (click)="togglePreview()">Toggle Preview</button>
                <markdown *ngIf="previewMode" [data]="articleForm.get('content')?.value"></markdown>
              </div>
            </div>

            <!-- Tags -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tags</mat-label>
              <input type="text" [formControl]="tagCtrl" [matAutocomplete]="auto">
              <mat-autocomplete #auto="matAutocomplete">
                <mat-option *ngFor="let tag of filteredTags$ | async" [value]="tag">
                  {{ tag.name }}
                </mat-option>
              </mat-autocomplete>
              <mat-chip-grid #chipGrid aria-label="Tag selection">
                <mat-chip-row *ngFor="let tag of selectedTags"
                             (removed)="removeTag(tag)">
                  {{tag.name}}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
              </mat-chip-grid>
            </mat-form-field>

            <!-- Cover Image URL -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cover Image URL</mat-label>
              <input matInput formControlName="cover_image" 
                     placeholder="Enter image URL">
            </mat-form-field>

            <!-- Published Toggle -->
            <div class="toggle-container">
              <mat-slide-toggle formControlName="published" color="primary">
                {{ articleForm.get('published')?.value ? 'Published' : 'Draft' }}
              </mat-slide-toggle>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button type="button" (click)="goBack()">
              Cancel
            </button>
            <button mat-raised-button color="primary" type="submit"
                    [disabled]="!articleForm.valid || loading">
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </mat-card-actions>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .editor-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .editor-card {
      position: relative;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .content-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 16px;
    }

    .preview-container {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 16px;
      overflow-y: auto;
      max-height: 500px;
    }

    .toggle-container {
      margin-bottom: 16px;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px;
    }

    @media (max-width: 768px) {
      .content-container {
        grid-template-columns: 1fr;
      }

      .preview-container {
        max-height: 300px;
      }
    }
  `]
})
export class ArticleEditorComponent implements OnInit {
  articleForm: FormGroup;
  loading = false;
  isEditMode = false;
  articleId?: number;
  saving = false;
  error: string | null = null;
  previewMode = false;
  
  // Tags
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  selectedTags: Tag[] = [];
  allTags: Tag[] = [];
  filteredTags$: Observable<Tag[]>;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      cover_image: [''],
      published: [false]
    });

    this.filteredTags$ = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | Tag | null) => {
        if (value === null) {
          return this.allTags;
        }
        const searchStr = typeof value === 'string' ? value : value.name;
        return this._filterTags(searchStr);
      })
    );
  }

  ngOnInit(): void {
    // Load available tags
    this.articleService.getTags().subscribe({
      next: (tags) => {
        this.allTags = tags;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
      }
    });

    // Load article if in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.articleId = +params['id'];
        this.loadArticle();
      }
    });
  }

  private loadArticle(): void {
    if (!this.articleId) return;

    this.loading = true;
    this.articleService.getArticle(this.articleId).subscribe({
      next: (article) => {
        this.articleForm.patchValue({
          title: article.title,
          summary: article.summary,
          content: article.content,
          cover_image: article.cover_image,
          published: article.published
        });
        this.selectedTags = article.tags;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading article:', error);
        this.error = 'Failed to load article';
        this.loading = false;
      }
    });
  }

  togglePreview(): void {
    this.previewMode = !this.previewMode;
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      this.saving = true;
      const formValue = this.articleForm.value;
      
      const article: any = {
        title: formValue.title,
        summary: formValue.summary,
        content: formValue.content,
        published: formValue.published,
        cover_image: formValue.cover_image,
        tag_ids: this.selectedTags.map(tag => tag.id)
      };

      const request = this.isEditMode
        ? this.articleService.updateArticle(this.articleId!, article)
        : this.articleService.createArticle(article);

      request.subscribe({
        next: () => {
          this.saving = false;
          this.snackBar.open(
            `Article ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/articles']);
        },
        error: (error) => {
          console.error('Error saving article:', error);
          this.error = 'Failed to save article';
          this.saving = false;
        }
      });
    }
  }

  addTag(event: any): void {
    const tag = event.option.value as Tag;
    if (!this.selectedTags.find(t => t.id === tag.id)) {
      this.selectedTags.push(tag);
    }
    this.tagCtrl.setValue('');
  }

  removeTag(tag: Tag): void {
    const index = this.selectedTags.findIndex(t => t.id === tag.id);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  goBack(): void {
    this.router.navigate(['/articles']);
  }

  private _filterTags(value: string): Tag[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => 
      tag.name.toLowerCase().includes(filterValue)
    );
  }

  displayFn(tag: Tag): string {
    return tag ? tag.name : '';
  }
}
