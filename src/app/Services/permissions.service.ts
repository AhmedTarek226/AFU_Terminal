import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermisionsService {
  constructor() {}
  havePermisions(permission: string): boolean {
    let permissions: any = [];
    try {
      let x = localStorage.getItem('authorities');
      if (x) {
        permissions = JSON.parse(x);
      }
    } catch (err) {
      console.warn('Maybe no permissions found, please login');
      if (permissions.length === 0) {
        alert("You don't Have Any Permissions");
        return false;
      }
    }
    return permissions.find((x: any) => x.authority === permission);
  }

  haveAuthorities(): boolean {
    let permissions: any = [];
    let x = localStorage.getItem('authorities');
    if (x) {
      permissions = JSON.parse(x);
      if (permissions.length > 0) return true;
      else return false;
    }
    return false;
  }
}
