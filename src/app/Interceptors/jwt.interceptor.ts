import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
// import { MessageService } from 'primeng/api';
import { SharedService } from '../Services/shared.service';
import { ToastService } from '../Services/toast.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  // URL: string = apiURL;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private sharedService: SharedService,
    private toastService: ToastService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authRquest = request.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',
      },
    });
    // console.log(authRquest.headers.append('X-XSRF-TOKEN', this.cookie.get('tokenRandom')))

    return next.handle(authRquest).pipe(
      tap(
        (event) => {
          this.checkResponse(event);
        },
        (error) => {
          // console.error(error);
          // let lang = JSON.parse(sessionStorage.getItem('language') || '');
          if (!navigator.onLine) {
            this.toastService.clear();
            this.toastService.showError('Error', `You are offline`);
            // if (lang == 'en') {
            // } else {
            //   this.toastService.showError('خطأ', `غير متصل بالانترنت`);
            // }
          }
          if (
            error?.message == 'You Are Logged Out because of Timeout' ||
            error?.error?.message == 'You Are Logged Out because of Timeout'
          ) {
            let err = error?.message;
            if (err) {
              err = error?.error?.message;
            }
            this.router.navigate(['/']);
            localStorage.clear();
            this.cookie.deleteAll();

            // if (lang == 'en') {
            this.toastService.showError('Error', `${err}`);
            // } else {
            //   this.toastService.showError('خطأ', `انتهت صلاحية الجلسة`);
            // }
          } else if (
            (error?.status == 403 ||
              error?.status == 401 ||
              error?.status == 429) &&
            !window.location.href.endsWith('/#/login') &&
            !window.location.href.endsWith('/login')
          ) {
            this.sharedService.logout();
          }
        }
      )
    );
  }

  checkResponse(response: any) {
    console.log('reponse: ', response);
    if (
      (response?.status == 403 ||
        response?.status == 401 ||
        response?.status == 429) &&
      !window.location.href.endsWith('/#/login') &&
      !window.location.href.endsWith('/login')
    ) {
      this.sharedService.logout();
    }
  }
}
