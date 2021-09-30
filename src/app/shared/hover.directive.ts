import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {
  originalColor = this.elRef.nativeElement.style.color;
  @Input() customBackground = 'blue';
  @HostBinding('style.backgroundColor') backgroundColor = this.customBackground;
  @HostBinding('style.color') color = this.originalColor;
  constructor(private elRef: ElementRef){

  }
  @HostListener('mouseover') applyHighlight(){
    this.backgroundColor = this.customBackground;
    this.color = 'white'
  }
  @HostListener('mouseleave') removeHighlight(){
    this.backgroundColor = 'transparent'
    this.color = this.originalColor
  }
}
