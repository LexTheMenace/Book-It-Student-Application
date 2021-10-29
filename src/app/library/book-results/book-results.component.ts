import { Component, OnInit } from '@angular/core';

import { BOOK_DATA } from 'bookData';
import { Observable } from 'rxjs';
import { BookshelfService } from 'src/app/bookshelf/bookshelf.service';

import { Book } from 'src/app/shared/book/Book.model';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-book-results',
  templateUrl: './book-results.component.html',
  styleUrls: ['./book-results.component.css'],
})
export class BookResultsComponent implements OnInit {
  myBooks: Observable<Book[]>;
  loading: Observable<boolean>;

  constructor(
    private _libraryService: LibraryService,
    private _bookshelfService: BookshelfService
  ) {}

  ngOnInit(): void {
    this.myBooks = this._libraryService.bookSub;
    this.loading = this._libraryService.loadingSub;
  }
  onAddBook(book: Book) {
    this._bookshelfService.addBook(book);
  }
}
