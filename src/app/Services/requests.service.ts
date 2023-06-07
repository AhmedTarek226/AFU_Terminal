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

  getAllRequests(pageNo: any, size: any): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/OnBoardingRequest/getAllRequests/${pageNo}/${size}`
    );
    // return this.http.post(this.URL+`/findAudit?page=${pageNo}&size=${size}` , _f );
  }

  findRequests(pageNo: any, size: any, _f: any): Observable<any> {
    let newSearchData = this.sharedService.handleObject(_f);
    return this.http.post(
      `${environment.apiURL}/OnBoardingRequest/searchAllRequests/${pageNo}/${size}`,
      newSearchData
    );
    // return this.http.post(this.URL+`/findAudit?page=${pageNo}&size=${size}` , _f );
  }

  getSingleRequest(requestId: any): Observable<any> {
    return this.http.post(
      `${environment.apiURL}/OnBoardingRequest/getReqData?reqId=${requestId}`,
      {}
    );
  }

  editRequest(): Observable<any> | null {
    let newUpdatedAttributes = this.handleUpdatedAttributes(
      this.updatedAttributes
    );
    console.log('updatedAttributes', this.updatedAttributes.entries());
    if (newUpdatedAttributes.length == 0) {
      // this.toastService.showWarn('Warning', 'No Changes Available');
      return null;
    }
    return this.http.post(
      `${environment.apiURL}/OnBoardingRequest/editRequestData`,
      newUpdatedAttributes
    );
  }

  handleUpdatedAttributes(updatedAttributes: Map<any, any>) {
    let newFormat = [];
    for (const [key, value] of updatedAttributes) {
      newFormat.push({
        attId: key,
        attVal: value.attValue,
        attName: value.attName,
      });
    }
    return newFormat;
  }

  importFromJira(issueKey: string): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/JiraClient/GetIssue?issueKey=${issueKey}`
    );
  }

  updatedAttributes: Map<any, any> = new Map();
  editFormValue(attribute: any) {
    this.updatedAttributes.set(attribute.id, {
      attValue: attribute?.attValue,
      attName: attribute?.attName,
    });
    console.log('att name in form -> ', attribute?.attName);
  }

  editTableValue(rowsData: any, field: any, ids: any) {
    let lastUpdatedValue = '';
    for (let row of rowsData) {
      lastUpdatedValue += row.get(field) + '/*$';
    }
    this.updatedAttributes.set(ids.get(field), {
      attValue: lastUpdatedValue,
      attName: field,
    });
    console.log('att name in table -> ', field);
    // this.updatedAttributes.set(ids.get(field), lastUpdatedValue);
  }
}
