import { EventEmitter, Injectable } from '@angular/core';
import { BOOK_DATA } from 'bookData';
import { Subject } from 'rxjs';
import { Book } from '../shared/book/Book.model';

@Injectable({ providedIn: 'root' })
export class BookshelfService {
  private myBooks: Book[] = [
    {
      title: 'Coding Catastrophe',
      author: 'Sir Code-A-Lot',
      genre: 'Horror',
      coverImagePath: 'https://source.unsplash.com/500x500/?horror',
      price: 43.99
    },
    {
      title: 'JavaScript Secrets',
      author: 'Java Script Jr.',
      genre: 'Mystery',
      coverImagePath: 'https://source.unsplash.com/500x500/?mystery',
      price: 19.99
    },
    {
      title: 'The Life of Trees',
      author: 'Forrest Walker',
      genre: 'Nature',
      coverImagePath: 'https://source.unsplash.com/500x500/?trees',
      price: 9.99
    },
  ];


  booksSubject = new Subject<Book[]>();

  getBooks(){
    return this.myBooks.slice();
  }
  addBook(book: Book) {
    this.myBooks.push(book);
    this.booksSubject.next(this.getBooks())

  }

  removeBook(i: number) {
    this.myBooks.splice(i, 1);
    this.booksSubject.next(this.getBooks())
  }

  getBookByIndex(index: number) {
    return this.myBooks[index];
  }

  updateBook(book, index){
    this.myBooks[index] = book;
    this.booksSubject.next(this.getBooks())

  }
}
