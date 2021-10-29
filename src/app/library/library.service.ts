import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../shared/book/Book.model';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  myBooks: Book[] = [];
  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject(false);
  bookSub: BehaviorSubject<Book[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {}

  fetchBooks(query: string) {
    this.loadingSub.next(true);
    this.bookSub.next([]);

    const formattedQuery = query.split(' ').join('+');

    this.http
      .get(`https://openlibrary.org/search.json?q=${formattedQuery}`)
      .pipe(
        map((responseData: any) => {
          const books = [];
          responseData.docs.map((book) => {
            const { author_name, title, isbn, first_publishing_year } = book;
            const newBook = new Book(
              title,
              author_name ? author_name[0] : '',
              '',
              '',
              0,
              first_publishing_year,
              isbn ? isbn[0] : ''
            );
            books.push(newBook);
          });
          return books;
        })
      )
      .subscribe((books) => {
        this.bookSub.next(books)
        this.loadingSub.next(false);
      });
  }
}
