import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { ArticleEditorComponent } from './components/article-editor/article-editor.component';

export const ARTICLES_ROUTES: Routes = [
  {
    path: '',
    component: ArticleListComponent
  },
  {
    path: 'new',
    component: ArticleEditorComponent,
    canActivate: [authGuard]
  },
  {
    path: ':id',
    component: ArticleDetailComponent
  },
  {
    path: ':id/edit',
    component: ArticleEditorComponent,
    canActivate: [authGuard]
  }
];
