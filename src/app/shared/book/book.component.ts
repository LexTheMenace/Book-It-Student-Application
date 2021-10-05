
import { Component, Input, OnInit } from '@angular/core';
import { BookshelfService } from 'src/app/bookshelf/bookshelf.service';
import { Book } from './Book.model';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  @Input() book:Book;

  constructor(private _bookshelfService:BookshelfService) { }

  ngOnInit(): void {
  }

}
