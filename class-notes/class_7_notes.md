# Services and Dependency Injection

**The Goal:** Add some CRUD functionality to the application using services.

**Services:** 
  1. Library Service
  2. BookshelfService

### Adding the Services

1. Add the service files in the corresponding folders
  1. ex: Library service goes in library folder.
  2. Bare bones component example:
```typescript
  import { Injectable } from '@angular/core'

  @Injectable({
    providedIn: 'root';
  })
  export class LibraryService {

  }
``` 
2. This lets the program know the service is provided in the highest part of the chain, allowing the whole app to access it.

### Putting Things in the Service

**bookshelfService**
1. copy the myBooks array from the book-list.component.ts and paste it in the the bookshelf service class.
2. Delete the content within the array in the book-list.component.ts, but keep the array:
   ```typescript
   export class BookListComponent implements OnInit {
     myBooks: Book[] = []
     ...
   }
    
   ```
3. Import the BookshelfService from its location in the book-list.component.ts.
4. in the constructor add a reference to the service.
   ```typescript
    ...
    import { BookshelfService } from '../bookshelf.service';

    @Component({
      selector: 'app-book-list',
      templateUrl: './book-list.component.html',
      styleUrls: ['./book-list.component.css'],
    })
    export class BookListComponent implements OnInit {
      myBooks: Book[] = []
      ...

      constructor(private bookshelfService: BookshelfService) {}
    }
   ```
5. Within the ngOnInIt:
  ```typescript
    ngOnInit(): void {
    this.myBooks = this.bookshelfService.getBooks()
  }
  ```
6. Add getBooks() to the bookshelf service
  ```typescript
    export class BookshelfService {
      bookSelected = new EventEmitter<Book>();

      private myBooks: Book[] = [
        //all the books
      ];

      getBooks() {
        return this.myBooks;
      }
    }
  ```
7. Show results. It acts the same as it did before.

<br>

7. Add bookSelected EventEmitter to bookshelfService:
  ```typescript
    import { EventEmitter, Injectable } from '@angular/core';
    import { Book } from '../shared/book/book.model'

    @Injectable({
      providedIn: 'root'
    })
    export class BookshelfService {
      bookSelected = new EventEmitter<Book>();

      private myBooks: Book[] = [
        //All the books
      ];
    }

    //all the methods

  ```
8. In the book.component.ts, book-list.component.ts get rid of outputting event emitters.
9.  in the book.component.ts file add the bookshelfService reference in the constructor
10. In the onSelected method:
  ```typescript
    onSelected(){
    this.bookshelfService.bookSelected.emit(this.book);
  }
  ```
11. Remove the event listeners from all corresponding html files.
12. Add bookshelfService reference to the bookshelf.component.ts constructor
13. In the ngOnInit method add the bookSelected subscription.
  ```typescript
    export class BookshelfComponent implements OnInit {
      selectedBook: Book;

      constructor(private bookshelfService: BookshelfService) { }

      ngOnInit(): void {
        this.bookshelfService.bookSelected
          .subscribe(
            (book: Book) => {
              this.selectedBook = book
            }
          )
      } 
    }
  ```
14. The subscriber function defines how to obtain or generate values or messages to be published.
15. Show results. Should be the same as before, but using the services.

**libraryService**
1. Move the allBooks array, bookCol1, and bookCol2 into the library.service.ts
2. import the book model at the top from its location
3. Add an @Input for allBooks: Book[]
4. in the constructor add a reference for the library service.
5. In the ngOnInit set allBooks = this.libraryService.getBooks()
6. Make sure to add libraryService in between 'this' and 'allBooks' in the column forEach
7. Do the same for the pushes for both columns
8. This should display things as they were before.

**Adding Save and Delete Functions**
1. In the book-results.html add a button underneath the app-book tag
  1. class = "float-right"
  2. style = "border: none; font-size: 16px;"
  3. (click)="onSaveBook(bookEl)"
2. Within the button tag add an html entity for plus
3. In book-results.component.ts add onSaveBook(book: Book) {}
4. return a call for a bookshelf service named saveBook with the argumnet book
5. Go to bookshelfService add the function saveBook(book: Book)
6. push the book to the myBooks array
7. Remove slice from getBooks function.
  1. Should only say: return this.myBooks;
8. You should be able to add books from library to your saved books.
9. In the book-list.component.html add the same button beneath the app-book tag but change the plus to minus
10. Then change the click method to onRemoveBook(i)
11. Move the ngFor from the app-book tag to the outer div then add this:
 1. *ngFor="let bookEl of myBooks; let i = index"
12. Add the onRemoveBook(i){} in the book-list.component.ts
13. Within that call a removeBook(i) function from the bookshelfService.
14. In the bookshelfService add the removeBook(i){} function
15. within the function set a constant named 'index' set that equal to 'i'
16. create an if statement:
 1. if(index !== -1) {
       this.myBooks.splice(index, 1)
    }
17. This allows you to remove books from your saved section.