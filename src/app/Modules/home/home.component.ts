import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { IRoute } from 'src/app/Models/IRoute';
import { AuthService } from 'src/app/Services/auth.service';
import { PermisionsService } from 'src/app/Services/permissions.service';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { ToastService } from 'src/app/Services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  modules: IRoute[] = [];
  userName: any = '';
  apps = [];
  // lang: string;
  // noPermMsg: string = '';
  constructor(
    private permisions: PermisionsService,
    private authService: AuthService,
    private cookie: CookieService,
    private toastService: ToastService,
    private router: Router,
    private sidebarService: SidebarService,
    private translateService: TranslateService
  ) {
    this.setParams();
    // this.lang = this.translateService.getLang();
    // this.noPermMsg = this.translateService.data.home.noPermMsg;
    // this.translateService.dataa.subscribe((data) => {
    //   this.noPermMsg = data.home.noPermMsg;
    //   this.lang = translateService.getLang();
    // });
  }

  ngOnInit() {
    this.sidebarService.isInHome.next(true);
    let getFromLogin = false;
    this.authService.checkGetFromLogin.subscribe((val) => {
      getFromLogin = val;
    });
    if (getFromLogin === false) {
      this.cookie.set('Host', window.location.host);
      this.automaticLogin();
    }
  }

  subscriptions: Subscription[] = [];

  automaticLogin() {
    let isLogout = false;
    let sub = this.authService.checkLogout.subscribe((flag) => {
      // console.log('flag', flag);
      isLogout = flag;
    });
    if (isLogout) {
      let obj = {
        username: '',
        password: '',
      };
      this.loginPage(obj);
    }
    this.subscriptions.push(sub);
  }

  loginPage(_f: any) {
    let sub = this.authService.login(_f).subscribe({
      next: (result: any) => {
        this.getSessionParams(_f, result);
      },
      error: (error: any) => {
        if (this.translateService.currentLang == 'en')
          this.toastService.showError('Error', 'Please login first');
        else this.toastService.showError('خطأ', 'الرجاء تسجيل الدخول');
        this.router.navigate(['/login']);
      },
      complete: () => {},
    });
    this.subscriptions.push(sub);
  }

  getSessionParams(_f: any, response: any) {
    let sub = this.authService.getSessionParams(_f).subscribe({
      next: (res: any) => {
        this.authService.checkLogout.next(false);
        localStorage.setItem(
          'userModules',
          JSON.stringify(response.userModules)
        );
        localStorage.setItem(
          'authorities',
          JSON.stringify(response.authorities)
        );
        localStorage.setItem('username', response.username);
      },
      error: (err: any) => {
        if (this.translateService.currentLang == 'en')
          this.toastService.showError('Error', 'Something went wrong');
        else this.toastService.showError('خطأ', 'حدث خطأ ما');
      },
      complete: () => {
        this.setParams();
      },
    });
    this.subscriptions.push(sub);
  }

  setParams() {
    if (this.permisions.haveAuthorities()) {
      this.modules = [
        {
          name: 'Requests',
          src: 'fa-arrow-right-arrow-left',
          routerLink: '/Requests',
          // permision: true,
          permision: this.permisions.havePermisions('Requests.View'),
        },
        {
          name: 'Audit',
          src: 'fa-clock-rotate-left',
          routerLink: '/Audit',
          // permision: true,
          permision: this.permisions.havePermisions('Audit.View'),
        },
      ];
    } else {
      this.modules = [];
    }
    this.userName = localStorage.getItem('username');
    let x = localStorage.getItem('userModules');
    if (x) this.apps = JSON.parse(x);
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.sidebarService.isInHome.next(false);
  }
}
