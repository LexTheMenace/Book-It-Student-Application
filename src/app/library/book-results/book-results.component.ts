import { Component, OnInit } from '@angular/core';

import { BOOK_DATA } from 'bookData';

import { Book } from 'src/app/shared/book/Book.model';

@Component({
  selector: 'app-book-results',
  templateUrl: './book-results.component.html',
  styleUrls: ['./book-results.component.css']
})
export class BookResultsComponent implements OnInit {

  myBooks: Book[] = BOOK_DATA;
  
  constructor() { }

  ngOnInit(): void {

  }

}
