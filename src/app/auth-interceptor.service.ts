import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if(!user){
          return next.handle(req);
        }
        const reqWithToken = req.clone({
        params: new HttpParams().set('auth', user.token)
      })
      console.log(reqWithToken);

      return next.handle(reqWithToken);
      })
    )
  }
}
