import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { SharedService } from 'src/app/Services/shared.service';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { ToastService } from 'src/app/Services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isShowSide: boolean = true;
  userName: any = '';
  changePassForm!: FormGroup;
  passwordShow = ['password', 'password', 'password'];
  showMsg: boolean = false;
  clickSubmit: boolean = false;
  // titles: any;
  subscriptions: Subscription[] = [];
  apps = [];
  showToggleBtn: boolean = false;
  @ViewChild('dropdownModules') dropdownModules: any;
  @ViewChild('dropdownMenu') dropdownMenu: any;
  // lang: string;
  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private cookie: CookieService,
    private toastService: ToastService,
    private render2: Renderer2,
    private el: ElementRef,
    public translateService: TranslateService,
    private sharedService: SharedService
  ) {
    this.userName = localStorage.getItem('username');
    let x = localStorage.getItem('userModules');
    if (x) this.apps = JSON.parse(x);
    this.changePassForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
    // this.titles = this.translateService.data.header;
    // this.lang = this.translateService.getLang();

    let sub = this.translateService.onLangChange.subscribe((data) => {
      // this.lang = this.translateService.getLang();
      // this.titles = data.header;
      let x = this.dropdownModules.nativeElement;
      let y = this.dropdownMenu.nativeElement;

      if (this.translateService.currentLang == 'ar') {
        console.log('rtl');
        this.render2.setStyle(x, 'right', '0');
        this.render2.removeStyle(x, 'left');
        this.render2.setStyle(y, 'margin', '0');
      } else {
        console.log('ltr');
        this.render2.setStyle(x, 'left', '0');
        this.render2.removeStyle(x, 'right');
        this.render2.setStyle(y, 'margin', '0 -60px');
      }
    });
    this.sidebarService.isInHome.subscribe((data: boolean) => {
      this.showToggleBtn = data;
    });
    this.subscriptions.push(sub);
  }

  redirect(link: string): void {
    if (link.startsWith('h')) {
      // window.location.href = link;
      window.open(link, '_blank');
      return;
    }

    window.open('http://' + window.location.host + link, '_blank');
  }
  ty: boolean = true;
  translate() {
    this.ty = !this.ty;
  }
  ngOnInit(): void {
    // this.titles = this.translateService.data.header;
    this.sidebarService.isShow.subscribe((val) => (this.isShowSide = val));
    let sub = this.changePassForm.valueChanges.subscribe((x: any) => {
      if (x.newPassword !== x.confirmPassword) {
        this.showMsg = true;
      } else {
        this.showMsg = false;
      }
    });
  }

  toggleShowSide() {
    if (this.isShowSide == true) {
      this.sidebarService.hide();
    } else {
      this.sidebarService.show();
    }
  }

  logout() {
    this.sharedService.logout();
  }

  @ViewChild('closePassModall') closebutton: any;
  changePassword() {
    this.clickSubmit = true;
    if (
      this.changePassForm.valid &&
      this.changePassForm.controls['newPassword'].value !==
        this.changePassForm.controls['confirmPassword'].value
    ) {
      return;
    } else if (this.changePassForm.invalid) {
      return;
    } else {
      let obj = this.handelObj(
        this.changePassForm.controls['newPassword'].value,
        this.changePassForm.controls['oldPassword'].value
      );
      this.authService.changePassword(obj).subscribe(
        (res: any) => {
          if (
            String(res.clientMessage).includes('Invalid') ||
            String(res.clientMessage).includes('Wrong')
          ) {
            if (this.translateService.currentLang == 'ar')
              this.toastService.showError('خطأ', 'فشلت عملية تغيير كلمة السر');
            else
              this.toastService.showError('Error', 'Failed to change password');
          } else {
            if (this.translateService.currentLang == 'ar')
              this.toastService.showSuccess('نجحت', 'تم تغيير كلمة السر');
            else
              this.toastService.showSuccess(
                'Success',
                'Password changed successfully'
              );
            this.closebutton.nativeElement.click();
          }
        },
        (err: any) => {
          if (this.translateService.currentLang == 'ar')
            this.toastService.showError('خطأ', 'حدث خطأ ما');
          else this.toastService.showError('Error', 'Something wrong');
        }
      );
    }
  }

  handelObj(newPass: any, oldPass: any) {
    return {
      // userName: this.userName,
      oldPassword: this.encryptpassword(oldPass),
      newPassword: this.encryptpassword(newPass),
    };
  }
  useLang(lang: string) {
    sessionStorage.setItem('language', JSON.stringify(lang));
    location.reload();
  }
  encryptpassword(value: any): string {
    let CryptoJS = require('crypto-js');

    let key = CryptoJS.enc.Latin1.parse('MTS@SECRET#KEYMA');
    let iv = CryptoJS.enc.Latin1.parse('AMYEK#TERCES@STM');
    let encrypted = CryptoJS.AES.encrypt(value, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    });
    return encrypted.toString();
  }
  reset() {
    this.changePassForm.reset();
    this.showMsg = false;
    this.clickSubmit = false;
  }

  showPassword(ind: number) {
    if (this.passwordShow[ind] === 'password') {
      this.passwordShow[ind] = 'text';
    } else {
      this.passwordShow[ind] = 'password';
    }
  }

  ngOnDestroy(): void {
    // for (let sub of this.subscriptions) {
    //   sub.unsubscribe();
    // }
  }
}
