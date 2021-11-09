import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlerplaceholderDirective } from '../shared/alerplaceholder.directive';
import { AlertComponent } from '../shared/alert/alert.component';
import { BookshelfService } from './bookshelf.service';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css'],
})
export class BookshelfComponent implements OnInit, OnDestroy {
  @ViewChild(AlerplaceholderDirective, { static: true })
  alertHost: AlerplaceholderDirective;
  sub: Subscription;
  constructor(private bookshelfService: BookshelfService) {}
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.bookshelfService.bookSelected.subscribe((book) => {
      let viewContainerRef = this.alertHost.viewContainerRef;
      let componentRef = viewContainerRef.createComponent(AlertComponent);
      componentRef.instance.message =
        ' You removed ' + book.title + ' by ' + book.author;

        setTimeout(()=>{
          viewContainerRef.clear();
        },2000)
    });
  }
}
