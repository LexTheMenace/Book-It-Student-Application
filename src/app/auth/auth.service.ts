import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  token: string | null = null;
  autoLogoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email, password) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseAPIKey,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap((res) =>
          this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            res.expiresIn
          )
        )
      );
  }
  signIn(email, password) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap((auth) => {
          this.handleAuthentication(
            auth.email,
            auth.localId,
            auth.idToken,
            auth.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);

    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const user = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (user.token) {
      this.user.next(user);

      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      // future date minus today's date
      // gives us the duration of how much longer we have
      this.autoLogout(expirationDuration);
    }
  }
  autoLogout(expTime: number) {
    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, expTime);
  }

  private handleAuthentication(email, id, token, expiresIn) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    this.autoLogout(+expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }
}
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
