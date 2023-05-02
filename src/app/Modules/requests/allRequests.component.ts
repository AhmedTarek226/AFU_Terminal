import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ISearchData } from 'src/app/Models/requests/ISearchData';
import { IRequestDetails } from 'src/app/Models/requests/IRequestDetails';
import { RequestsService } from 'src/app/Services/requests.service';
import { ToastService } from 'src/app/Services/toast.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Paginator } from 'primeng/paginator';
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
  firstExcecute: boolean = true;
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
  constructor(
    private requestsService: RequestsService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
    this.showSearchError = false;
    this.subscriptions = [];
    this.requestsList = [];
    this.msgErrorApi = 'noRequestsFound';
    let sub = translateService.onLangChange.subscribe((data: any) => {
      this.ngOnInit();
    });
    // this.subscriptions.push(sub);

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
    ];
    this.selectedcols = this.cols.filter((col: any) => col.display == 1);
    this._selectedColumns = this.selectedcols;
    this.requestsService.getAllRequests().subscribe(
      (Response: any) => {
        if (Response?.length == 0) {
          if (this.translateService.currentLang == 'ar')
            this.toastService.showWarn('عذرًا', 'لا يوجد معلومات');
          else this.toastService.showWarn('Warning', 'No Data Found');
        }
        this.requestsList = Response;
        console.log(this.requestsList);

        this.paginatorObj['totalRecords'] = Response.totalElements;
        console.log('this.paginatorObj');
        console.log(this.paginatorObj);
        this.loading = false;
      },
      (error: any) => {
        this.msgErrorApi = 'errorMsg';

        this.loading = false;
      }
    );
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
      this.getAllRequests(changes.page, changes.rows, this.paginateSearchObj);
    }
  }
  loading: boolean = false;
  getAllRequests(pageNumber: number, pageSize: number, _fdata: any) {
    console.log('search object -> ', _fdata);

    this.loading = true;
    this.requestsList = [];
    this.subs = this.requestsService
      .findRequests(pageNumber, pageSize, _fdata)
      .subscribe(
        (Response: any) => {
          if (Response?.length == 0) {
            if (this.translateService.currentLang == 'ar')
              this.toastService.showWarn('عذرًا', 'لا يوجد معلومات');
            else this.toastService.showWarn('Warning', 'No Data Found');
          }
          this.requestsList = Response.content;
          this.paginatorObj['totalRecords'] = Response.totalElements;
          console.log('this.paginatorObj');
          console.log(this.paginatorObj);
          this.loading = false;
        },
        (error: any) => {
          this.msgErrorApi = 'errorMsg';

          this.loading = false;
        }
      );
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
      this.getAllRequests(0, this.searchSize, this.objectbySearch);
    }
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
