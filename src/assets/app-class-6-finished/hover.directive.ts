import { Directive, ElementRef, Host, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {
  originalTextColor = this.elRef.nativeElement.style.textColor;
  defaultBackground = 'transparent';
  @Input() text = 'white'
  @Input() color = 'orange'

  @HostBinding('style.backgroundColor') hoverColor = this.defaultBackground
  @HostBinding('style.color') textColor = this.originalTextColor;

  constructor(private elRef: ElementRef, private rendered: Renderer2) { }


  @HostListener('mouseenter')onHover(){
    this.hoverColor = this.color;
    this.textColor = this.text;
  }
  @HostListener('mouseleave')onLeave(){
    this.hoverColor = this.defaultBackground;
    this.textColor = this.originalTextColor;
  }

}
