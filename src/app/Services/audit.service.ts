import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { SharedService } from './shared.service';
declare var apiURL: any;

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  // URL: string = apiURL;

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  // getAllSysAudit(pageNo: any, size: any): Observable<any> {
  //   return this.http.get(
  //      `${environment.apiURL}/getAllSysAudit?page=${pageNo}&size=${size}`
  //   );
  // }

  findAudit(pageNo: any, size: any, _f: any): Observable<any> {
    let newSearchData = this.sharedService.handleObject(_f);
    return this.http.post(
      `${environment.apiURL}/WorkOrder/SearchAudit/${pageNo}/${size}`,
      newSearchData
    );
    // return this.http.post(this.URL+`/findAudit?page=${pageNo}&size=${size}` , _f );
  }
}
