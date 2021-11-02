import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { User } from './User.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  error: string | null = null;
  isAuthenticated = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    let authObs: Observable<AuthResponseData>;

    if (!this.isLoginMode) {
      // Sign Up;
      authObs = this.authService.signUp(email, password);
    } else {
      // Sign In
      authObs = this.authService.signIn(email, password);
    }
    authObs.subscribe(
      (authData) => {
        this.router.navigate(['/bookshelf'])
      },
      (error) => {
        this.error = 'An Error Occurred';
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    );
    form.reset();
  }
}
