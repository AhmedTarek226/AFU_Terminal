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
    // return true;
    this.auth.setPrevURL(state.url);
    let x = localStorage.getItem('authorities');
    let permissions = [];
    if (x) permissions = JSON.parse(x);
    let currentPage = state.url.slice(1) + '.View';

    if (currentPage == 'requests.View') {
      currentPage = 'Requests.View';
      this.auth.setPrevURL('requests');
    } else if (currentPage == 'audit.View') {
      currentPage = 'Audit.View';
      this.auth.setPrevURL('audit');
    } else if (currentPage == 'home.View') {
      return true;
    }

    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i].authority === currentPage) {
        return true;
      }
    }
    if (state.url.slice(1) == 'home') {
      this.router.navigate(['/home']);
    }

    alert(`You do not have permission to ${state.url.slice(1)} page.`);
    return false;
  }
}
