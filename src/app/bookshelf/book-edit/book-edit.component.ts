import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Book } from 'src/app/shared/book/Book.model';
import { BookshelfService } from '../bookshelf.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css'],
})
export class BookEditComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode = false;
  id: number;
  constructor(
    private route: ActivatedRoute,
    private bookshelfService: BookshelfService,
    private router: Router
  ) {}

  // initialize a property set to form group create a method called initForm [x]
  // create submit method [x]
  // cancel method []
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.isEditMode = true;
        // '0' -> 0
        this.id = +params['id'];
      }
    });

    this.initForm();
    console.log(this.bookForm);
  }

  initForm() {
    // editmode = false, i want to keep the values from the form empty


    let myBook = new Book("", "","","",0)
    if (this.isEditMode) {
      let book = this.bookshelfService.getBookByIndex(this.id);
      myBook = book
    }
    // <!-- title, author, price, genre, coverImagePath -->

    this.bookForm = new FormGroup({
      title: new FormControl(myBook.title, [Validators.required]),
      author: new FormControl(myBook.author, [Validators.required]),
      genre: new FormControl(myBook.genre, [Validators.required]),
      price: new FormControl(myBook.price, [Validators.required]),
      coverImagePath: new FormControl(myBook.coverImagePath, [Validators.required]),
    });
  }

  onSubmit() {
    // editmode = true -> udpate the book in the bookshelf service
    // editmode = false -> add the book to myBooks in booksheld Service

    if (this.isEditMode) {
      this.bookshelfService.updateBook(this.bookForm.value, this.id);
    } else {
      this.bookshelfService.addBook(this.bookForm.value);
    }
  }

  onCancel() {
    this.router.navigate(['/bookshelf'])
  }
}
