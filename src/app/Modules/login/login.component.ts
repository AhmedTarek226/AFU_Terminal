import {
  Component,
  OnChanges,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem, MessageService } from 'primeng/api';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
// import { TranslateService } from 'src/app/Services/translate.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/Services/toast.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  [x: string]: any;
  isLoading: boolean = false;

  itemsModule!: MenuItem[];
  subscriptions: Subscription[] = [];
  // titles: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private cookie: CookieService,
    private translateService: TranslateService
  ) {
    // this.titles = this.translateService.data.loginForm;
    // let sub = this.translateService.dataa.subscribe((data) => {
    //   this.titles = data.loginForm;
    //   // console.log('data', data);
    // });
    // this.subscriptions.push(sub);
  }
  translate() {
    if (this.translateService.currentLang == 'en') {
      this.translateService.use('ar');
    } else {
      this.translateService.use('en');
    }
  }
  ngOnInit(): void {
    // this.router.navigate(['/home']);
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    let navigateHome;
    this.authService.checkLogout.subscribe((val) => {
      navigateHome = !val;
      // console.log('value in sub', val);
    });

    if (navigateHome === true) {
      this.router.navigate(['/home']);
      return;
    }

    this.itemsModule = [
      {
        label: 'All Modules',
        items: [
          {
            label: 'itemsModule1',
            icon: 'pi pi-external-link',
            url: '/',
          },
          {
            label: 'itemsModule2',
            icon: 'pi pi-external-link',
            url: '/',
          },
        ],
      },
    ];
    this.cookie.set('Host', window.location.host);
    // console.log('window.location.host');
    // console.log(window.location);

    // this.automaticLogin();
  }

  typePass: 'password' | 'text' = 'password';
  onSubmit() {
    localStorage.clear();
    this.cookie.deleteAll();
    this.loginPage(this.loginForm.value);
  }

  automaticLogin() {
    this.isLoading = true;
    let sub = this.authService.checkLogout.subscribe((flag) => {
      if (flag == true) {
        this['objempty'] = {
          username: '',
          password: '',
        };
        this.loginPage(this['objempty']);
      }
    });
    this.isLoading = false;
    this.subscriptions.push(sub);
  }

  loginPage(_f: any) {
    let obj = this.encryptpassword(_f);
    let sub = this.authService.login(obj).subscribe({
      next: (result: any) => {
        this.getSessionParams(obj, result);
      },
      error: (error: any) => {
        if (error?.error?.clientMessage?.includes('locked')) {
          this['showErrorMessage'] = error.error.clientMessage;
          if (this.translateService.currentLang == 'ar')
            this.toastService.showError('خطأ', this['showErrorMessage']);
          else this.toastService.showError('Error', this['showErrorMessage']);
        } else if (_f.username !== '' && _f.password !== '') {
          // this['showErrorMessage'] = 'Invalid username OR password';
          if (this.translateService.currentLang == 'ar')
            this.toastService.showError(
              'خطأ',
              'يوجد خطأ في اسم المستخدم أو كلمة السر'
            );
          else
            this.toastService.showError(
              'Error',
              'Invalid username OR password'
            );
        }
      },
      complete: () => {
        // this.isLoading = false;
      },
    });
    this.subscriptions.push(sub);
  }

  routing1 = ['/', '', '/error'];
  routing2 = ['home', 'Requests', 'Audit'];
  getSessionParams(_f: any, response: any) {
    let sub = this.authService.getSessionParams(_f).subscribe({
      next: (res: any) => {
        this.authService.checkLogout.next(false);
        this.authService.checkGetFromLogin.next(true);
        localStorage.setItem(
          'userModules',
          JSON.stringify(response.userModules)
        );
        localStorage.setItem(
          'authorities',
          JSON.stringify(response.authorities)
        );
        localStorage.setItem('username', response.username);
        let previousUrl: BehaviorSubject<string> =
          this.authService.getPrevURL();
        // console.log('previousUrl.value');
        // console.log(previousUrl.value);

        if (
          previousUrl.value === '/' ||
          previousUrl.value === '' ||
          previousUrl.value === '/error' ||
          !this.routing2.includes(previousUrl.value.split('/')[0])
        ) {
          // this.authService.setPrevURL('login');
          this.router.navigate(['/home']);
        } else {
          this.router.navigate([previousUrl.value]);
        }
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: 'Login successfully',
        // });
      },
      error: (err: any) => {
        // console.error(err);
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: 'Something went wrong',
        // });
        console.log('here is the error message 2');
      },
      complete: () => {
        // this.isLoading = false;
      },
    });
    this.subscriptions.push(sub);
  }

  encryptpassword(_f: any) {
    let CryptoJS = require('crypto-js');
    let value = _f.password;
    let key = CryptoJS.enc.Latin1.parse('MTS@SECRET#KEYMA');
    let iv = CryptoJS.enc.Latin1.parse('AMYEK#TERCES@STM');
    let encrypted = CryptoJS.AES.encrypt(value, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    });

    return {
      username: _f.username,
      password: encrypted.toString(),
    };
  }

  toggleShow() {
    if (this.typePass === 'password') {
      this.typePass = 'text';
    } else {
      this.typePass = 'password';
    }
  }
  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
