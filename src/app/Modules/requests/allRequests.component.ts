import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ISearchData } from 'src/app/Models/requests/ISearchData';
import { IRequestDetails } from 'src/app/Models/requests/IRequestDetails';
import { RequestsService } from 'src/app/Services/requests.service';
import { ToastService } from 'src/app/Services/toast.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Paginator } from 'primeng/paginator';
import { NavigationExtras, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-allRequests',
  templateUrl: './allRequests.component.html',
  styleUrls: ['./allRequests.component.css'],
})
export class AllRequestsComponent implements OnInit {
  requestsList: IRequestDetails[];
  showSearchError: boolean;
  subscriptions: Subscription[];
  // firstExcecute: boolean = true;
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  @ViewChild('requestsTable') myTable: any;
  dataID: any;
  objectbySearch: any;
  getdatabysearch: boolean = false;
  paginateSearchObj: any = {};
  searchSize = 50;
  msgErrorApi: string;
  paginatorObj: any;
  subs!: Subscription;
  cols: any[] = [];
  selectedcols: any[] = [];
  _selectedColumns: any[] = [];
  totalRow: number = 10;
  issueKey: string = '';
  loading: boolean = false;
  @ViewChild('closeModalButton') closeModalButton: any;
  constructor(
    private requestsService: RequestsService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.showSearchError = false;
    this.subscriptions = [];
    this.requestsList = [];
    this.msgErrorApi = 'noRequestsFound';

    this.paginatorObj = {
      rows: this.searchSize,
      totalRecords: 0,
      rowsPerPageOptions: [10, 25, 50, 100],
      showFirstLastIcon: true,
      showCurrentPageReport: true,
    };
  }

  ngOnInit(): void {
    this.cols = [
      {
        field: 'requestId',
        header: this.translateService.instant(
          'requests.requestsList.headers.requestId'
        ),
        display: 1,
      },
      {
        field: 'templateId',
        header: this.translateService.instant(
          'requests.requestsList.headers.templateId'
        ),
        display: 1,
      },
      {
        field: 'creationDate',
        header: this.translateService.instant(
          'requests.requestsList.headers.creationDate'
        ),
        display: 1,
      },
      {
        field: 'jiraNo',
        header: this.translateService.instant(
          'requests.requestsList.headers.jiraNo'
        ),
        display: 1,
      },
      {
        field: 'status',
        header: this.translateService.instant(
          'requests.requestsList.headers.status'
        ),
        display: 1,
      },
    ];
    this.selectedcols = this.cols.filter((col: any) => col.display == 1);
    this._selectedColumns = this.selectedcols;
    this.getRequests(0, this.searchSize);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this.selectedcols = val;
    this._selectedColumns = this.cols.filter((col: any) => val.includes(col));
    this._selectedColumns = this.selectedcols;
  }
  requestData: any;

  showRequest(reqId: number, status: string) {
    // Passing parameter in the URL
    const navigationExtras: NavigationExtras = {
      queryParamsHandling: 'preserve', // Optional: To preserve existing query parameters
      skipLocationChange: true, // Optional: To prevent updating the browser URL
    };

    // this.router.navigate([`/Requests/${reqId}`], navigationExtras);
    this.router.navigate(
      ['/Requests', reqId, { status: status }],
      navigationExtras
    );
  }
  // selectedRow:number;
  editRequest(requestId: number) {
    // alert('Edit request -> ' + requestId);
    this.requestsService.getSingleRequest(requestId).subscribe({
      next: (response: any) => {
        this.requestData = response;
        console.log(this.requestData);
      },
      error: (err) => {
        console.log('error', err);
      },
      complete: () => {},
    });
  }

  resetOnlyTable(): void {
    $('#inputID').val('');
    this.myTable.reset();
  }

  reset() {
    this.requestsList = [];
    this.paginatorObj['totalRecords'] = 0;
    this.totalRow = 0;
  }
  paginate(changes: any) {
    this.searchSize = changes.rows;
    if (Object.keys(this.paginateSearchObj).length > 0) {
      this.findRequests(changes.page, changes.rows, this.paginateSearchObj);
    } else {
      this.getRequests(changes.page, changes.rows);
    }
  }
  findRequests(pageNumber: number, pageSize: number, _fdata: any) {
    console.log('search object -> ', _fdata);
    this.loading = true;

    this.requestsList = [];
    let sub = this.requestsService
      .findRequests(pageNumber, pageSize, _fdata)
      .subscribe({
        next: (Response: any) => {
          this.setResponse(Response);
        },
        error: (err: any) => {
          this.msgErrorApi = 'errorMsg';
        },
        complete: () => {
          this.loading = false;
        },
      });
    this.subscriptions.push(sub);
  }
  getRequests(pageNumber: number, pageSize: number) {
    this.loading = true;

    this.requestsList = [];
    let sub = this.requestsService
      .getAllRequests(pageNumber, pageSize)
      .subscribe({
        next: (Response: any) => {
          this.setResponse(Response);
        },
        error: (err: any) => {
          this.msgErrorApi = 'errorMsg';
        },
        complete: () => {
          this.loading = false;
        },
      });

    this.subscriptions.push(sub);
  }

  setResponse(response: any) {
    if (response?.length == 0) {
      if (this.translateService.currentLang == 'ar')
        this.toastService.showWarn('عذرًا', 'لا يوجد معلومات');
      else this.toastService.showWarn('Warning', 'No Data Found');
    }
    this.requestsList = response?.content;
    this.paginatorObj['totalRecords'] = response?.totalElements;
    // console.log('this.paginatorObj');
    // console.log(this.paginatorObj);
  }

  exportExcel() {
    this.dataID = document.getElementById('requestsTable');
    this.sharedService.export(this.dataID, `RequestsTable`);
  }

  // data Search
  getDoneSearch($event: any) {
    this.resetOnlyTable();
    if (JSON.stringify($event) === JSON.stringify({})) {
      if (this.subs.closed === false) {
        this.subs.unsubscribe();
        this.loading = false;
      }
      this.paginateSearchObj = {};
      return;
    }
    this.getdatabysearch = true;
    this.objectbySearch = this.sharedService.handleObject($event);

    this.paginateSearchObj = this.objectbySearch;
    if (Object.keys(this.objectbySearch).length > 0) {
      this.findRequests(0, this.searchSize, this.objectbySearch);
    } else {
      this.getRequests(0, this.searchSize);
    }
  }

  showError: boolean = false;
  importFromJira() {
    if (this.issueKey == '') {
      this.showError = true;
    } else {
      this.requestsService.importFromJira(this.issueKey).subscribe({
        next: (res) => {
          if (res.statusCode == 1) {
            this.toastService.showSuccess(res.status, res.clientMessage);
          } else if (res.statusCode == -1) {
            this.toastService.showError(res.status, res.clientMessage);
          } else {
            this.toastService.showError('Error', 'Failed to get issue !!');
          }
        },
        error: (err) => {
          this.toastService.showError('Error', 'Failed to get issue !!');
        },
        complete: () => {
          this.showError = false;
          this.closeModalButton.nativeElement.click();
        },
      });
    }
  }
  resetModalValue() {
    this.issueKey = '';
    this.showError = false;
  }

  ngOnDestroy(): void {
    // this.reset();
    this.resetModalValue();
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
