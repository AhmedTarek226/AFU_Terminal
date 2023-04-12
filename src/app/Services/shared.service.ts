import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import * as FileSaver from 'file-saver';
import { ToastService } from './toast.service';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(
    private router: Router,
    private auth: AuthService,
    private toastService: ToastService
  ) {}

  handleObject(obj: any) {
    for (let i in obj) {
      if (obj[i] == null) {
        obj[i] = '';
      } else if (typeof obj[i] == 'string') {
        obj[i] = obj[i].trim();
      }
    }
    return obj;
  }

  logout() {
    // this.auth.logoutUser();
    this.auth.logout().subscribe(
      (Response: any) => {
        localStorage.clear();
        sessionStorage.clear();
        // this.cookie.deleteAll();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 0);
        this.auth.checkLogout.next(true);
        this.auth.checkGetFromLogin.next(false);
        this.auth.setPrevURL('home');
      },
      (err: any) => {
        this.toastService.showError('Error', `Failed to logout`);
        this.auth.checkLogout.next(true);
      }
    );
  }

  export(table: any, fileName: string) {
    import('xlsx').then((xlsx): void => {
      const worksheet = xlsx.utils.table_to_sheet(table);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, fileName);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName +
        '_' +
        formatDate(new Date(), 'dd-MMM-YYYY hh:mm', 'en-US') +
        EXCEL_EXTENSION
    );
  }

  handleHttpError(error: HttpErrorResponse) {
    this.toastService.showError('Error', 'Try again later');

    if (error.status === 401 || error.status === 403) {
      console.error('An error occurred:', error.error);
      this.toastService.showError('Error', 'Try again later');
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      this.toastService.showError('Error', 'Try again later');
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
