import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/book/Book.model';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
@Input() book:Book;
  constructor() { }

  ngOnInit(): void {
  }

}
