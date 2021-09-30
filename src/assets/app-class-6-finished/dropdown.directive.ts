import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown'
})
export class DropdownDirective {
  @HostBinding('class.show') isOpen = false;

  constructor() { }

  @HostListener('click') toggleOpen(){
    console.log(this.isOpen);

    this.isOpen = !this.isOpen;
  }
}
