import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Book } from '../shared/book/Book.model';
import { DataStorageService } from '../shared/data-storage.service';
import { BookshelfService } from './bookshelf.service';

@Injectable({
  providedIn: 'root'
})
export class BookshelfResolverService implements Resolve<Book[]> {

  constructor(private dataStorageService: DataStorageService, private bookshelfService: BookshelfService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const books = this.bookshelfService.getBooks();
    if(!books.length){
      return this.dataStorageService.fetchBooks();
    }
    return books;
  }
}
