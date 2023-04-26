import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { ISearchData } from '../Models/requests/ISearchData';
import { SharedService } from './shared.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private http: HttpClient, private sharedService: SharedService) {}
  search(searchData: ISearchData): Observable<any> {
    return this.http
      .get('http://localhost:3001/data')
      .pipe(retry(1), catchError(this.sharedService.handleHttpError));
  }

  getAllRequests(): Observable<any> {
    return this.http.get(`${environment.apiURL}/getAllRequests`);
    // return this.http.post(this.URL+`/findAudit?page=${pageNo}&size=${size}` , _f );
  }

  findRequests(pageNo: any, size: any, _f: any): Observable<any> {
    let newSearchData = this.sharedService.handleObject(_f);
    return this.http.post(
      `${environment.apiURL}/requests/SearchRequest/${pageNo}/${size}`,
      newSearchData
    );
    // return this.http.post(this.URL+`/findAudit?page=${pageNo}&size=${size}` , _f );
  }

  getSingleRequest(requestId: any): Observable<any> {
    return this.http.post(
      `${environment.apiURL}/getReqData?reqId=${requestId}`,
      {}
    );
  }
}
