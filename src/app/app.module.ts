import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';

import { BookDetailsComponent } from './bookshelf/book-details/book-details.component';
import { BookListComponent } from './bookshelf/book-list/book-list.component';
import { BookComponent } from './shared/book/book.component';
import { LibraryComponent } from './library/library.component';
import { BookSearchComponent } from './library/book-search/book-search.component';
import { BookResultsComponent } from './library/book-results/book-results.component';
import { DropdownDirective } from './shared/book/dropdown.directive';
import { HoverDirective } from './shared/hover.directive';
import { AppRoutingModule } from './app-routing.module';
import { BookshelfHomeComponent } from './bookshelf/bookshelf-home/bookshelf-home.component';
import { BookEditComponent } from './bookshelf/book-edit/book-edit.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BookshelfComponent,
    BookDetailsComponent,
    BookListComponent,
    BookComponent,
    LibraryComponent,
    BookSearchComponent,
    BookResultsComponent,
    DropdownDirective,
    HoverDirective,
    BookshelfHomeComponent,
    BookEditComponent,
    AuthComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
