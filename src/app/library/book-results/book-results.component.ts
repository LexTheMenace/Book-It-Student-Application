import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/book/Book.model';

@Component({
  selector: 'app-book-results',
  templateUrl: './book-results.component.html',
  styleUrls: ['./book-results.component.css']
})
export class BookResultsComponent implements OnInit {
  myBooks: Book[] = [
    new Book(
      'Terror',
    'Sir Code',
    'Horror',
    'https://source.unsplash.com/500x500/?mystery'),
    new Book(
      'JavaScript',
    'Sir Code',
    'Horror',
    'https://source.unsplash.com/500x500/?mystery'),
    new Book(
      'SQL',
    'Sir Code',
    'Horror',
    'https://source.unsplash.com/500x500/?nature'),

  ];
  constructor() { }

  ngOnInit(): void {
    const id = 3
    console.log(this.myBooks[id]);

  }

}
