# Class 13 - HTTP and Authentication with Route protection

---

## HTTP Live Coding

**NOTE: For security purposes, the firebase URL and API KEY in these notes are fake**

### STEP 1: Backend (Firebase) Setup

1. Sign into your google account
2. Go to the firebase website and click getting started
3. Enter any name for the project(ex: BookIt)
   NOTE: if by any chance you run out of the exceeded number of times you can create a project:
   You can delete an existing project or go to a different google account,
   **Go to an existing project -> settings (icon) -> scroll down -> delete project**
4. Recommended analytics -> create project

5. Create a Database
   Build -> RealTime Database -> Create Database -> Next -> Start in test mode -> enabled

This will be the url you will have to be able to send request to
(ex: https://bookit-23d482sdfsdf33-default-rtdb.firebaseio.com/)

### STEP 2: Setting Up the Data Storage

Let's make a service to handle the requests.
We want to ultimately inject this service into our bookshelf service.

- navigate to shared
  - Create a data-service folder
  - Create a data-storage-serivice.ts file

Make this class @Injectable() to allow us to inject this to our bookshelf service.

data-storage.service.ts

```typescript
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class DataStorageService {}
```

- Inject the angular HttpClient

data-storage.service.ts

```typescript
import { HttpClient } from "@angular/common/http";
.
.
.
export class DataStorageService{
  constructor(private http: HttpClient){}
 }

```

### STEP 3: Storing Books

Lets store our data to our database

Let's get the books from the bookshelfservice and send a post request to the firebase API

- create a storeBooks method and inject the BookShelfService

data-storage.service.ts

```typescript
  constructor(private http: HttpClient, private bookShelfService: BookshelfService) { }

  storeBooks() {
    const books = this.bookShelfService.getBooks();
  }
}
```

- Create a post request to override any books stored in the database and add a "/books.json at the end of the url

Notes: The .json is a firebase characteristic and the reason for the alias books is because firebase will place this data into separate "folders" and we will send data to books.json

data-storage.service.ts

```typescript
  storeBooks() {
    const books = this.bookShelfService.getBooks;
    this.http.put("https://bookit-default-rtdb.firebaseio.com/books.json", books)
  }
```

- Subscribe to the observable and then console.log the response

data-storage.service.ts

```typescript
this.http
  .put("https://bookit-default-rtdb.firebaseio.com/books.json", books)
  .subscribe((response) => [console.log(response)]);
```

- Navigate to the navigation.component.html
  - BookIt\src\app\shared\navigation\navigation.component.html
  - get rid of href attributes from the Save Data and Fetch Data anchor tags
  - Add a click listener called onSaveData to the Save Data anchor tag
  - include curor:pointer styling to each element

navigation.component.html

```html
<a class="dropdown-item" (click)="onSaveData()" style="cursor:pointer;"
  >Save Data</a
>
<a class="dropdown-item" style="cursor:pointer;">Fetch Data</a>
```

- Navigate to the navigation.component.ts file
  - Create onSaveData() method and inject dataStorage Service
  - call storeBooks() from the dataStorage Service in the onSaveData() method

navigation.component.ts

```typescript
  constructor(private dataStorageService: DataStorageService){}
  ngOnInit() {}

  onSaveData(){
    this.dataStorageService.storeBooks();
  }
```

- Go to your web browser
  - click on manage -> store data
  - check console for response
- Go to firebase and check out the data you saved
  - It created a books node and stored these objects

### STEP 4: Fetching Books

Let's fetch our data from firebase by clicking on the Fetch button

- navigate to the navigation.component.html
- add a click listener to the Fetch Data anchor tag called onFetchData() and craete a onFetchMethod for the navigation.component.ts file.

navigation.component.html

```html
<a class="dropdown-item" (click)="onFetchData()" style="cursor:pointer;"
  >Fetch Data</a
>
```

- call the fetchBooks method from the dataStorage Service. We are about to create this.

navigation.component.ts

```typescript
  onFetchData(){
    this.dataStorageService.fetchBooks();

  }
```

- navigate to the data-storage.service.ts file

  - Create a fetchBooks method and send a get request to the url.
  - Subscribe to the observable and console log the data
  - check out the data you requested in the application.

data-storage.service.ts

```typescript
  fetchBooks(){
    this.http.get("https://bookit-d4823-default-rtdb.firebaseio.com/books.json").subscribe(books=>{
      console.log(books)
    })
  }

```

- Let's set our currently loaded books to override the existing books.

- navigate to the bookshelf.service.ts file
  - create a setBooks method
  - Take in a books array argument and set that to this.myBooks
  - Use the next method to notify the subscribers. Pass in a slice version of this.myBooks to return a new copy of the array

bookshelf.service.ts

```typescript
  setBooks(books: Book[]){
    this.myBooks = books;
    this.booksChanged.next(this.myBooks.slice());
  }
```

- navigate back to data-storage.service.ts
  - call the setBooks method from bookshelfService inside the fetchBooks method
  - typescript gives us an error, so let's add a generic by add the Book [] type
  - Import the book model

data-storage.service.ts

```typescript
  fetchBooks(){
    this.http.get<Book[]>("https://bookit-d4823-default-rtdb.firebaseio.com/books.json").subscribe(books=>{
      this.bookShelfService.setBooks(books)
    })
  }
```

Let's comment out the static data we are getting from bookshelf.service.ts

- navigate to bookshelf.serivce.ts
  - comment out myBooks and create a myBooks array and set it to an empty array

bookshelf.service.ts

```typescript
  private myBooks : Book[] = []
```

NOTE: We have a problem, whenever we fetch our data, the bookshelf isn't getting notified that there is a change in data. Let's fix this by subscribing to these changes.

- navigate to the book-list.components.ts file
  - subscribe to booksChange from he bookshelf Service and set this.myBooks to the response. This way whenever we fetch data, this.mybooks will listen.

```typescript
  ngOnInit(): void {
    this.bookshelfService.booksChanged.subscribe(books=>{
      this.myBooks = books;
    });
    this.myBooks = this.bookshelfService.getBooks();
  }
```

- Add a subscription variable and set it to what you subscribed. And then unsubscribe in ngOnDestroy

````typescript
.
.
.
export class BookListComponent implements OnInit, OnDestroy {
.
.
.
  private bookSub:Subscription;

  ngOnInit(): void {
    this.bookSub = this.bookshelfService.booksChanged.subscribe(books=>{
      this.myBooks = books;
    });
    this.myBooks = this.bookshelfService.getBooks();
  }
.
.
.
  ngOnDestroy(){
    this.bookSub.unsubscribe();
  }
}


Note: More bugs

- When we add books and edit our books, our book-list component didnt react to those changes

- navigate to the bookshelf.service.ts file
    - call the next methods in both the addBook and updateBook methods


```typescript
  addBook(book: Book) {
    this.myBooks.push(book);
    this.booksChanged.next(this.myBooks.slice());
  }

  updateBook(index: number, updatedBook: Book) {
    this.myBooks[index] = updatedBook;
    this.booksChanged.next(this.myBooks.slice());
  }
````

- now you can add books and edit the books

### STEP 5: Resolving Data Before Loading

If we are in route "books/2" we get an error if we refresh. Let's resolve this by creating a resolver.

- Create a books-resolver.service.ts file under the bookshelf folder
- configure the class

```typescript
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class BooksResolverService {}
```

- Import resolve from @angular/router and implement Resolve
  - Resolve takes in a generic, set it to a book array
- inject dataStorage Service
- the resolve interface forces us to include the resolve method
  - the resolve method takes in a ActivatedRouteSnapshot and RouterStateSnapshot

```typescript
@Injectable({ providedIn: "root" })
export class BooksResolverService implements Resolve<Book[]> {
  constructor(private dataStorageService: DataStorageService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {}
}
```

- the goal is to return an observable that yields the books

navigate to the data-storage.service.ts file

- we need to return an observable from the fetchBooks method, to do this, let's use pipe to use the tap method.
  - Note: the tap method takes in data but does not change it. It just executes code. Here, let's set the books.
  - do not subscribe here, return the observable

data-storage.service.ts

```typescript
  fetchBooks(){
    return this.http.get<Book[]>("https://bookit-d4823-default-rtdb.firebaseio.com/books.json")
    .pipe(tap(books=>{
      this.bookShelfService.setBooks(books)
    }))

  }
```

- navigate to the navigation.component.ts file
  - inside the onFetchData, call the subscribe method onto the fetchBooks method.

navigation.component.ts

```typescript
  onFetchData(){
    this.dataStorageService.fetchBooks().subscribe();
  }
```

navigate to the books-resolve.service.ts file

- call dataStorageService.fetchBook() inside the resolve method

```typescript
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.dataStorageService.fetchBooks();
  }
```

Reason we aren't calling subscribe here is because the resolve method will subscribe for you.

let's apply the resolver to the app-routing-module

- navigate to the app-routing-module.ts file

- add the resolve property to ':id' and ':id/edit'

app-routing.module.ts

```typescript
      { path: ':id', component: BookDetailsComponent, resolve: [BooksResolverService] },
      { path: ':id/edit', component: BookshelfEditorComponent, resolve: [BooksResolverService] },
```

Showcase app and refresh the page on this routes

- make sure the route is the range of how many books you have stored in your database

- reason why this works is because when we refresh the page in these routes, we fetch the books from firebase whenever these routes get loaded.

### STEP 6: Fixing a Bug with the Resolver

When we edit a book and save, the route gets refreshed and does not save the content. Let's fix this.

navigate to the books-resolver.service.ts file

- inject the BookshelfService
  - get books and check to see if the array is 0, if so, fetch the books
    if not, return books

```typescript
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const books = this.bookShelfService.getBooks();
    if(books.length == 0){
      return this.dataStorageService.fetchBooks();
    }else{
      return books;
    }
  }
```

Showcase app

- End Section

## Authnetication & Route Protection

#### Brief Lecture

** Outline **

-

1. What is Authentication?

   - Authentication is the process of verifying the identity of an individual. Authenticating a user results in user information and access to certain actions or pages that can be restricted.

2. How does Authentication work?

   - The client side communicates with the server side by sending auth data such as email and password to see if it is valid.

3. Why you should validate in the Server Side?

   - Validating in client side and server side is recommended and here's why:
   - You can validate the user input to correct every field before they submit a form which is efficient and easier.
   - The reason for validation in the server side is because you can protect against malicious attacks in which can change your javascript and submit dangerous input to the server
     Resource: https://stackoverflow.com/questions/162159/javascript-client-side-vs-server-side-validation

4. What is a RESTful API?
   - A RESTful API is an architectural style for an application program interface (API) that uses HTTP requests to access and use data. That data can be used to GET, PUT, POST and DELETE data types, which refers to the reading, updating, creating and deleting of operations concerning resources.
     Resource: https://searchapparchitecture.techtarget.com/definition/RESTful-API

- We'll have the server validate the user credentials. If it's valid, the server will send the client a JSON web token.

5. What is a JSON web token?
   - Json web tokens define a compact and self contained way for securely transmitting information between parties as a JSON object.  
     Resource: https://jwt.io/introduction

- The browser is able to store the token in which is able to allow the server to authenticate the user.
- If you are able to edit the token, it will not be valid due to the server determining that the token is invalid through a special algorithm.

## Authnetication & Route Protection Live Coding

Let's create some new routes. We need an auth page. The bookshelf and library page should only be shown when logged in as well as wit the manage options.

### STEP 1. Adding the Auth page

- create an auth folder under app

  - create a auth.component.ts and auth.component.html file
  - configure auth.component.ts

- import the AuthComponent in the app.module

auth.component.ts

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent {}
```

- navigate to the auth.component.html file
  Let's create the page and include the form

**NOTE you can copy and paste to save time. This is a simple form**

auth.component.html

```html
<div class="row">
  <div class="col-xs-12 col-md-6 offset-md-3">
    <form>
      <div class="form-group">
        <label for="email">E-email</label>
        <input type="email" id="email" class="form-control" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" class="form-control" />
      </div>
      <button class="btn btn-primary">Sign Up</button> |
      <button class="btn btn-primary">Login</button>
    </form>
  </div>
</div>
```

- navigate to the app-routing.module file to register the auth page

```typescript
.
.
.
  },
  { path: 'library', component: LibraryComponent },
  {path: 'auth', component: AuthComponent}
```

- save and demostrate the auth page in your application

- navigate to the navigation.component.html file
  - add a new nav link that navigates to the auth page

```html
. . .
<ul class="navbar-nav mr-auto mt-2 mt-lg-0">
  <li class="nav-item">
    <a class="nav-link" routerLink="/auth" routerLinkActive="active"
      >Authenticate</a
    >
  </li>
  <li class="nav-item">
    <a class="nav-link" routerLink="/bookshelf" routerLinkActive="active"
      >Bookshelf</a
    >
    . . .
  </li>
</ul>
```

### STEP 2. Switching between Auth modes

Let's switch between sign up and log in

- navigate to the auth.component.ts file

  - create a isLoginMode variable and set it to true
  - create a method called onswitchmode and reverse the value of isLoginMode

```typescript
  isLoginMode = true;

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

```

- Navigate to the auth.component.html file

  - incorporte the onswitchMode method by adding a click listener
  - use string interpolation to show dynamic text

- The first button should be a submit button and the second button is a type button

```html
<button class="btn btn-primary" type="submit">
  {{ isLoginMode ? "Login" : "Sign up" }}
</button>
|
<button class="btn btn-primary" type="button" (click)="onSwitchMode()">
  Switch to {{ !isLoginMode ? "Login" : "Sign up" }}
</button>
```

### STEP 3. Handling Form Input

Let's use the template driven approach

- configure the form so that we use ngModel

```html
<div class="form-group">
  <label for="email">E-email</label>
  <input
    type="email"
    id="email"
    class="form-control"
    ngModel
    name="email"
    required
    email
  />
</div>
<div class="form-group">
  <label for="password">Password</label>
  <input
    type="password"
    id="password"
    class="form-control"
    ngModel
    name="password"
    required
    minlength="6"
  />
</div>
```

- firebase requries us to send a password that is at least 6 characters long

- Let's get access to the form and disable the form if it isn't valid.

```html
. . .
<form #authForm="ngForm">
  . . .
  <button
    class="btn btn-primary"
    type="submit"
    [disabled]="!authForm.valid"
  ></button>
</form>
```

- you can check to see if you did this right in your application

- add ngSubmit

```html
<form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)"></form>
```

- navigate to the auth.component.ts file
  - create the onSubmit form and add the ngForm as the parameter and call form.reset once you are done.

```typescript
  onSubmit(form: NgForm){
    console.log(form.value);
    form.reset();
  }
```

- showcase that this works

### STEP 4. Preparing the backend

- go to your firebase project in order to add authentication to your project so we can get our token

  - go to realtime database
  - under rules, change the rules with

```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
  }
}
```

- publish and then try to fetch your data from your application and you will get a 401 error "unauthorized"

- go back to your firebase so we can enable authentication
  - under authentication
  - click get started
  - under sign-in method, click on status for email/password and enable the top one, not bottom one
  - click save

When users sign up, we can see those users under the users tab

### STEP 5. Preparing the Signup Request

- go to the firebase auth rest api page
  https://firebase.google.com/docs/reference/rest/auth

- go to sign up with email/password

And there should be an endpoint that looks like this
"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]"

- we need to send this request, so let's create a new service

- create an auth.service.ts file in the auth folder that is responsbile for signing and loging users in

```typescript
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthService {}
```

- create a signup method and let's include the htttpclient so we can handle requests
- inject the httpclient, and then send a post request to that endpoint we look at earlier
- and include your api key

- to retrieve your api key, click on the gear icon -> project settings
- you will find your web api key there and replace [API_KEY] with your API key

```typscfript

  signup(){
    this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]')
  }
```

- the post request also accepts an object with email, password
- the object also takes in the property returnSecureToken and should be set to true
- return the observable so we can subscribe in the auth component

auth.service.ts

```typescript
  constructor(private http: HttpClient){}
  signup(email:string, password:string){
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=API_KEY',
    {
      email:email,
      password: password,
      returnSecureToken: true
    })
  }
```

- let's create a new interface and this will pretty much make up what our auth object will look like based on what response we get. We can view this type of data in firebase in the signup with email/password section

- add it as a generic type for the observable we will return

```typescript
interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
.
.
.
return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=API_KEY',
    {
      email:email,
      password: password,
      returnSecureToken: true
    })
.
.
.

```

### STEP 6. Sending the Signup Request

- navigate to the auth.component.ts file

- abstract the email and password from the form
- add form validation to check for valid submission

```typescript
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    form.reset();
  }
```

- inject the auth Service and call the signup method from our auth service

```typescript
  constructor(private authService: AuthService){}
  .
  .
  .
    const password = form.value.password;
    this.authService.signup(email,password)
    form.reset();
```

- let's subscribe to the observable and output the response and also check for errors

```typescript
this.authService.signup(email, password).subscribe(
  (resData) => {
    console.log(resData);
  },
  (error) => {
    console.log(error);
  }
);
```

- check to see if it's in the login mode and if not, send a sign up request

```typescript
if (this.isLoginMode) {
} else {
  this.authService.signup(email, password).subscribe(
    (resData) => {
      console.log(resData);
    },
    (error) => {
      console.log(error);
    }
  );
}
```

- go to application and test out the application
- Also check out the console and see if your user was submitted into your firebase data
  - authentication -> users

### STEP 7. Error Handling Logic

- let's add some error messages to our auth template

- navigate to auth.component.ts
- create a error value and set it to null

```typescript
isLoginMode = true;
error: string = null;
```

- set the error variable to an error message (ex: "an error occured!") if you get a bad response from the signup observable

```typescript
this.authService.signup(email, password).subscribe(
  (resData) => {
    console.log(resData);
  },
  (error) => {
    console.log(error);
    this.error = "An error occured!";
  }
);
```

- navigate to the auth.component.html file and add the error message

```html
<div *ngIf="error" class="alert alert-danger">
  <p>{{error}}</p>
</div>
```

- check the app if you get an error

** OPTIONAL: Improve the error handling by outputing specific errors, this will require the pipe method and the catchError operator**

### STEP 8. Sending Login Requests

Let's sign the users in.

- navigate to the auth service and create a login method that takes in an email and password
- go to firebase again and look for the endpoint url under sign with email and password
  https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
- make a post request to this endpoint
- return the observable

````typescript
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]',
      {
        email: email,
        password: password,
        returnSecureToken: true
      })

- the authResponseData interface has one extra field called registered, include it as optional and a boolean.

```typescript
interface AuthResponseData {
  .
  .
  .
  localId: string;
  registered?: boolean
}
````

- navigate to the auth.component.ts

- we can now reach out to the login method from our authService and subscribe to it in our auth component

```typescript
.
.
.
    if(this.isLoginMode){
      this.authService.login(email,password).subscribe(resData=>{
        console.log(resData)
      }, error =>{
        console.log(error)
        this.error = "An error occured!"
      })
    }else{
.
.
.
```

- this isn't very dry so let's refactor this
- create a new observable called authObs and make it a type AuthResponseData because that is the type of data we are working with

```typescript
.
.
.
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;
    if(this.isLoginMode){
.
.
.

```

- let's store the observable in the sign up or login and then subscribe afterwords

```typescript
let authObs: Observable<AuthResponseData>;
if (this.isLoginMode) {
  authObs = this.authService.login(email, password);
} else {
  authObs = this.authService.signup(email, password);
}

authObs.subscribe(
  (resData) => {
    console.log(resData);
  },
  (error) => {
    console.log(error);
    this.error = "An error occured!";
  }
);
```

- check the login to see if it works!

### STEP 9: Creating & storing the user data

- let's start storing the user and see if he's authenticated
- this user has all the information like email, password, token, and expiration date.

- under the auth folder, create a user.model.ts file
- include email, id, \_tokenExpirationDate, add getter for \_token

```typescript
export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    return this._token;
  }
}
```

- reason for private is so we as a programer me not change it throughout our code but only to retrieve it.
- in the getter method for token. check to see if the expiration date exists or if the current date is greater than the expiration date, if so return null. That way the user will have to sign in

```typescript
  get token(){
    if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
      return null;
    }
    return this._token;
  }
```

- navigate to the auth.service and store the authenticated user
- create a subject and add its generic type as a user
- reason for this is so we can emit a new user

```typescript
export class AuthService {
  user = new Subject<User>();
```

- in our signup method, let's add a new operator to our observable called the tap operator.
- the tap operator just executes code and nothing else
- in the tap operator, create the user

```typescript
const user = new User(
  resData.email,
  resData.localId,
  resData.idToken,
  expirationDate
);
```

- to calcule the expiration Date, create a variable called expirationDate and set it to a new Date

```javascript
const expirationDate = new Date();
```

- if we include the milliseconds, it will return to us a date.
- let's include today's current time and add that by our expiration time which we have to multiply by 1000 by

```typescript
const expirationDate = new Date(
  new Date().getTime() + +resData.expiresIn * 1000
);
const user = new User(
  resData.email,
  resData.localId,
  resData.idToken,
  expirationDate
);
```

- ultimately this gives us the date in which our token expires

- use the user subject to next the user we just created.

```typescript
const user = new User(
  resData.email,
  resData.localId,
  resData.idToken,
  expirationDate
);
this.user.next(user);
```

- let's clean up the code by creating a function called handleAuthentication
- move the expirationDate, user and the next event to this method

```typescript
      }).pipe(tap(resData=>{
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      }))
  }

  private handleAuthentication(email:string, userId:string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn*1000)
    const user = new User(email, userId, token,expirationDate );
    this.user.next(user);
  }
```

- don't forget to add the same functionality to the login method

```typescript
  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(tap(resData=>{
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      }))
  }

```

### STEP 10: Reflecting the Auth State in the UI

Let's navigate once we sign up or sigin in
We can either navigate in the auth service or in the auth component.

- let's navigate in the auth component
- inject the angular router

```typescript
  constructor(private authService: AuthService, private router: Router){}
```

- in the success observer in the authObs observable, navigate to the bookshelf route

```typescript
    authObs.subscribe(resData=>{
      console.log(resData)
      this.router.navigate(['/bookshelf'])
    }, error =>{
```

- test out the login and sign up and it should redirect you to the bookshelf page

- let's now reflect the changes in the navigation bar

- navigate to the navigation.component.html file
- We would need to disable the bookshelf link tag if we are not logged in
- let's also add a log out button

```html
<li class="nav-item">
  <a class="nav-link" routerLink="/auth" routerLinkActive="active"
    >Authenticate</a
  >
</li>
<li class="nav-item">
  <a class="nav-link" style="cursor:pointer" routerLinkActive="active"
    >Log out</a
  >
</li>
<li class="nav-item">
  <a class="nav-link" routerLink="/library" routerLinkActive="active"
    >Library</a
  >
</li>
```

- now we need to know whether we have a valid token
- in the auth service, let's assume our user is our source of truth and change the ui accordingly whether the user is null or contains valid information

- navigate to the navigation.component.ts file
- inject auth service
- inside ngOnIt, setup a subscription to the user and then add a subscription variable and then unsubscribe on ngondestroy

```typescript
export class NavigationComponent implements OnInit, OnDestroy {
  collapsed = true;
  show = false;
  private userSub: Subscription;
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.userSub = this.authService.user.subscribe();
  }

  onSaveData() {
    this.dataStorageService.storeBooks();
  }

  onFetchData() {
    this.dataStorageService.fetchBooks().subscribe();
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
```

- inside subscribe, we can check whether or not the user exists
- create a new class variable called isAuthenticated and set that to false and set the value accordingly

```typescript
  isAuthenticated = false;
  private userSub: Subscription;
  constructor(private dataStorageService: DataStorageService, private authService: AuthService){}
  ngOnInit(
  ) {
    this.userSub = this.authService.user.subscribe(user=>{
      this.isAuthenticated = !!user;
      // if user is null
      // !user -> true
      // !!user -> false
      // if user exists
      // !user -> false
      // !!user -> true
    });
  }
```

- navigate to the navigation.component.html file to update it

- when logged in, user should see the manage dropdown, the logout button and the bookshelf
- when the user is not logged in, the user sees the authneticate page
- you don't have to be authenticated to see the library page

```html
.
.
.
      <li class="nav-item" *ngIf="isAuthenticated">
        <a class="nav-link" routerLink="/bookshelf" routerLinkActive="active"
          >Bookshelf</a
        >
      </li>
      <li class="nav-item" *ngIf="!isAuthenticated">
        <a class="nav-link" routerLink="/auth" routerLinkActive="active"
          >Authenticate</a
        >
      </li>
      <li class="nav-item" *ngIf="isAuthenticated">
        <a class="nav-link" style="cursor:pointer" routerLinkActive="active"
          >Log out</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" routerLink="/library" routerLinkActive="active"
          >Library</a
        >
      </li>
    </ul>
    <ul class="navbar-nav" *ngIf="isAuthenticated">
      <li class="nav-item dropdown">
      .
      .
      .
```

- check the application and then log in with valid credentials

- let's fetch our data now that we are authenticated using our user token

### STEP 11: Adding Token to Outgoing requests

- We still need to implement our token to our requests so that firebase knows we have a valid token

- navigate to the data storage and inject the auth Service so we get our user

- we need to somehow get our token but we don't want to have to subscribe

- navigate to the auth service and create a class variable called token of type string that is set to null;

- Let's change our user to a behaviorSubject so that whenever the data is changed, it is emmited. The difference is, it gives subscribers the immediate previous values, that allows us to get us the values once the subscribers logged in previously.

```typescript
export class AuthService {
  user = new BehaviorSubject<User>(null);
  token: string = null;
```

- null is a valid to use as a starter for the user because it is essentially empty until the user logs in or is already logged in which we haven't created that functionality yet.

- navigate to the data storage service

  - we can now reach out to the auth service user and get the currently active user

  - we don't want to subscribe to the user here, we just want to stream the data once and be done with it which will unsubscribe right after.
  - so when we fetch the books, let's incorporate pipe and the take operator.

```typescript

  fetchBooks(){
    this.authService.user.pipe(take(1))
    return this.http.get<Book[]>("https://bookit-d432823-d324efault-rtdb.firebaseio.com/books.json")
    .pipe(tap(books=>{
      this.bookShelfService.setBooks(books)
    }))
  }
```

- So now we have two observables, the user observable and the htpp observable
  - what we can do is pipe both observables into one observable. To do this we have to incorporate the exhaustMap operator. It waits for the first observable(the user) to complete and then gives us the user, then it will be replaced by the new observable(http) we return
- this way, we can use the user token

```typescript
  fetchBooks(){
    return this.authService.user.pipe(take(1), exhaustMap(user=>{
      return this.http.get<Book[]>("https://bookit-d4823-defau34lt-rtdb.firebaseio.com/books.json")
      .pipe(tap(books=>{
        this.bookShelfService.setBooks(books)
      }))
    }))
  }

```

- we don't need the pipe method for the http observable, we can now incorporate a tap operator because it will take in the http value

```typescript
  fetchBooks() {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<Book[]>("https://bookit-d3453454823-default-rtdb.firebaseio.com/books.json")

    }),
      tap(books => {
        this.bookShelfService.setBooks(books)
      }))
  }
```

- Now let's extract the token and add it to the request or use HttPParams to set auth

```typescript
  fetchBooks() {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<Book[]>("https://bookit-default-rtdb.firebaseio.com/books.json", {
        params: new HttpParams().set('auth', user.token)
      })
    }),
```

- check the application, log in and fetch data

### STEP 12: Attaching the token with an interceptor

- So now we want to incorporate this with the store feature in the data storage service
- There is a feature in httpClient that allows us to do just this by manipulating the same requests all in the same way instead of doing it twice.

- let's create a file under auth called auth-interceptor.service.ts

```typescript
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptService {}
```

- don't use the provided property for injectable as we will have to configure it different in the app module

- lets implement the httpinterceptor interface that forces us to create a intercept method

```typescript
import { Injectable } from "@angular/core";
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
@Injectable()
export class AuthInterceptService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {}
}
```

- the httprequest will know all the data we request it will return, and next is the httphandler

- let's inject the auth service and then return the next.handle(req) observable

```typescript
export class AuthInterceptService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req);
  }
}
```

- at this point we are looking to subscribe to the authservice user so let's combine both observables.

```typescript
  intercept(req: HttpRequest<any>, next: HttpHandler){
    return this.authService.user.pipe(take(1), exhaustMap(user=>{
      return next.handle(req);
    }))
  }
```

- now we can edit the request based on the user

- clone the req and update the params

```typescript
  intercept(req: HttpRequest<any>, next: HttpHandler){
    return this.authService.user.pipe(take(1), exhaustMap(user=>{
      const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)})
      return next.handle(modifiedReq);
    }))
  }
```

- add this to app.module
- Use the provide property set to HTTP_INTERCEPTORS, this is the identifer for the provider
- target specific service
- set the mult property to true so we can have more than 1 interceptors

```typescript
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptService, multi: true}],
bootstrap: [AppComponent],
```

- navigate to the data-storage.service, and now refactor the fetchBooks method. Include pipe to take in the tap operator so we can set our books.

```typescript
  fetchBooks() {
      return this.http.get<Book[]>("https://bookit-d48rty23-default-rtdb.firebaseio.com/books.json", {
      }).pipe(
      tap(books => {
        this.bookShelfService.setBooks(books)
      }))
    }
```

- Now if we check the log in, we get an error which happens to be from the interceptor.

- The reason is when we set our user to null, our interceptor is grabbing the token from a user that is set to null, what we can do is add a condition to the intercept method that checks to see if the user is null

navigate to the auth-interceptor.service.ts

```typescript
if (!user) {
  return next.handle(req);
}
const modifiedReq = req.clone({
  params: new HttpParams().set("auth", user.token),
});
return next.handle(modifiedReq);
```

- try to log in and fetch data

### STEP 13: Adding Logout

- Let's make a logout functionality

- navigate to the auth.service.ts file
- create a logout method
- set the user to null;

```typescript
 logout(){
  this.user.next(null);
}
```

- link the logout method to our navigation bar

```typescript
  onLogout(){
    this.authService.logout();
  }
```

- navigate to the navigation.component.html file
- add a click event and set it to onLogout for the logout button

```html
<li class="nav-item" *ngIf="isAuthenticated" (click)="onLogout()">
  <a class="nav-link" style="cursor:pointer" routerLinkActive="active"
    >Log out</a
  >
</li>
```

- once we logout, let's navigate to the auth page,
- navigate to the auth service and inject router

```typescript
  logout(){
    this.user.next(null);
    this.router.navigate(['/auth'])
  }
```

- try logging in and then logout

### STEP 14: Adding Auto-Login

- let's keep the token when refresh the page and incorporate that in our code
- We have to store it in a persisted storage and we can use localstorage which the browser holds

- navigate to the auth.service.ts file

- in the handle authentication, we can then set item to the userData

```typescript
  private handleAuthentication(email:string, userId:string, token: string, expiresIn: number){
    .
    .
    .
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user))
  }
```

- if you log in, go to the dev tools -> application -> local storage -> http://localhost:4200
- you can see your user storage

- we can then retrieve the data when we go to our application

- create a method called autoLogin and retrieve the user data
- check to see if the user data exists and parse the data back to an object

```typescript
  autoLogin(){
    const userData = JSON.parse(localStorage.getItem('userData'));

    if(!userData){
      return;
    }

  }
```

- we can create a new User and pass in user Data. Our user subject only takes in type User which is why we have to do this.
- we can convert the expiration data into a date as it is a string

```typescript
const userData: {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
} = JSON.parse(localStorage.getItem("userData"));
if (!userData) {
  return;
}

const loadedUser = new User(
  userData.email,
  userData.id,
  userData._token,
  new Date(userData._tokenExpirationDate)
);
```

- check to see of the token exists and if it does, emit the loaded User

```typescript

  const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
  if (loadedUser.token) {
    this.user.next(loadedUser);
  }
}
```

- let's go to app component so once the app loads, we check to see if we already logged in before.

- navigate to the app.component.ts file
- get rid of the unecessary variables
- implement oninit and inject authService, call the autologin

app.component.ts

```typescript
  constructor(private authService: AuthService){}
  ngOnInit(){
    this.authService.autoLogin();
  }
```

- check to see if it works

### STEP 15: Adding Auto-Logout (OPTIONAL)

Our token will never expire but our application will never reflect that. If the token expires, nothing changes, we will stay log in.

- navigate to our auth service
- in the logout method, remove the information in user data from local storage

```typescript
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData');
  }
```

- Let's set a timer for when the token is stored.
- create a method called auto logout to create a timer
- take in a duration as a parameter and create a timeout targeting that duration

```typescript
  autoLogout(expirationDuration: number){
    setTimeout(()=>{
      this.logout();
    }, expirationDuration)
  }
```

- we need to clear the timer when we logout
- create a variable to keep track of this timer

```typescript
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  token: string = null;
```

- set it to our timer

```typescript
  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout();
    }, expirationDuration)
  }
```

- in the logout method, we need to clear this timer

```typescript
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }
```

- Call auto logout to make sure this timer starts
- Whenever we emit a new user to our application

- in handle authnetication method, we can do just this

```typescript
this.user.next(user);
this.autoLogout(expiresIn * 1000);
localStorage.setItem("userData", JSON.stringify(user));
```

- in auto Login, we can call autologin() when the loaded user is valid
- then we have to calculate the expiration duration

```typescript
if (loadedUser.token) {
  this.user.next(loadedUser);
  const expirationDuration =
    new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
  // future date minus today's date
  // gives us the duration of how much longer we have
  this.autoLogout(expirationDuration);
}
```

- we can check if the timer works out correctly by changing the expirationDuration temporarily to 2000 which is 2 seconds

  autoLogout(expirationDuration: number){
  this.tokenExpirationTimer = setTimeout(()=>{
  this.logout();
  }, 2000)
  }

- login to see if it works and then change it back to expirationDuration after you show the demonstration

### STEP 16: Adding an Auth Guard

- We are going to prevent users from going to the bookshelf when they aren't authenticated
- We are going to have implement a route guard, before the route is loaded we can run some logic using the route guard

- under the auth folder create a auth.guard.ts file

- implement Can Active to the class, we need the injectable because this is a service

```typescript
import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {}
```

- in the canActivate method, we need to incorporate a ActivatedRouteSnapshot parameter and a RouterStateSnapshot parameter

```typescript
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

  }
```

- the canActivate method needs to return a boolean, a promise type boolean, or a observable type boolean

```typescript
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean>{

  }
```

- inject the authService so we can see if the user is authetnicated or not by looking at the user's subject

- Then return the user observable. however, we ned to check if the user exists and we need to return an observable of type boolean.

- use the pipe method so we can use the map operator, this case we can return a different value

```typescript
  constructor(private authService: AuthService){}
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean>{
  return this.authService.user.pipe(map(user=>{
    return !!user;
  }))
}
```
- now we can add it to app routing module

- navigate to the app-routing.module.ts file

- we want to protect the bookshelf route, so add the canActivate property and set it to the auth guard

```typescript
  {
    path: 'bookshelf',
    component: BookshelfComponent,
    canActivate: [AuthGuard],
    children: [
```

- check to see if you can go to the bookshelf route without being authenticated
- it works however, our content is missing
- we can redirect the user by using a urlTree
- check to see if the user is authenticated and if so return true
- if not, inject router and return a created url tree navigating to the auth page

- update the interfact to the canActivate to also return UrlTree

```typescript
  constructor(private authService: AuthService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(map(user=>{
      const isAuth = !!user;
      if(isAuth){
        return true
      }else{
        return this.router.createUrlTree(['/auth'])
      }
    }))
  }
```

- check to see if you can go to the bookshelf route without being authenticated and it should work!


- One problem is, we have an ongoing subscription, incorporate the take operator so we don't have an ongoing listener for this
```typescript
    return this.authService.user.pipe(take(1), map(user=>{
      const isAuth = !!user;
      if(isAuth){
        return true
```


### STEP 17: Adding an environmental variable

To keep our api secret, we can put our key in our environment.ts file

- navigate to the auth service and copy or api key

- navigate to the enviornment.ts file and store your apikey in a property inside environment

```typescript
export const environment = {
  production: false,
  firebaseAPIKey: "AI34rZP_FVkjCR345Ws"
};

```

- copy the property and do the same thing for the environment.prod.ts file as it will be used for production

- we can now go back to the auth service, import the values and add this query to the requests

```typescript
.
.
.
 return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
 .
 .
 .
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.firebaseAPIKey,
.
.
.
```
