import { EventEmitter, Injectable } from "@angular/core";
import { BOOK_DATA } from "bookData";
import { Book } from "../shared/book/Book.model";

@Injectable({providedIn:'root'})
export class BookshelfService{
    myBooks: Book[] = [
        {
           title: 'Coding Catastrophe',
           author: 'Sir Code-A-Lot',
           genre: 'Horror',
           coverImagePath: 'https://source.unsplash.com/500x500/?horror'
        },
       {
           title: 'JavaScript Secrets',
           author: 'Java Script Jr.',
           genre: 'Mystery',
           coverImagePath: 'https://source.unsplash.com/500x500/?mystery'
       },
        {
             title: 'The Life of Trees',
             author: 'Forrest Walker',
             genre: 'Nature',
             coverImagePath: 'https://source.unsplash.com/500x500/?trees'
        }
       ];;
    bookWasSelected = new EventEmitter<Book>();

    addBook(book:Book){
        this.myBooks.push(book);
    }

    removeBook(i:number){
        this.myBooks.splice(i,1);
    }
}