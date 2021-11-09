import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookshelfHomeComponent } from './bookshelf-home/bookshelf-home.component';
import { BookshelfResolverService } from './bookshelf-resolver.service';
import { BookshelfComponent } from './bookshelf.component';
const appRoutes: Routes = [
  {
    path: '',
    component: BookshelfComponent,
    children: [
      { path: '', component: BookshelfHomeComponent },
      { path: 'new', component: BookEditComponent },
      { path: ':id', component: BookDetailsComponent, resolve: [BookshelfResolverService] },
      { path: ':id/edit', component: BookEditComponent, resolve: [BookshelfResolverService] },
    ],
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class BookshelfRoutingModule {}
