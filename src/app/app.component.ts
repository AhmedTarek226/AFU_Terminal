import { Component, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [MessageService]
})
export class AppComponent {
  title = 'TITLE';
  constructor(private renderer: Renderer2, public translate: TranslateService) {
    console.log(this.translate);
    let x = sessionStorage.getItem('language');
    let defaultLang = this.translate.getBrowserLang();
    if (x) defaultLang = JSON.parse(x);
    else sessionStorage.setItem('language', JSON.stringify(defaultLang));
    translate.setDefaultLang(defaultLang);
    translate.use(defaultLang);
  }

  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#overlay-app');
    this.renderer.setStyle(loader, 'display', 'none');
  }

  getDir(): string {
    switch (this.translate.currentLang) {
      case 'ar':
        return 'rtl';
      case 'en':
        return 'ltr';
      default:
        return 'ltr';
    }
  }
}
