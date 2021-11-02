
import { Component, OnInit} from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  show = false;
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private dataService: DataStorageService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !!user
      }
    )
  }

  onSaveData(){
    this.dataService.saveBooks();
  }
  onFetchData(){
    this.dataService.fetchBooks().subscribe();
  }
  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
  onLogout(){
    this.authService.logout();
  }
}

