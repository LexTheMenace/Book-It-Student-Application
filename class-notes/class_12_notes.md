# Class 12 - Making HTTP Requests & External API

---

## Class Outline

1. Learn about OpenLibrary API
2. Create a search bar form
3. Sending a request to our API
4. Updating our Book Model and Saving API Results
5. Populate Library Page with API Results

---

---

## HTTP Overview

- **HTTP** (Hyper-Text Transfer Protocol): The webs standard for transfering data between networked devises. A typical flow using HTTP involves a client/user making an HTTP Request to a server in order to get an HTTP Response of the pages HTML, CSS & JS.

- **API** (Application Programming Interface): A set of data or functions that is accessible to third-party developers. This allows companies or individuals to communicate with each other and leverage each other's data through documentation. API's are critical to learn as a developer... you will use them a lot!

- **CRUD** (Create | Read | Update | Delete): Every application usually needs to implement each of the CRUD properties. We do this by sending specific HTTP requests to a server.

- Angular never directly connects to a database because of security reasons. Everyone can view your front-end code.

- In order to connect to a database we send HTTP Requests and receive HTTP Responses from a server/api.

- An api is similar to a website that we can visit by going to a certain url, but instead of receiving HTML, we receive data... most likely in JSON format.

- We wont be creating API's but we can interact with them using HTTP. The server/api will have the functionality to talk with the database to upload files, authenticate users, and all of the applications CRUD functionality.

- To make an HTTP Request, you must define the URL (pointing to an API Endpoint) and an HTTP Verb (POST, GET, PUT, DELETE . . .). You most likely also need to send Headers (metadata) and a Body (data you are sending with your request).

- Angular Http methods automatically transforms your data to and from JSON. Usually we have to do this manually in javascript with JSON.stringify() and JSON.parse().

- Angular Http methods will return an Observable you can subscribe to.

- You can view your network requests by going into Chrome Dev Tools and navigating to the Network Tab.

- It is important to catch errors and let the user know why their data didn't come back how they intended it to.

- You can set headers by adding an additional argument (as an object) to your http request.

- Create an Interceptor to add a specific header to every single request. You can also modify the request object by cloning the original request, or even modify the response you will get. You can add as many Interceptors as you want.

---

---

## Project Steps

### STEP 1: Learning about OpenLibrary API

#### At Open Library API Docs

- Navigate to [Open Library Developer Docs](https://openlibrary.org/developers/api)

- Read over our options for API Endpoints and click on the Search link because in our application we want users to search for a book and receive results.

- Read over how the Search API will work... what we will have to send, what parameters we can use, and what we will receive. Talk about the importance of READING documentation!

- Click on one of their demo urls and show them the url in the browser and the format of the data on that page.

---

### STEP 2: Creating a Search Bar Form

#### Inside app/library/book-search HTML

- ADD: an inline-form with search box and a button. Create an onSubmit pointing to a onFetchPosts function.

_RESULT_:

```html
<form #searchForm="ngForm" (ngSubmit)="onFetchBooks()" class="form-inline">
  <div class="form-group mr-2">
    <label for="search" class="sr-only">Search</label>
    <input
      type="search"
      class="form-control"
      name="search"
      id="search"
      placeholder="Search"
      [(ngModel)]="searchForm.search"
      required
      ngModel
    />
  </div>

  <button class="btn btn-primary" type="submit" [disabled]="!searchForm.valid">
    Go
  </button>
</form>
```

---

### STEP 3: Sending a Request to our API

#### Inside app/app.module.ts File

- ADD: HttpClientModule to your imports array

#### Inside app/library/book-search TS File

- Import and Add HttpClient to your constructor.

- ADD: the onFetchBooks Function and use the dummy url on OpenLibrary API to test without a query param.

- Check your console to make sure you are getting back the correct response.

_RESULT_:

```typescript
import { HttpClient } from '@angular/common/http';

// ...

constructor(private http: HttpClient) {}

onFetchBooks() {
  // Send Http request to GET all data from the provided url
  this.http
    .get('http://openlibrary.org/search.json?q=the+lord+of+the+rings')
    .subscribe((response) => {
      console.log('response', response);
    });
}
```

- ADD: an argument to our onFetchPost Function in both the HTML and Typescript files.

- ADD: a new formattedSearchParam variable to transform the search query the user types into the correct format.

- DO: Console.log your new formattedSearchParam variable.

- CHANGE: your get request URL to use backticks (template literal) and put your new variable after the "q=".

_RESULT_:

```typescript
onFetchBooks(searchParam) {
  // Turn Search Param into lowercase words with plus sign for spaces
  const formattedSearchParam = searchParam.split(' ').join('+').toLowerCase();

  // Send Http request to GET all data from the provided url
  this.http
    .get(`http://openlibrary.org/search.json?q=${formattedSearchParam}`)
    .subscribe((response) => {
      console.log('response', response);
    });
}
```

---

### STEP 4: Updating our Book Model and Saving API Results

#### Inside app/shared/book Model TS File

- REFACTOR: our Book Model to the condensed syntax and add ?'s (optional filters) to the last three arguments. This is because our API results gives us different data than our application.

_RESULT_:

```typescript
export class Book {
  constructor(
    public title: string,
    public author: string,
    public genre?: string,
    public coverImagePath?: string,
    public price?: number,
    public firstPublishYear?: number,
    public isbn?: string
  ) {}
}
```

#### Inside app/library/library.service.ts File

- Bring your logic from the onFetchBooks() function and over to the a fetchBooks() on the library services component.

- Create a New Method saveBooks(). (Write out the comments first so we know the steps to follow)

_RESULT_:

```typescript
constructor(private http: HttpClient) {}

fetchBooks(query) {
  // Turn Search Param into lowercase words with plus sign for spaces
  const formattedSearchParam = query.split(' ').join('+').toLowerCase();

  // Send Http request to GET all data from the provided url
  this.http
    .get(`http://openlibrary.org/search.json?q=${formattedSearchParam}`)
    .subscribe((response) => {
      console.log('response', response);
      this.saveBooks(response);
    });
}

saveBooks(books) {
  // Map over all the book results
  books.docs.map((book) => {
    // Destructure the book results
    const { title, author_name, first_publish_year, isbn } = book;

    // Get our Image Path for the Cover
    // TSK: Homework!

    // For each book result, create a new book
    const newBook = new Book(
      title,
      author_name ? author_name[0] : '',
      '',
      '',
      0,
      first_publish_year,
      isbn ? isbn[0] : ''
    );

    console.log('newBook', newBook);

    // Add it to allBooks array
    this.allBooks = this.allBooks.slice().concat(newBook);
  });

  // this.allBooks = books
  console.log('this.allBooks', this.allBooks);
}
```

### STEP 5: Populate Library Page with API Results

#### Inside app/shared/book HTML File

- UPDATE: the conditional statements on the Book Component to only show if we have that data.

- ADD: the firstPublishYear paragraph.

_RESULT_:

```html
<a
  style="cursor: pointer"
  class="list-group-item clearfix"
  [routerLink]="[idx]"
  routerLinkActive="active"
>
  <div class="float-left">
    <h4 class="list-group-item-heading">{{ book.title }}</h4>
    <p class="list-group-item-text mb-0" *ngIf="book.genre !== ''">
      {{ book?.genre }}
    </p>
    <p class="list-group-item-text mb-0">{{ book.author }}</p>
    <p class="list-group-item-text mb-0" *ngIf="book.price > 0">
      {{ book.price | currency }}
    </p>
    <p class="list-group-item-text mb-0" *ngIf="book.firstPublishYear">
      {{ book.firstPublishYear }}
    </p>
  </div>
  <div class="float-right" *ngIf="book.coverImagePath !== ''">
    <img
      src="{{ book.coverImagePath }}"
      alt="{{ book.title }}"
      class="img-responsive rounded"
      style="max-height: 50px"
    />
  </div>
</a>
```

#### Inside app/library library.service.ts File

- REMOVE: Hard-coded books and Book Columns Arrays.

- ADD: Http Client.

- ADD: fetchBooks(query) function.

- ADD: saveBooks(books) function.

_RESULT_:

```typescript
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Book } from '../shared/book/book.model'

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  allBooks: Book[] = []

  constructor(private http: HttpClient) {}

  fetchBooks(query) {
    // Turn Search Param into lowercase words with plus sign for spaces
    const formattedSearchParam = query.split(' ').join('+').toLowerCase()

    // Send Http request to GET all data from the provided url
    this.http
      .get(`http://openlibrary.org/search.json?q=${formattedSearchParam}`)
      .subscribe((response) => {
        // Reset Books Array
        this.allBooks = []
        // Save Books
        this.saveBooks(response)
      })
  }

  getBooks() {
    console.log('%c  this.allBooks: ', 'color: red;', this.allBooks)

    return this.allBooks.slice()
  }

  saveBooks(books) {
    // Map over all the book results
    books.docs.map((book) => {
      // Destructure the book results
      const { title, author_name, first_publish_year, isbn } = book

      // For each book result, create a new book
      const newBook = new Book(
        title,
        author_name ? author_name[0] : 0,
        '',
        '',
        0,
        first_publish_year,
        isbn ? isbn[0] : ''
      )

      console.log('%c  newBook: ', 'color: red;', newBook)

      // Add it to allBooks array
      this.allBooks = this.allBooks.concat(newBook)
    })
  }
}
```

#### Inside app/library/book-results TS File

- CHANGE: the variable allBooks to bookResults to make it more clear. (do this in the ngFor statement in the HTML file as well).

- REMOVE: Everything in the ngOnInit() function.

- REMOVE: the @Input variable and unnecessary imports.

_RESULT_:

```typescript
export class BookResultsComponent implements OnInit {
  constructor(
    public libraryService: LibraryService,
    private bookshelfService: BookshelfService
  ) {}

  ngOnInit(): void {}

  onSaveBook(book: Book) {
    return this.bookshelfService.saveBook(book)
  }
}
```

#### Inside app/library/book-result HTML File

- ADD: conditional \*ngIf statements to only show books if we have results.

- ADD: A "No Books Available" Paragraph if a user has not searched for a title yet.

- UPDATE: The array you are looping over to get from the libraryService.allBooks array instead of a local variable.

_RESULT_:

```html
<div class="mb-3 row" *ngIf="libraryService.allBooks.length > 0">
  <div class="col-md-6" *ngFor="let bookEl of libraryService.allBooks">
    <app-book [book]="bookEl"></app-book>
    <button
      class="float-right"
      style="border: none; font-size: 16px"
      (click)="onSaveBook(bookEl)"
    >
      &plus;
    </button>
  </div>
</div>

<div class="mb-3 row" *ngIf="libraryService.allBooks.length < 1">
  <p>No Books Available</p>
</div>
```

---

---

## Extra Resources

- [Angular Docs - Communicating with Backend Services using HTTP](https://angular.io/guide/http)
- [Angular Docs - Get data from a server tutorial](https://angular.io/tutorial/toh-pt6)
- [Angular 12 Make HTTP Requests Tutorial](https://www.positronx.io/make-http-requests-with-angular-httpclient-api/)
