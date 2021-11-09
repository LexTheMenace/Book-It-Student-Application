import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlerplaceholderDirective } from './alerplaceholder.directive';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './book/dropdown.directive';
import { HoverDirective } from './hover.directive';
import { BookComponent } from './book/book.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DropdownDirective,
    HoverDirective,
    AlertComponent,
    AlerplaceholderDirective,
    BookComponent,
  ],
  imports: [CommonModule,RouterModule],
  exports: [
    DropdownDirective,
    HoverDirective,
    AlertComponent,
    AlerplaceholderDirective,
    BookComponent
  ],
})
export class SharedModule {}
