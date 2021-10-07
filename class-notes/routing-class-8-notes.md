# Class 8 - Changing Pages With Routing

---

## Class Outline

1. Add App Routing for base routes.
2. Re-Add Navigation to our app.
3. Add Child Routes for Bookshelf Component.
4. Configuring Route Parameters.
5. Passing Dynamic Params to/through Links.
6. Adding Edit Book Routes.
7. Programatic Edit Book Links

---

---

## Routing Overview

- **SPA** (Single Page Application): Loads routes using javascript instead of sending a request to the server and receving back an HTML file. This allows for super fast loading, a persistant state across pages, and a more "app-like" feel.

- Every route needs a path and either a component to render or a redirect to a route that loads a component.

- Use the `<router-outlet></router-outlet>` tag to dynamically render the component we want based on the url path.

- To route between pages, use "routerLink" instead of "href" on anchor tags to prevent page reloading.

- On the routerLink, if you omit the preceding "/"... you are creating a relative route to the page you are currently on, while adding the slash creates an absolute path to the base url of your website.

- Dyamically set the active anchor tab in the navigation bar by setting "routerLinkActive" property to "active" on every item.

- You can navigate between pages programatically by using the built in "@angular/router" router.navigate() method.

- Add parameters to your route by adding the ":custom-slug" to the path variable. eg: { path: "/servers/:id" }, where id is whatever is passed in the url after /servers.

- We can get access to the data passed as the ":custom-slug" by using the snapshot.params object that is available by importing {ActivatedRoute} from "@angluar/router".

- Every link has a bindable property "[queryParams]" which allows you to send key value pairs through the url. This can also be done programatically. We retrieve this information similar to the last step.

- You can nest routers by adding a children property on the path that will hold all the child routes.

- To catch all routes that aren't covered by your app, add a new route at the end of your routes array with a path="\*\*" and redirect to whatever component you want (usually a not-found page).

- It is common practice to have an `app-routing.module.ts` file that loads all of your routes.

- To protect certain routes from being accessed by users without permision, create a AuthGaurd Class that implements Angluar router's "CanActivate" or "CanActivateChild".

- Keep user from accidently navigating away by using "CanDeactivate" Gaurd

---

---

## Project Steps

### STEP 1: Setting Up Our Basic Routes

#### Inside App folder

- CREATE: `app-routing.module.ts` file.

- ADD: appRoutes variable with our list of main routes (root, bookshelf, library).

- ADD: NgModule imports and exports.

_RESULT_:

```typescript
import { LibraryComponent } from './library/library.component'
import { BookshelfComponent } from './bookshelf/bookshelf.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const appRoutes: Routes = [
  { path: '', redirectTo: '/bookshelf', pathMatch: 'full' },
  { path: 'bookshelf', component: BookshelfComponent },
  { path: 'library', component: LibraryComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

#### Inside app.module.ts

- ADD: our `AppRoutingModule` to the `App.module.ts` imports.

#### Inside app.component.html & app.component.ts

- REPLACE: the bookshelf and library tags with `<router-outlet></router-outlet>`.

- REMOVE: the featureSelected property on the navigation tag and the onSelect() function in app.component.ts.

---

### STEP 2: Adding Navigation back to our App

#### Inside app/shared/navigation HTML file

- REMOVE: click listeners and href attributes.

- ADD: routerLink attribute and point to "/bookshelf" and "/library" respectively.

- ADD: routerLinkActive="active" attribute on both links.

- REPLACE: the dropdown menu (settings anchor tag) href with a "cursor: pointer" styles attribute.

_RESULT_:

```typescript
<a class="navbar-brand brand" id="brand" routerLink="/bookshelf">BookIt</a>

    // . . .

<li class="nav-item">
    <a class="nav-link" routerLink="/bookshelf" routerLinkActive="active">Bookshelf</a>
</li>
<li class="nav-item">
    <a class="nav-link" routerLink="/library" routerLinkActive="active">Library</a>
</li>

    //   . . .

<a
    class="nav-link dropdown-toggle"
    style="cursor: pointer"
    id="navbarDropdownMenuLink"
    data-toggle="dropdown"
    aria-haspopup="true"
    [attr.aria-expanded]="show"
    (click)="show = !show"
    [class.show]="show"
>
Settings
</a>
```

#### Inside app/shared/navigation TS file

- REMOVE: the eventEmitter Output and onSelect() function.

#### Inside app/shared/book HTML file

- REMOVE: the href attribute on the anchor tag.

- ADD: a style attribute and add "cursor: pointer".

---

### STEP 3: Adding Child Routes

#### Inside app/bookshelf folder

- ADD: a bookshelf home page by running `ng g c bookshelf/bookshelf-home`.

- ADD: an h3 tag inside the HTML saying "Please Select a Book!"

#### Inside app-routing.module.ts file

- ADD: a children property to the bookshelf path.

- ADD: a route object for the bookshelf-home, book-details, and book-edit components. (Do them one at a time).

_RESULT_:

```typescript
const appRoutes: Routes = [
  { path: '', redirectTo: '/bookshelf', pathMatch: 'full' },
  {
    path: 'bookshelf',
    component: BookshelfComponent,
    children: [
      { path: '', component: BookshelfHomeComponent },
      // { path: 'new', component: BookshelfEditorComponent },
      // { path: ':id', component: BookDetailsComponent },
      // { path: ':id/edit', component: BookshelfEditorComponent },
    ],
  },
  { path: 'library', component: LibraryComponent },
]
```

#### Inside app/bookshelf HTML file

- ADD: `<router-outlet></router-outlet>` in place of the book-details and ng-template.

#### Inside app/shared/book HTML & TS file

- REMOVE: the onSelect() method and bookshelfService import.

---

### STEP 4: Configuring Route Parameters

#### Inside app/bookshelf/book-details TS file

- REMOVE: the @Input().

- ADD: `private route: ActivatedRoute` inside the constructor (and import from "@anglular/router").

- ADD: a subscription to the route.params observable inside NgOnInit() and set an id to the params['id].

- SET: this.book equal to the new getBook() method you will create from the bookshelfService and pass in this.id.

_RESULT_:

```typescript
book: Book;
id: number;

constructor(
    private bookshelfService: BookshelfService,
    private route: ActivatedRoute
) {}

ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
    this.id = +params['id'];
    this.book = this.bookshelfService.getBook(this.id);
    });
}
```

#### Inside app/bookshelf/bookshelf.service.ts file

- ADD: a getBook (by id) method.

_RESULT_:

```typescript
getBook(id: number) {
    return this.myBooks[id];
}
```

---

### STEP 5: Passing Dynamic Params to Links

#### Inside app/bookshelf/book-list HTML file

- ADD: a bound property index and pass to the `<app-recipe-item>` tag using the index from the \*ngFor loop.

#### Inside app/shared/book HTML & TS files

- ADD: an Input() for the idx we just passed in from the book-list.

- ADD: Dynamic routing by adding to the anchor tag [routerLink]="[idx]".

- ADD: routerLinkActive attribute to style the currently selected book.

---

### STEP 6: Adding Book Edit Functionality

#### Inside bookshelf folder

- ADD: a bookshelf-edit component by running `ng g c bookshelf/bookshelf-editor`.

- REGISTER: the new routes in the app-routing.module.ts file.

- ADD: the ActivatedRoute params observable inside the NgOnInit() and set this.id equal to +params['id'].

- ADD: isEditMode variable to conditionally render based on what mode we are using / what route we are on.

_RESULT_:

```typescript
export class BookshelfEditorComponent implements OnInit {
  id: number
  isEditMode = false

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']
      this.isEditMode = params['id'] != null
      console.log('%c  isEditMode: ', 'color: red;', this.isEditMode)
    })
  }
}
```

---

### STEP 7: Programatic Edit Book Links

#### Inside app/bookshelf/book-list TS & HTML files

- ADD: (click) event listener on the Add New Book Button.

- ADD: "onNewBook()" function in the typescript file and inject the angular Router and ActivateRoute into the constructor.

_RESULT_:

```typescript
onNewBook() {
    this.router.navigate(['new'], { relativeTo: this.route });
}
```

#### Inside app/bookshelf/book-details TS & HTML files

- Add (click) listener to the Edit Book Button

- ADD: Angular Router to constructor and create the onEditBook() function.

_RESULT_:

```typescript
onEditBook() {
    this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
}
```

---

---

## Extra Resources

- [Angular Docs - Router Reference](https://angular.io/guide/router-reference)
- [Angular Docs - Common Routing Tasks](https://angular.io/guide/router)
- [Angular 12 Routing Tutorial App](https://www.positronx.io/angular-router-tutorial/)
