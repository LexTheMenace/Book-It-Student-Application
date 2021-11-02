import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { BookshelfService } from '../bookshelf/bookshelf.service';
import { Book } from './book/Book.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  bookApiUrl ='https://book-app-60c75-default-rtdb.firebaseio.com/books.json'
  constructor(private bookshelfService: BookshelfService, private http: HttpClient, private authService: AuthService) { }

  saveBooks(){
   const books = this.bookshelfService.getBooks();
   this.http.put(this.bookApiUrl, books).subscribe(
    res => console.log(res)
   )
  }

  fetchBooks(){

        return this.http.get<Book[]>(this.bookApiUrl).pipe(
          tap(books => this.bookshelfService.setBooks(books))
        )




  }
}
