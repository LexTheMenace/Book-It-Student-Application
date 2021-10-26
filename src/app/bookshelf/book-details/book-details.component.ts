import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, Routes } from '@angular/router';
import { Book } from 'src/app/shared/book/Book.model';
import { BookshelfService } from '../bookshelf.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  book: Book;
  id: number;
  constructor(
    private route: ActivatedRoute,
    private bookshelfService: BookshelfService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.book = this.bookshelfService.getBookByIndex(this.id);
    });
  }
  onEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route});
  }

  onDelete(){
    this.bookshelfService.removeBook(this.id)
  }
}
