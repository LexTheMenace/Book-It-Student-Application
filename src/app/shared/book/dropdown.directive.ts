import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown'
})
export class DropdownDirective {
  @HostBinding('class.show') isShow = false;

  constructor() { }
  @HostListener('click') toggleOpen(){
    this.isShow = !this.isShow
  }
}
