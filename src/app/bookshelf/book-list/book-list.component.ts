import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/book/Book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  myBooks: Book[] = [
    new Book(
      'TypeScript Terror',
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
    new Book(
      'SQL',
    'Sir Code',
    'Horror',
    'https://source.unsplash.com/500x500/?nature'),

  ];
  content: string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
