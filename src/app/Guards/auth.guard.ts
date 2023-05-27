import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  [x: string]: any;
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // let url = state.url;
    // this.auth.setPrevURL(url);
    // if (url.slice(1) == 'home') {
    //   this.router.navigate(['/home']);
    //   return true;
    // }
    // let currentPage = url.slice(1).split('/')[0];
    // this.auth.setPrevURL(currentPage);
    // currentPage += '.View';
    // let x = localStorage.getItem('authorities');
    // let permissions = [];
    // if (x) permissions = JSON.parse(x);
    // for (let i = 0; i < permissions.length; i++) {
    //   if (permissions[i].authority === currentPage) {
    //     return true;
    //   }
    // }
    this.auth.setPrevURL(state.url);
    console.log('url -> ' + state.url);

    let x = localStorage.getItem('authorities');
    let permissions = [];
    if (x) permissions = JSON.parse(x);
    let currentPage = state.url.slice(1).split('/')[0] + '.View';
    if (currentPage == 'home.View') {
      return true;
    }
    this.auth.setPrevURL(state.url.slice(1));

    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i].authority === currentPage) {
        return true;
      }
    }
    if (state.url.slice(1) == 'home') {
      this.router.navigate(['/home']);
    }

    alert(`You do not have permission to ${state.url.slice(1)} page.`);
    this.router.navigate(['/login']);
    return false;
  }
}
