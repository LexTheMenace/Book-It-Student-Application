# Class 5 - Components & Databinding Deep Dive

---

## Steps

### Notes

**Adding Navigation with Event Binding and ngIf**

- Navigate to BookShelf and Library without routing

1. Add Click Listeners to navigation.component.file

Go to navigation.component.html file

-> shared/navigation/navigation.component.html

Add click listeners to the anchor tags that contain BookShelf and Library

result:

```html
<ul class="navbar-nav mr-auto mt-2 mt-lg-0">
  <li class="nav-item">
    <a class="nav-link" href="#" (click)="onSelect('bookshelf')">Bookshelf</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#" (click)="onSelect('library')">Library</a>
  </li>
</ul>
```

2. Configure navigation.component.ts

Add onSelect Method

```javascript

  ngOnInit(): void {}

  onSelect(feature: string){

  }
```

Add EventEmitter so we can emit an event whenever we click on one of the 'nav links'

result:

```javascript
import { Component, EventEmitter, OnInit } from "@angular/core";
@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent implements OnInit {
  collapsed = true;
  show = false;
  featureSelected = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
}
```

Notes

We will transfer data from child component to parent component. In response, app.component(parent) will react to these changes. This way we can navigate between bookshelf and library.

3. Attach Output to the eventemitter to make it listenable from the parent component

```javascript
  @Output() featureSelected = new EventEmitter;
```

4. Allow App-component.html to listen to the event

Navigate to the app.component.html

Add FeatureSelected to app-navigation

result:

```html
<app-navigation (featureSelected)="onNavigate()"></app-navigation>
```

To get data from featureSelected, add $event

result:

```html
<app-navigation (featureSelected)="onNavigate($event)"></app-navigation>
```

5. Handle onNavigate in the app.component.ts file

- Add OnNavigate with a parameter type string called feature
- Include a default string called loadedFeature that is set to bookshelf
- create a property called loadedFeature that is type string. Set that to 'bookshelf'
result:

```javascript
export class AppComponent {
  title = 'BookIt';
  loadedFeature = 'bookshelf'
  onNavigate(feature: string){
    this.loadedFeature = feature;
  }

```

5. Adding ngIf to allow navigation

- Go to app.component.html
- include ngIf on both the app-bookshelf element and app-library element
- add a conditional to check for the respected elements

result:

```html
<app-bookshelf *ngIf="loadedFeature === 'bookshelf'"></app-bookshelf>
<hr />
<app-library *ngIf="loadedFeature === 'library'"></app-library>
```

Display webpage and click bookshelf and library to show a basic navigation that is an example of ngIf, eventEmitter and transfering data from navigation component to app component.

Next Section:
**Passing Bookshelf Data with Property Binding**

Goal
Let's pass data from the book-list component to the book component ('./shared/book').

1. Cut, Copy, Paste

Navigate to book-list.component.html

Copy and cut

```html
<a href="#" class="list-group-item clearfix">
  <div class="float-left">
    <h4 class="list-group-item-heading">{{ book.title }}</h4>
    <p class="list-group-item-text mb-0">{{ book.genre }}</p>
  </div>
  <div class="float-right">
    <img
      src="{{ book.coverImagePath }}"
      alt="{{ book.title }}"
      class="img-responsive rounded"
      style="max-height: 50px"
    />
  </div>
</a>
```

- navigate to ./shared/book/book.component.html
- Delete the content, and paste code above

This will cause an error only because we aren't recieving any information from the book-list.component.ts file.

book-list.componen.html Result:

```html
<div class="row mb-3" *ngFor="let book of myBooks">
  <div class="col-md-12">
    <app-book></app-book>
  </div>
</div>
<hr />
<div class="row">
  <div class="col-md-12">
    <button class="btn btn-primary">Add New Book</button>
  </div>
</div>
```

book.component.html Result:

```html
<a href="#" class="list-group-item clearfix">
  <div class="float-left">
    <h4 class="list-group-item-heading">{{ book.title }}</h4>
    <p class="list-group-item-text mb-0">{{ book.genre }}</p>
  </div>
  <div class="float-right">
    <img
      src="{{ book.coverImagePath }}"
      alt="{{ book.title }}"
      class="img-responsive rounded"
      style="max-height: 50px"
    />
  </div>
</a>
```

2. Loop through the book element with data

- navigate to book-list.component.html
- remove \*ngFor from div and add it to app-book element

Result:

```html
<div class="row mb-3">
  <div class="col-md-12">
    <app-book *ngFor="let book of myBooks"></app-book>
  </div>
</div>
```

3. Add book variable to book.component.ts and get data from outside of the component

@input allows us to bind this component property from outside

result:

```javascript
import { Component, Input, OnInit } from "@angular/core";
import { Book } from "./book.model";

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.css"],
})
export class BookComponent implements OnInit {
  constructor() {}
  @Input() book: Book;

  ngOnInit(): void {}
}
```

4. Bind book to the current loop iteration

- navigate to book-list.component.html
- bind to to the current loop iteration

```html
<app-book *ngFor="let bookEl of myBooks" [book]="bookEl"></app-book>
```

5. Show Application

Next Section:
**Passing Data with Event and Property Binding**

Goal: Whenever we click on the book link, we want to emit an event informing our parent component of this book of being selected

1. Add click listener and event binding to the book component

- Navigate to shared/book/book.component.html
- Add a click listener called onSelected

```html
<a href="#" class="list-group-item clearfix" (click)="onSelected()">
  <div class="float-left">. . .</div>
</a>
```

- Navigate to the book.component.ts file

- add onSelect method

```javascript
  onSelected(){

  }
```

- include eventEmitter with type void because it will have no information

```javascript
  bookSelected = new EventEmitter<void>();
  constructor() { }
```

- add @Output so we can listen to this event from outside.

```javascript
.
.
.
  @Input() book: Book
  @Output() bookSelected = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

.
.
.
```

- Whenever we click on a book element, we want to emit an event, so..

```javascript

  onSelected(){
    this.bookSelected.emit();
  }
```

2. Emit an event from book-list
   We need to pass information from the book component, to its parent component (book-list) and then pass that information to book shelf

- create a method that listens to the event from book-list.component.html
- navigate to book-list.component.html
- Make sure to pass down book data to onBookSelected, this will allow us to notify the book-list component what we selected
  result:

```html
<app-book
  *ngFor="let bookEl of myBooks"
  [book]="bookEl"
  (bookSelected)="onBookSelected(bookEl)"
></app-book>
```

3. Configure book-list-component.ts

- Create onBookSelected method in bookt-list.component.ts
- emit another event to notify its parent component
- Add @Output to eventEmitter so that its parent component can listen it
- Emit event in the OnBookSelected method and be sure to pass in book object

```javascript
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Book } from 'src/app/shared/book/book.model';

.
.
.

export class BookListComponent implements OnInit {
  @Output() bookWasSelected = new EventEmitter<Book>();

  .
  .
  .

  constructor() {}

  ngOnInit(): void {}

  onBookSelected(book: Book){
    this.bookWasSelected.emit(book);
  }
}

```

4. Pass information to Bookshelf component

- navigate to ./bookshelf/bookshelf.component.html
- Listen to the book that was selected in the bookshelf component

```html
<app-book-list (bookWasSelected)="selectedBook"></app-book-list>
```

- add selectedBook variable to bookshelf.component.html

```javascript
export class BookshelfComponent implements OnInit {
  selectedBook: Book;
  constructor() {}

  ngOnInit(): void {}
}
```

bookshelf.component.html

- Let's assign $event to selectedbook once the event occurs

```html
<app-book-list (bookWasSelected)="selectedBook=$event"></app-book-list>
```

- we can now pass information to the book details component
- if selectedBook is null, don't display book-details, vice versa

```html
<div class="col-md-5">
  <app-book-details *ngIf="selectedBook"></app-book-details>
</div>
```

- If selected book is null, set some dummy text
- use else in ngIf to do this

result:

```html
<div class="col-md-5">
  <app-book-details *ngIf="selectedBook; else infoText"></app-book-details>
  <ng-template #infoText><p>Please select a Recipe!</p></ng-template>
</div>
```

5. Show application to show if working, click on book elements to display book details

6. Pass the selected book to the book detail

- navigate to book-details.component.ts
- declare a book variable and make sure to add @input to recieve the information from the parent component

book-details.component.ts

```javascript
export class BookDetailsComponent implements OnInit {
  @Input() book: Book;
  constructor() {}

  ngOnInit(): void {}
}
```

- navigate to the bookshelf.component.html and pass the information
- bind book to the selectedBook

bookshelf.component.ts

```html
<app-book-details
  *ngIf="selectedBook; else infoText"
  [book]="selectedBook"
></app-book-details>
```

7. Display Information in book-details component

- navigate to book-details.component.html

```html 

<div class="row">
  <div class="col-md-12">
    <h2>{{ book.title }}</h2>
  </div>
</div>

<div class="row">
  <div class="col-md-12">
    <h3>{{ book.author }}</h3>
  </div>
</div>

<div class="row">
  <div class="col-md-12">
    <p>{{ book.genre }}</p>
  </div>
</div>

<div class="row">
  <div class="col-md-12">
    <img [src]="book.coverImagePath" [alt]="book.title" class="img-responsive" />
  </div>
</div>
.
.
.

```

8. Display Application
