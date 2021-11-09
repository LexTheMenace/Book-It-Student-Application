# Class 14 - Dynamic Components & Angular Modules and Optimization

---

## What are dynamic components?


- Components you load through code, e.g an alert or an overlay that is triggered by an event or action. 

- To demonstrate this in our app, we will create a modal to replace our alert when we add books to our Library.

### Using ngIf

Creating the component
- In the shared folder, create a new folder called alert, and create files alert.component.ts, alert.component.html, and alert.component.css inside.

- In alert.component.ts, build the alert component:
    ```ts
    import { Component } from '@angular/core';

    @Component({
        selector: 'app-alert',
        templateUrl: './alert.component.html',
        styleUrls: ['./alert.component.css']
    })

    export class AlertComponent {}
    ```

- In alert.component.html, create a div to house our backdrop, and a div to display the alert: 
    ```html
    <div class="backdrop"></div>
    <div class="alert-box">
        <p>{{ message }}</p>
        <div class="alert-box-actions">
            <button>Close</button>
        </div>
    </div>
    ``` 

- In alert.component.ts, add the message property we added to our html to the component, using @Input: 
    ```ts
    @Input() message: string;
    ```

- In app.module.ts, add the Alert Component to the declarations array.

Adding the Alert to HTML 
- In library.component.html, add our app-alert component to the top or bottom of the file. 

- Set the message property to alert, and use `*ngIf` to conditionally render the alert only if the alert variable is not null.

    ```html
        <app-alert [message]='alert' *ngIf="alert" closeBtn='false' ></app-alert>
    ``` 

Style the Alert
- In alert.component.css, 

    ```css
    .backdrop{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.788);
        z-index: 50;
    }

    .alert-box{
        position: fixed;
        top: 30vh;
        left: 20vw;
        width: 60vw;
        padding: 16px;
        z-index: 100;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    }
    ```
Creating the Alert Condition

- In library.component.ts, create a variable named alert with a type of string.

- Inject our book service in the constructor.

- Create and store a subscrtiption to our bookSelected subject with ngOnInit, so we can receive the data of the book we're adding. 

- Don't forget to unsubscribe from this subscription with ngOnDestroy.

    Your LibraryComponent class should look like this: 
    ```ts
    export class LibraryComponent implements OnInit, OnDestroy {
    alert: string; 

    private bookSelectSub: Subscription;

    constructor(private bsService: BookshelfService) { }

    ngOnInit(): void {
        this.bookSelectSub = this.bsService.bookSelected.subscribe( bookData => {        
        });
    }
    
    ngOnDestroy(){
        this.bookSelectSub.unsubscribe();
    }
    }
    ```

- Inside our subscribe method, set `this.alert` to the string you'd like displayed when a user adds a book. You can use properties of the book, such as title, to give the user more information.
    ```ts 
    this.alert = `${bookData.title} by ${bookData.author} was added to your library!`;
    ```

Removing the Alert Condition and Closing the Modal
- In alert.component.html, register a click listener to our alert close button and backdrop div that calls an onClose function.

- In alert.component.ts, create the onClose function, and emit an event using @Output

    ```ts
    @Output close = new EventEmitter<void>();
    
    onClose(){
        this.close.emit()
     }

    ```
- In library.component.html, add the close listener to the <app-alert> element, calling a handleClose method.

- In library.component.ts, create the handleClose method, and set `this.alert` to null.

- Check that the alert close is working.

### Programmatic Creation 

- We will also show an alert when a book is removed from our library, for this we will use the Dynamic Component Loader.

Creating the Alert Condition
- In bookshelf.service.ts, use our bookSelected subject's next method to pass the book you're removing to our bookshelf component. 

- In bookshelf.component.ts bring in the bookService and set up the subcription as we did for the last method. 
    
    ```ts
    import { Component, OnInit, OnDestroy } from '@angular/core';
    import { Subscription } from 'rxjs';
    import { BookshelfService } from './bookshelf.service';

    @Component({
        selector: 'app-bookshelf',
        templateUrl: './bookshelf.component.html',
        styleUrls: ['./bookshelf.component.css']
    })

    export class BookshelfComponent implements OnInit, OnDestroy {

        private bookSelectSub: Subscription;
        constructor(private bsService: BookshelfService) { }

        ngOnInit(): void {
            this.bookSelectSub = this.bsService.bookSelected.subscribe(bookData => {
    
            });
        }
        
        ngOnDestroy(){
            this.bookSelectSub.unsubscribe();
        }
    }
    ```

Adding the Alert to the DOM

- Create a private method in BookshelfComponent called `showRemoveAlert()`, that takes a parameter 'message', type string. 

- Create a variable with the message string you want the alert to show, and call showErrorAlert inside our subscribe method, passing the message as a parameter. 
    ```ts
    const alertMessage = `Book: ${book.title} was removed from your library!`
    this.showRemoveAlert(alertMessage);
    ```

- Inject the ComponentFactoryResolver as a private property.

- Inside the showRemoveAlert method, use the componentFactoryResolver, and call the resolveComponentFactory method.

- Import the AlertComponent you created earlier into the file, and pass it to `resolveComponentFactory()`.

- This method will return a component factory (for the component passed, in our case, alert), store this in a variable within the function. We'll call ours alertCmpFactory.

- To tell Angular where we want to add this component, we will use a ViewContainerRef. This creates a reference to a place in the DOM, with methods that allow us to interact with it. In this case, we will create a component there.

- Create a Directive named Placeholder, and inject ViewContainerRef.
    ```ts
    import { Directive, ViewContainerRef } from '@angular/core';

    @Directive({
        selector: '[appPlaceholder]'
    })

    export class PlaceholderDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
    }
    ```
- Declare the directive in the app module.

- At the top of bookshelf.component.html, add a directive called <ng-template>, and add the appPlaceholder directive.

- We gain access to this place in the DOM without actually rendering an element.

- In the bookshelf.component.ts file, add `@ViewChild(), passing the PlaceholderDirective, and store it in a property named alertHost.

- In our showRemoveAlert method, create a variable called hostViewContainerRef and store this.alertHost.viewContainerRef. This is how we access our appPlaceholder.

- Add hostViewContainerRef's clear method to clear anything that may have been inside the view container already.

- Use hostViewContainerRef's createComponent method, passing the alertCmpFactory to it. This will create a reference to or component. Assign it to a variable, componentRef.

    The function should look like this:
    ```ts

    showRemoveAlert(message: string){
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        }
    } 

    ```
 * If you get an error that the component factory could not be found, you need to add an entryComponents array to your app.module NgModule decorator, with the AlertComponent inside.


Data and Event Binding

- The component ref has an instance property, which gives us access to the properties of our alert component.

- Set the message property to the message we pass when we call the function.

- To listen to our close event, subscribe to it and store it in a variable so we can unsubscribe as well.

- When this event is emitted, we will first unsubscribe from our close subscription, and clear the hostViewContainerRef with its clear method. 

- Check that the alert is working.

- In ngOnDestroy, use an if statement to check if we have a close subscription, and unsubscribe if we do. 

    Your bookshelf component should look like this:
    ```ts
    import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
    import { Subscription } from 'rxjs';
    import { AlertComponent } from '../shared/alert/alert.component';
    import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
    import { BookshelfService } from './bookshelf.service';

    @Component({
        selector: 'app-bookshelf',
        templateUrl: './bookshelf.component.html',
        styleUrls: ['./bookshelf.component.css']
    })

    export class BookshelfComponent implements OnInit {
    private bookSelectSub: Subscription;
    private closeSub: Subscription;

    constructor(private bsService: BookshelfService, private componentFactoryResolver: ComponentFactoryResolver) { }
    
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

    ngOnInit(): void {
        this.bookSelectSub = this.bsService.bookSelected.subscribe(book=>{
        const alertMessage = `Book: ${book.title} was removed from your library!`
        this.showRemoveAlert(alertMessage);
        });
    }
    
    ngOnDestroy(){
        this.bookSelectSub.unsubscribe();
        if(this.closeSub){
        this.closeSub.unsubscribe();
        }
    }

    showRemoveAlert(message: string){
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
         
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }  
    }

    ```
## Modules & Optimizations

- Working with mulitple modules and how that benefits our app.

- General optimizations to make it faster, more performant, and prepare for deployment

What are modules (in Angular)? 

- Modules make Angular aware of the files in the project you want to use.

- Angular analyzes ngModules to understand your application and features.

- Angular modules define the Components, Directives, and Services used by your app.

- Must have at least one (App) module, but may be split into multiple.

- Core features of Angular are included in Angular Modules such as the FormsModule, so they're only loaded when we need them.

- You cannot use a feature/building block without including it in a module, by adding it to declarations or providers, depending on the feature.

Why split modules? 
- Make existing modules leaner and easier to maintain, for example, putting our app routes in a seperate module. 

- Every module works on its own, they do not communicate with each other. You need to export anything you want to be available in another module that imports this module. 
    * The exception is services provided in your app.module are accessible throughout the app.

Feature Modules
- Feature Modules group related components together, which help our application run faster by not loading certain modules until they're needed, which we'll explore later.

- Our app has 3 feature areas the Bookshelf, Library, and Auth.

- Next we will break divide our app into feature modules, starting with our BookShelf.

- Take all logic that is used only for the bookshelf and create a new module in bookshelf.module.ts
    Be sure to remove the appropriate imports and declarations from app.module.

    ```ts
    import { NgModule } from "@angular/core";
    import { BookshelfHomeComponent } from './bookshelf-home/bookshelf-home.component';
    import { BookshelfEditorComponent } from './bookshelf-editor/bookshelf-editor.component';
    import { BookshelfComponent } from './bookshelf.component';
    import { BookListComponent } from './book-list/book-list.component';
    import { BookDetailsComponent } from './book-details/book-details.component';

    @NgModule({
      declarations: [
        BookshelfComponent,
        BookListComponent,
        BookDetailsComponent,
        BookshelfHomeComponent,
        BookshelfEditorComponent
      ],
      exports: [
        BookshelfComponent,
        BookListComponent,
        BookDetailsComponent,
        BookshelfHomeComponent,
        BookshelfEditorComponent 
      ]
    })
    export class BookshelfModule {

    }
    ```
- In app.module, import the BookshelfModule, and add it to the imports array in ngModule.

- If you go to our app, you'll see a router-outlet is not a known element, we have to import RouterModule to our BookshelfModule, since we use router-outlet directive there.
 * Remember: You do not have access to the imports in app.module.

- BrowserModule only needs to run once, use the CommonModule in features to access directives like ngIf and ngFor.

- Import the ReactiveFormsModule, and any other necessary modules until the app is working again.

Adding Routes

- Pass an array of routes to Router.forChild() to merge these routes with the root routes.

- Next we'll create a bookshelf routing module, and move our bookshelf related routes inside. 


    Your bookshelf-routing.module should look like this: 
    ```ts 
    import { NgModule } from "@angular/core";
    import { RouterModule, Routes } from "@angular/router";
    import { BookshelfEditorComponent } from '../bookshelf/bookshelf-editor/bookshelf-editor.component';
    import { BookDetailsComponent } from '../bookshelf/book-details/book-details.component';
    import { BookshelfHomeComponent } from '../bookshelf/bookshelf-home/bookshelf-home.component';
    import { BookshelfComponent } from '../bookshelf/bookshelf.component';
    import { BooksResolverService } from '../bookshelf/books-resolver.service';
    import { AuthGuard } from '../auth/auth.guard';

    const routes: Routes = [
        {
            path: 'bookshelf',
            component: BookshelfComponent,
            canActivate: [AuthGuard],
            children: [
            { path: '', component: BookshelfHomeComponent },
            { path: 'new', component: BookshelfEditorComponent },
            { path: ':id', component: BookDetailsComponent, resolve: [BooksResolverService] },
            { path: ':id/edit', component: BookshelfEditorComponent, resolve: [BooksResolverService] },
            ],
        }
    ];

    @NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })

    export class BookshelfRoutingModule{};
    ```

- Import BookshelfRoutingModule to BookshelfModule imports.

- Check the app is still working. 

- Repeat these steps for to create LibraryModule and AuthModule, though you don't need to create a separate module for routes in these files.

Component Declarations

- Components must be part of Declarations as well as Routing Module.

- We can remove our exports from BookshelfModule, these components are only used internally in the module, or loaded through routes.

Shared Modules

- In the shared folder, create shared.module.ts. 

- In this module, import and export all components and modules that are used by multiple features. 

    ```ts
    import { CommonModule } from "@angular/common";
    import { NgModule } from "@angular/core";
    import { AlertComponent } from "./alert/alert.component";
    import { BookComponent } from "./book/book.component";
    import { DropdownDirective } from "./dropdown/dropdown.directive";
    import { PlaceholderDirective } from "./placeholder/placeholder.directive";

    @NgModule({
        declarations: [
            AlertComponent,
            PlaceholderDirective,
            DropdownDirective,
            BookComponent
        ],
        imports: [
            CommonModule
        ],
        exports: [
            AlertComponent,
            PlaceholderDirective,
            DropdownDirective,
            CommonModule,
            BookComponent
        ]
    })

    export class SharedModule{}
    ```
- Add the shared module to the imports array of our library and bookshelf modules. 

- You can only declare Components, Directives, and Pipes once, but we can import the shared module in mutiple places. Therefore we need to remove duplicates from our app.module, and import the SharedModule instead. 
    * If you used entryComponents, you can also move that array to the SharedModule.

Core Module
- We don't need to use the core module in our app, because we use providedIn for our services. However we could create a CoreModule for services if we were providing them in our app module. You do not need to export services from this module.

## Optimization ##

**Lazy-Loading**

- Using multiple feature modules is required for lazy loading.

- Only load the module once the corresponsing route is hit, instead of loading all modules at once.

- This gives us faster loading, because there is less code to load initially. Only downloading and parsing more code when we need it.

Lazy Load Bookshelf Module

- Must have routes registered in the feature module, feature module must have its own route config with forChild.

- Change bookshelf route path to an empty string.

- In app-routing.module.ts, add a route with the path bookshelf. Instead of loading a component, add the loadChildren property, with a function that imports the module you want to load.
    ```ts
    { path: 'bookshelf', 
    loadChildren: () => import('./bookshelf/bookshelf.module').then(m => m.BookshelfModule) }
    ```

- Now this module will only be loaded when the user visits that path. 

- Remove the bookshelf module and import statement from app.module.

- Repeat for Library and Auth modules.

Optimizing Lazy Loading
- Only loading modules when needed could create delays in our app, we will prevent that with preloading.

- In app-routing.module.ts, pass a second argument to RouterModule.forRoot, an object with a preloadingStrategy set to PreloadAllModules (imported from '@angular/router').

- Now our inital load is still small, but Angular will load the other modules soon after, so they're available before the user requests them.

**Services and Modules**

- Services can be provided in the AppModule, and the same instance of that service will be used application wide.

- Service provided in the app (or other) components, the service will be available in that component tree, not apllication-wide.

- Eager loaded - Service available app wide, but can be hard to find where it's provided. (AVOID)

- Lazy-Loaded Module - Use if you want to have a seperate instance of that service.

Loading services diffrently 

- Create a logging service to demonstrate how providing services in different places creates different instances.

    ```ts
    import { Injectable } from "@angular/core";

        @Injectable({ providedIn: 'root' })
    export class LoggingService {
        lastlog: string;

        printLog(message: string){
            console.log(message);
            console.log(this.lastlog);
            this.lastlog = message;
        }
    };
    ```
- Inject this service into app.component.ts, and call the printLog method inside ngOnInit, passing a string such as 'Hi from App Component.'

- Do the same for library.component.ts, replacing App with Library in the message.  

- In the browser, view the console, and navigate to the library page. Note that the same service is used, because the previous message is not undefined.

- Comment out the injectable line in logging.service.ts and provide it in the App Module. You should see the same effect.

- Now provide it in the LibraryModule as well. Note how the service is now two seperate instances.

- Remove the service from App and Library, and provide it in the shared module. Note that there are still two seperate instances of the service running. 
<!-- 
Ahead-of-Time Compilation vs. Just-in-Time Compilation


JiT- Angular compiler runs in the browser at runtime.

AoT - Compiled before deployment. 

ng build (prod deprecated) -->