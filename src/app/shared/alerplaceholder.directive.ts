import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAlerplaceholder]'
})
export class AlerplaceholderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}