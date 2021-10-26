import { Component, OnInit } from '@angular/core';

import { Book } from '../shared/book/Book.model';
import { BookshelfService } from './bookshelf.service';


@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css']
})

export class BookshelfComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {

  }


}
