// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class TranslateService {
//   data: any = {};
//   dataa: Subject<any> = new Subject();
//   lang: any;

//   constructor(private httpClient: HttpClient) {
//     let defaultLang = navigator.language.slice(0, 2);
//     this.setLang(defaultLang);
//     this.use(defaultLang);
//     // console.log('default', defaultLang);

//     // this.setLang('en');
//     // this.use('en');
//   }

//   use(lang: string): Promise<{}> {
//     lang = this.getLang(lang);
//     // console.log('lang', lang);

//     return new Promise<{}>((resolve) => {
//       const langPath = `assets/lang/${lang || 'en'}.json`;
//       // console.log('langPath');
//       // console.log(langPath);

//       this.httpClient.get(langPath).subscribe(
//         (response) => {
//           // console.log('response', response);

//           this.data = response || {};
//           this.dataa.next(this.data);
//           // console.log('this.data', this.data);
//           resolve(this.data);
//         },
//         (err) => {
//           // console.log('Error', err);

//           this.data = {};
//           this.dataa.next(this.data);

//           // console.log(this.data);
//           resolve(this.data);
//         }
//       );
//     });
//   }
//   setLang(lang: string) {
//     // console.log('lang: ' + lang);

//     if (lang == this.lang) {
//       return;
//     } else {
//       this.lang = lang;
//       // console.log('this lang: ' + this.lang);

//       this.use(lang).then((x: any) => {
//         this.getDir(lang);
//         // console.log(this.getDir(lang));
//       });
//     }
//   }

//   getLang(lang: string = this.lang): string {
//     switch (lang) {
//       case 'en':
//         return 'en';
//       case 'ar':
//         return 'ar';
//       default:
//         return 'en';
//     }
//   }
//   getDir(lang: string = this.lang): 'rtl' | 'ltr' {
//     switch (lang) {
//       case 'ar':
//         return 'rtl';
//       default:
//         return 'ltr';
//     }
//   }
// }
