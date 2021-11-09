import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookshelfComponent } from './bookshelf.component';
import { BookshelfHomeComponent } from './bookshelf-home/bookshelf-home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { BookshelfRoutingModule } from './bookshelf-routing.module';

@NgModule({
  declarations: [
    BookshelfComponent,
    BookDetailsComponent,
    BookListComponent,
    BookshelfHomeComponent,
    BookEditComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, BookshelfRoutingModule],
  exports: [
    BookshelfComponent,
    BookDetailsComponent,
    BookListComponent,
    BookshelfHomeComponent,
    BookEditComponent,
  ],
})
export class BookshelfModule {}
