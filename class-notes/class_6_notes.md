# Class 6 - Directives Deep Dive

**Building and Using a Dropdown Directive**

Next we'll add a directive that will allow us to open our dropdowns.

1. Navigate to the shared folder and create a folder named dropdown, and add dropdown.directive.ts

    You can also run ```ng g d shared/dropdown/dropwdown --skip-tests``` in the CLI. (Skip to 4.)

2. In dropdown.directive.ts export a class named Dropdown Directive.
    ```ts
    export class DropdownDirective {

    }
    ```

3. Import the Directive decorator from @angular/core, and add an attribute selector (enclosed in brackets). Make sure it doesn't overwrite existing attribute names.
    ```ts
    @Directive({
        selector: '[appDropdown]'
    })
    ```
4. Can students walk us through adding a method that listens for a click and toggles a property which adds/removes the CSS class 'show' to the element the directive is on?
    
    Solution:
    
    1. Import and add HostListener, listening for a click event that will execute a function toggleOpen: 
        ```ts
        @HostListener('click') toggleOpen(){
        
        }
        ```

    2. Add isOpen directive set to false and add HostBinding, which allows us to bind to properties of the element the directive is on.
     Bind to class property:    
         ```ts 
        @HostBinding('class.open') isOpen = false;
        ```

    3. Inside our toggleOpen function, add code that sets our isOpen property to what it currently is not:
        ```ts
        this.isOpen = !this.isOpen;
        ```

    Resulting in this code inside dropdown.directive.ts:
    ```ts
    import { Directive, HostBinding, HostListener } from '@angular/core';

    @Directive({
        selector: '[appDropdown]'
    })

    export class DropdownDirective {
        @HostBinding('class.show') isOpen = false;
        @HostListener('click') toggleOpen(){
            this.isOpen = !this.isOpen;
        }
    }
    ```

5. In app.module.ts import and add the DropdownDirective we just created to our declarations array.

6. Add the directive to the HTML. In book-details.component.html, replace 
    ```ts 
    <button type="button" class="btn btn-primary">Edit Book</button>
    ```
    with 
    ```ts 
      <div 
    class="dropdown" >
      <button 
      type="button" 
      class="btn btn-primary dropdown-toggle"
      > Edit Book <span class='caret'></span></button>
      <ul class="dropdown-menu">
        <a class="dropwdown-item">Edit Book</a>
        <a class="dropwdown-item">Delete Book</a>
      </ul>
    </div> 
    ```
    add our appDropdown directive to our div with the class of dropdown.

    Why isn't this working? 

    With Bootstrap 4 we need to also toggle this 'show' class on our ul when our directive is clicked. For that we can use Angular template ref, which allows us to assign this directive to a variable.

    Add the exportAs option to the decorator in dropdown.directive.ts:
    ```ts 
    @Directive({
    selector: '[appDropdown]',
    exportAs: 'appDropdown'
    })
    ```
    Then add a reference to this directive on the div with our directive, and add the [ngClass] directive to the ul element, adding show only if isOpen is true on our directive.

    ```ts 
        <div class="dropdown" 
          appDropdown
          #r="appDropdown"
        >
          <button type="button" class="btn btn-primary dropdown-toggle"
          >Edit Book<span class='caret'></span></button>
        <ul class="dropdown-menu" [ngClass]="{'show':r.isOpen}" >
            <a class="dropwdown-item">Edit Book</a>
            <a class="dropwdown-item">Delete Book</a>
        </ul>
        </div> 
    ```

    Dropdown should work as expected.
