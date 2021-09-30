
export class Book{
  public title: string;
  public author: string;
  public genre: string;
  public coverImagePath: string;

  constructor(title: string, author: string, genre: string, coverImagePath: string){
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.coverImagePath = coverImagePath;
  }
}
