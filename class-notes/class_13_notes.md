# Adding Forms to BookIt
<hr />

**Goal:**  We will be adding a form into BookIt that will allow us to add a new book or edit an existing book and validate the data.
<hr>

**Adding Form in HTML**
1. Remove what is already in the bookshelf-editor.component.html
2. Create a form
3. Within the form add a div with the class form-group
   ```html
    <form>
      <div class="form-group"> </div>
    <form>
   ```
4. Inside the form group classes we add an input for the title of the book.
   ```html
    <form>
      <div class="form-group"> 
        <label for="title">Book Title</label>
        <input type="text" id="title" class="form-control" />
      </div>
    <form>
   ```
5. Copy the entire form-group for the title and paste it below for the author input and the price input. Don't forget to replace the title specific properties to author
   ```html
    <form>
      <div class="form-group"> 
        <label for="title">Book Title</label>
        <input type="text" id="title" class="form-control" />
      </div>
      <div class="form-group"> 
        <label for="author">Author</label>
        <input type="text" id="author" class="form-control" />
      </div>
      <div class="form-group">
        <label for="price">Price</label>
        <input
          type="number"
          id="price"
          class="form-control">
      </div>
    <form>
   ```
6. Add another form group div below author for the genre
  - Add a label for genre
  - Beneath the label add a select with class form-control and id genre.
  - Insde the select tag place a default option that says "Select a Genre"
  - In the option start tag add "disabled selected value" (this makes sure that you can't select this and that it has no value)
  - Then add a few more options with a book genre(Mystery, Science, Fiction, Non-Fiction, etc)
  - Make sure you make the value the name of the genre(case sensitive)
    ```html
    <div class="form-group">
      <label for="title">Book Title</label>
      <input
        type="text"
        id="title"
        class="form-control">
    </div>
    <div class="form-group">
      <label for="author">Author</label>
      <input
        type="text"
        id="author"
        class="form-control">
    </div>
    <div class="form-group">
      <label for="price">Price</label>
      <input
        type="number"
        id="price"
        class="form-control">
    </div>
    <div class="form-group">
      <label for="genre">Genre</label>
      <select class="form-control" id="genre" formControlName="genre">
        <option disabled selected value>Select a Genre</option>
        <option value="Mystery">Mystery</option>
        <option value="Science">Science</option>
        <option value="Non-Fiction">Non-Fiction</option>
        <option value="Fiction">Fiction</option>
      </select>
    </div>
    ```
7. Add another form group 
  - A label for "Image Path"
  - A text input id coverImagePath and class form-control
8. Add a row and full width column
  - Add img tag with class of img-responsive
    ```html
    <div class="form-group">
      <label for="coverImagePath">Image Path</label>
      <input
        type="text"
        id="coverImagePath"
        class="form-control">
    </div>
    <div class="row">
      <div class="col-xs-12">
        <img [src]="bookForm.value['coverImagePath']" alt="" class="img-responsive">
      </div>
    </div>
    ```
  - Add two buttons. A save of type submit and a cancel of type button  
    ```html
    <button type="submit" class="btn btn-success">Save</button>
    <button type="button" class="btn btn-danger">Cancel</button>
    ```

**Making the Form Work Dynamically** 
1. In bookshelf-editor.component.ts add a private method called initForm and add a reference to the bookshelfService
    ```typescript
    export class BookshelfEditorComponent implements OnInit{
      constructor(private bookshelfService: BookshelfService) {}
      .
      .
      .
      private initForm() {}
    }

    ```
2. Add a property called bookForm of type FormGroup(import from @angular/forms)
   ```typescript
    export class BookshelfEditorComponent implements OnInit{
      bookForm: FormGroup
      constructor(private bookshelfService: BookshelfService) {}
      .
      .
      .
      private initForm() {}
    }
   ```
3. inside your method set bookForm to new FormGroup
  - FormGroup takes a JS object to create the form values.
  - Add FormControl elements for each book element(import from @angular/forms)
  - ex . 'title': new FormControl()
   ```typescript
     export class BookshelfEditorComponent implements OnInit{
      .
      .
      .
      private initForm() {
        this.bookForm = new FormGroup({
          'title': new FormControl(),
          'author': new FormControl(),
          'genre': new FormControl(),
          'coverImagePath': new FormControl(),
          'price': new FormControl()
        })
      }
    }
   ```
4. To determine if the user is in edit mode and apply values if so:
  - Add variables with let for each aspect of the book(title, author, genre, image)
  - Set them all equal to empty strings
   ```typescript
     export class BookshelfEditorComponent implements OnInit{
      .
      .
      .
      private initForm() {
        let bookTitle = '';
        let bookAuthor = '';
        let bookGenre = '';
        let bookImagePath = '';
        let bookPrice = 0;

        this.bookForm = new FormGroup({
          'title': new FormControl(),
          'author': new FormControl(),
          'genre': new FormControl(),
          'coverImagePath': new FormControl(),
          'price': new FormControl()
        })
      }
    }
   ```
5. Add an if statement checking for isEditmode to be true
  - if it is true set a constant named book to call the get book method in the bookshelf service.
  - set all your variables you created eqaul to the the corresponding book element.
  - ex. bookTitle = book.title
  ```typescript
     export class BookshelfEditorComponent implements OnInit{
      .
      .
      .
      private initForm() {
        let bookTitle = '';
        let bookAuthor = '';
        let bookGenre = '';
        let bookImagePath = '';
        let bookPrice = 0;

        if (this.isEditMode) {
          const book = this.bookshelfService.getBook(this.id);
          bookTitle = book.title;
          bookAuthor = book.author;
          bookGenre = book.genre;
          bookImagePath = book.coverImagePath;
          bookPrice = book.price
        }

        this.bookForm = new FormGroup({
          'title': new FormControl(),
          'author': new FormControl(),
          'genre': new FormControl(),
          'coverImagePath': new FormControl(),
          'price': new FormControl()
        })
      }
    }
   ```
6. In your FormControl() add the corresponding elements onto the parenthesis
  - ex. 'title': new FormControl(bookTitle)
  - Call the private method in ngOnInit after the isEditMode params are set.
  ```typescript
     export class BookshelfEditorComponent implements OnInit{

       ngOnInit() {
         this.initForm()
       }
      .
      .
      .
      private initForm() {
        let bookTitle = '';
        let bookAuthor = '';
        let bookGenre = '';
        let bookImagePath = '';
        let bookPrice = 0;

        if (this.isEditMode) {
          const book = this.bookshelfService.getBook(this.id);
          bookTitle = book.title;
          bookAuthor = book.author;
          bookGenre = book.genre;
          bookImagePath = book.coverImagePath;
          bookPrice = book.price
        }

        this.bookForm = new FormGroup({
          'title': new FormControl(bookTitle),
          'author': new FormControl(bookAuthor),
          'genre': new FormControl(bookGenre),
          'coverImagePath': new FormControl(bookImagePath),
          'price': new FormControl(bookPrice)
        })
      }
    }
   ```

**Adding Validation** 
1. In the book-editor.component.ts
  - import Validators(import from @angular/forms)
  - After the FormControl argument addd your validators.
  - ex. 'title': new FormControl(bookTitle, Validators.required)
  ```typescript
     export class BookshelfEditorComponent implements OnInit{
      .
      .
      .
      private initForm() {
        .
        .
        .
        this.bookForm = new FormGroup({
          'title': new FormControl(bookTitle, Vaidators.required),
          'author': new FormControl(bookAuthor, Vaidators.required),
          'genre': new FormControl(bookGenre, Vaidators.required),
          'coverImagePath': new FormControl(bookImagePath, Vaidators.required),
          'price': new FormControl(bookPrice, Vaidators.required)
        })
      }
    }
   ```
2. In the book-editor.component.css
  - Add input.ng-invalid.ng-touched and select.ng-invalid.ng-touched
  - In that add a 1px solid rgba(255, 0, 0, 0.464) border
  ```css
    input.ng-invalid.ng-touched, select.ng-invalid.ng-touched{
      border: solid 2px rgba(255, 0, 0, 0.464);
    }
  ```

**Connecting the TypeScript with the HTML** 
1. In the app.module.ts add into your imports the FormsModule and ReactiveFormsModule(import from @angular/forms)
2. In your book-editor.component.html 
  - Add \[formGroup]="bookForm" and (ngSubmit)="onSubmit() to the form element
  - To your input elements add the directive formControlName set it equal to the corresponding FormControls in your ts file
  - ex. formControlName="title"
  - Add the same for the select element
  ```html
    <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="title">Book Title</label>
        <input
          type="text"
          id="title"
          formControlName="title"
          class="form-control">
      </div>
      <div class="form-group">
        <label for="author">Author</label>
        <input
          type="text"
          id="author"
          formControlName="author"
          class="form-control">
      </div>
      <div class="form-group">
        <label for="price">Price</label>
        <input
          type="number"
          id="price"
          formControlName="price"
          class="form-control">
      </div>
      <div class="form-group">
        <label for="genre">Genre</label>
        <select class="form-control" id="genre" formControlName="genre">
          <option disabled selected value>Select a Genre</option>
          <option value="Mystery">Mystery</option>
          <option value="Science">Science</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Fiction">Fiction</option>
        </select>
      </div>
      <div class="form-group">
        <label for="coverImagePath">Image Path</label>
        <input
          type="text"
          id="coverImagePath"
          formControlName="coverImagePath"
          class="form-control">
      </div>
      <div class="row">
        <div class="col-xs-12">
          <img [src]="bookForm.value['coverImagePath']" alt="" class="img-responsive">
        </div>
      </div>
      <button type="submit" class="btn btn-success" [disabled]="!bookForm.valid">Save</button>
      <button type="button" class="btn btn-danger" (click)="onCancel()">Cancel</button>
    </form>

  ```

**Submitting the Form**
1. In the book-editor.component.ts
  - Add the onSubmit method
  - Add the logic as follows
  ```typescript
    if (this.isEditMode) {
      this.bookshelfService.updateBook(this.id, this.bookForm.value)
    }
    else {
      this.bookshelfService.addBook(this.bookForm.value)
    }
  ```
3. In the bookshelf.service.ts
  - Add a booksChanged subject of type Book[] 
  - Add an addBook method
  - Pass a book of type Book
  - Push up the book to the myBooks array
  ```typescript
    addBook(book: Book) {
      this.myBooks.push(book);
    }
  ```
  - Add method for updateRecipe
  - pass index of type number and updatedBook of type Book
  - Apply this logic to change the specific book's elements
    ```typescript
      updateBook(index: number, updatedBook: Book) {
        this.myBooks[index] = updatedBook
      }
    ```

**Adding CRUD**
1. In the book-details.component.ts 
  - Add onDelete book method and call the removeBook from bookshelfService and pass this.id
  - User the router to navigate back one level
  ```typescript
    onEditBook() {
      this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
    }
  ```
2. In the book-details.component.html 
  - Add a click listener to the delete button for onDeleteBook()
3. In the book-editor.component.html
  - add a click listener to the cancel button for onCancel()
4. In the book-editor.component.ts 
  - Add into the constructor private router: Router
  - Add the onCancel method and navigate back one level
  - Add a call to onCancel in the onSubmit method as well.
  ```typescript
  export class BookshelfEditorComponent implements OnInit {

    constructor(
      private route: ActivatedRoute,
      private bookshelfService: BookshelfService,
      private router: Router ) {}

    .
    .
    .

    onSubmit() {
      if (this.isEditMode) {
        this.bookshelfService.updateBook(this.id, this.bookForm.value)
      }
      else {
        this.bookshelfService.addBook(this.bookForm.value)
      }

      this.onCancel()
    }

    onCancel() {
      this.router.navigate(['../'], {relativeTo: this.route})
    }
  }
  ```

<hr />

# Using Pipes to Transform Output

**Goal:** To learn more about pipes and transforming your data with them.

**OverView:** Pipes are used to format data. You can use them to format dates, titles, strings, etc. You can also create you rown custom pipes.

**Adding a Price and Formatting with Pipes**
1. in the book model add a price as type number.
   ```typescript
      export class Book {
        public title: string;
        public author: string;
        public genre: string;
        public coverImagePath: string;
        public price: number

        constructor(title: string, author: string, genre: string, img: string, price: number) {
          this.title = title;
          this.author = author;
          this.genre = genre;
          this.coverImagePath = img;
          this.price = price;
        }
      }
   ```
2. in the book.component.html add two paragraphs the same as the genre paragraph for the author and the price.
   ```html
    <div class="float-left">
      <h4 class="list-group-item-heading">{{ book.title }}</h4>
      <p class="list-group-item-text mb-0">{{ book.genre }}</p>
      <p class="list-group-item-text mb-0">{{ book.author }}</p>
      <p class="list-group-item-text mb-0">{{ book.price | currency}}</p>
    </div>
   ```
3. Add price values to the myBooks and the allBooks array
4. In the form we just created add another input like the author and title inputs for the price
  ```html
  <div class="form-group">
      <label for="price">Price
      <input
        type="number"
        id="price"
        formControlName="price"
        class="form-control">
  </div>
  ```
5. In the bookshelf-editor.component.ts file add the following
  - Add a bookPrice variable set to 0
  - Set the bookPrice equal to book.price
  - Add price form control and make it required.
6. Go back to your book.component.html file
  - Where you use string interpolation for price add a pipe symbol "|" and then currency
  - ex. {{ book.price | currency }}
  - To format to different currencies:
  - {{ book.price | currency: 'CAD' }}
  - You can look up different currency abbreviations and use them as well.

**Creating Custom Pipe**
1. Create new pipe file in app folder(sort.pipe.ts)'
2. Import Pipe and PipeTransform from angular core
3. Give it a Pipe decorator with the name sort
4. export class named SortPipe that implements PipeTransform
  ```typescript
    import { Pipe, PipeTransform } from "@angular/core";

    @Pipe({
      name: 'sort'
    })
    export class SortPipe implements PipeTransform {

    }
  ```
5. make a transform method
  - Give it two arguments:
  - array of type any
  - field of type any
  - The array argument receives an array
  - The field will determine what feild from the array we sort by
  - we are going to use the sort method on the array like so 
  ```typescript
    transform(array: any, field: string): any[] {
      array.sort((a: any, b: any) => {
        if (a[field] < b[field]) {
          return -1;
        }
        else if (a[field] > b[field]) {
          return 1;
        }
        else {
          return 0;
        }
      })
      return array
    }
  ```
6. This takes the field's value to check the parameters we set and send it either up or down based on a number or a string.
7. This allows us to set things in alphabetical order

**Using the Pipe** 
1. Import the pipe from its location in the app.module.ts
2. Add it to the declarations
3. In the book-list.component.ts
  1. Add two properties: sortSwitcher = true, and sortField = 'author
  2. Add an onSort method that looks like this
  ```typescript
    onSort() {
    this.sortSwitcher = !this.sortSwitcher;
    if (this.sortSwitcher === true) {
      this.sortField = 'author'
      this.buttonDisplay = 'title'
    }
    else {
      this.sortField = 'title'
      this.buttonDisplay = 'author'
    }
  }
  ```
  3. This lets us toggle the text on the button and the field we will sort by
4. In the book-list.component.html
  1. In the ngFor add:
  ```html
    <div class="col-md-12" *ngFor="let bookEl of myBooks | sort:sortField; let i = index">
  ```
  2. Add another button in the same row as the other that looks like this:
  ```html
    <button class="btn btn-primary" (click)="onSort()">Sort By {{ buttonDisplay | titlecase }}</button>
  ```
5. What we are doing here is setting the sort pipe on the myBooks array and then adding the feild param to the sort, which chooses which aspect of the array we will sort by. The button is toggling the the value of the sort field so we can change the feild from sorting alphabetically by author or title.


