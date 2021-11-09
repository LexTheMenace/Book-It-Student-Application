import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LibraryComponent } from './library/library.component';
const appRoutes: Routes = [
  { path: '', redirectTo: 'bookshelf', pathMatch: 'full' },
  {
    path: 'auth', loadChildren: ()=> import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'library', loadChildren: ()=> import('./library/library.module').then(m=>m.LibraryModule)
  },
  {
    path: 'bookshelf', loadChildren: ()=> import('./bookshelf/bookshelf.module').then(m=>m.BookshelfModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
