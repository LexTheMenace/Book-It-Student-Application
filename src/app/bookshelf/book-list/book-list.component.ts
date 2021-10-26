
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BOOK_DATA } from 'bookData';

import { Book } from 'src/app/shared/book/Book.model';
import { BookshelfService } from '../bookshelf.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  myBooks: Book[];
  constructor(private _bookshelfService:BookshelfService) { }

  ngOnInit(): void {
    this.myBooks = this._bookshelfService.getBooks();

    this._bookshelfService.booksSubject.subscribe(books=>{
      this.myBooks = books;
    })
  }

  onRemoveBook(i:number){
    this._bookshelfService.removeBook(i);
  }
}
