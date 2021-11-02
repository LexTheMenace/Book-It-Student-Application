import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { BookDetailsComponent } from './bookshelf/book-details/book-details.component';
import { BookEditComponent } from './bookshelf/book-edit/book-edit.component';
import { BookshelfHomeComponent } from './bookshelf/bookshelf-home/bookshelf-home.component';
import { BookshelfResolverService } from './bookshelf/bookshelf-resolver.service';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { LibraryComponent } from './library/library.component';
const appRoutes: Routes = [
  { path: '', redirectTo: 'bookshelf', pathMatch: 'full' },
  {
    path: 'bookshelf',
    component: BookshelfComponent,
    children: [
      { path: '', component: BookshelfHomeComponent },
      { path: 'new', component: BookEditComponent },
      { path: ':id', component: BookDetailsComponent, resolve: [BookshelfResolverService] },
      { path: ':id/edit', component: BookEditComponent, resolve: [BookshelfResolverService] },
    ],
    canActivate: [AuthGuardService]
  },
  { path: 'auth', component: AuthComponent},
  { path: 'library', component: LibraryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
