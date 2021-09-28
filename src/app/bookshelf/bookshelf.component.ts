import { Component, OnInit } from '@angular/core';

import { Book } from '../shared/book/Book.model';


@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css']
})

export class BookshelfComponent implements OnInit {
  selectedBook: Book;
  constructor() { }

  ngOnInit(): void {
  }


}
