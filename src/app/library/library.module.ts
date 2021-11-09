import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookResultsComponent } from './book-results/book-results.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { LibraryComponent } from './library.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LibraryRoutingModule } from './library-routing.module';



@NgModule({
  declarations: [
    LibraryComponent,
    BookSearchComponent,
    BookResultsComponent,
  ],
  imports: [
    CommonModule, FormsModule, SharedModule, LibraryRoutingModule
  ],
  exports: [
    LibraryComponent,
    BookSearchComponent,
    BookResultsComponent,
  ]
})
export class LibraryModule { }
