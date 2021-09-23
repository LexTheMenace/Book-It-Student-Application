import { Component, OnInit } from '@angular/core';
import { BOOK_DATA } from 'bookData';
import { Book } from 'src/app/shared/book/Book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  myBooks: Book[] = BOOK_DATA;

  constructor() { }

  ngOnInit(): void {
    console.log(this.myBooks);

  }

}
