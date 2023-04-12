import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  isShow: BehaviorSubject<boolean>;
  isInHome: BehaviorSubject<boolean>;
  constructor() {
    this.isShow = new BehaviorSubject(true);
    this.isInHome = new BehaviorSubject(false);
  }

  show() {
    this.isShow.next(true);
  }

  hide() {
    this.isShow.next(false);
  }
}
