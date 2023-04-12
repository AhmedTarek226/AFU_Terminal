import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  URL: string = environment.apiURL;

  checkLogout = new BehaviorSubject<boolean>(true);
  private prevURL = new BehaviorSubject('home');
  checkGetFromLogin = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  setPrevURL(val: string) {
    this.prevURL.next(val);
  }
  getPrevURL() {
    return this.prevURL;
  }

  login(_f: any) {
    return this.http.post<any>(this.URL + '/api/auth/signin', _f);
  }

  logout() {
    return this.http.get(this.URL + `/api/auth/Logout`);
  }

  getSessionParams(_f: any) {
    return this.http.post<any>(this.URL + '/api/auth/setParam', _f);
  }

  changePassword(obj: any) {
    return this.http.post<any>(this.URL + '/api/auth/changePassword', obj);
  }
}
