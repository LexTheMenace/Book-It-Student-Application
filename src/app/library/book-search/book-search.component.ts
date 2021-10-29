import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css'],
})
export class BookSearchComponent implements OnInit {
  query: string = '';
  constructor(private libraryService: LibraryService) {}

  ngOnInit(): void {}
  searchLibrary() {
    if(this.query.trim().length){
      this.libraryService.fetchBooks(this.query);
    }
    }
}
