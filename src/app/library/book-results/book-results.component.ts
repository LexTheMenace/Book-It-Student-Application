import { Component, OnInit } from '@angular/core';

import { BOOK_DATA } from 'bookData';
import { BookshelfService } from 'src/app/bookshelf/bookshelf.service';

import { Book } from 'src/app/shared/book/Book.model';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-book-results',
  templateUrl: './book-results.component.html',
  styleUrls: ['./book-results.component.css']
})
export class BookResultsComponent implements OnInit {

  myBooks: Book[] = [];
  
  constructor(private _libraryService:LibraryService, private _bookshelfService:BookshelfService) { }

  ngOnInit(): void {
    this.myBooks = this._libraryService.myBooks
  }
  onAddBook(book:Book){
    this._bookshelfService.addBook(book);
  }

}
