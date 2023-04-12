import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Subscription } from 'rxjs';
import { AuditService } from 'src/app/Services/audit.service';
import { SharedService } from 'src/app/Services/shared.service';
import { ToastService } from 'src/app/Services/toast.service';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css'],
})
export class AuditComponent implements OnInit, OnDestroy {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  @ViewChild('auditTable') myTable: any;
  subs!: Subscription;
  dataID: any;
  objectbySearch: any;
  getdatabysearch: boolean = false;
  paginateSearchObj: any = {};
  searchSize = 50;
  msgErrorApi: string;
  paginatorObj: any;
  subscriptions: Subscription[] = [];
  // lang: string;
  // titles: any;
  constructor(
    private dataApi: AuditService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
    // this.lang = this.translateService.getLang();
    // this.titles = this.translateService.data.audit.auditTable;
    this.msgErrorApi = 'noAuditsFound';
    // this.translateService.dataa.subscribe((data) => {
    //   this.lang = this.translateService.getLang();
    //   this.titles = data.audit.auditTable;
    let sub = translateService.onLangChange.subscribe((data: any) => {
      this.ngOnInit();
    });
    this.subscriptions.push(sub);
    // this.paginatorObj.currentPageReportTemplate = this.translateService.instant(
    //   'audit.auditTable.currentPageReportTemplate'
    // );
    // this.titles.currentPageReportTemplate;
    // this.msgErrorApi = this.titles.noAuditsFound;
    // });
    // this.msgErrorApi = this.titles.noAuditsFound;
    this.paginatorObj = {
      rows: this.searchSize,
      totalRecords: 0,
      rowsPerPageOptions: [10, 25, 50, 100],
      showFirstLastIcon: true,
      showCurrentPageReport: true,
      // currentPageReportTemplate: this.translateService.instant(
      //   'audit.auditTable.currentPageReportTemplate'
      // ),
    };
  }

  cols: any[] = [];
  selectedcols: any[] = [];
  _selectedColumns: any[] = [];
  totalRow: number = 10;
  ngOnInit(): void {
    // this.getAllaudit(0, this.searchSize, {});
    this.cols = [
      {
        field: 'action_NAME',
        header: this.translateService.instant(
          'audit.auditTable.headers.actionName'
        ),
        display: 1,
      },
      {
        field: 'action_DETAILS',
        header: this.translateService.instant(
          'audit.auditTable.headers.actionDetails'
        ),
        display: 1,
      },
      {
        field: 'action_DATE',
        header: this.translateService.instant(
          'audit.auditTable.headers.actionDate'
        ),
        display: 1,
      },
      {
        field: 'action_BY',
        header: this.translateService.instant(
          'audit.auditTable.headers.actionBy'
        ),
        display: 1,
      },
    ];

    this.selectedcols = this.cols.filter((col: any) => col.display == 1);
    this._selectedColumns = this.selectedcols;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this.selectedcols = val;
    this._selectedColumns = this.cols.filter((col: any) => val.includes(col));
    this._selectedColumns = this.selectedcols;
  }

  resetOnlyTable(): void {
    $('#inputID').val('');
    this.myTable.reset();
  }

  reset() {
    this.AllSysAudit = [];
    this.paginatorObj['totalRecords'] = 0;
    this.totalRow = 0;
  }
  paginate(changes: any) {
    this.searchSize = changes.rows;
    if (Object.keys(this.paginateSearchObj).length > 0) {
      this.getAllaudit(changes.page, changes.rows, this.paginateSearchObj);
    }
  }

  AllSysAudit: [] = [];
  loading: boolean = false;
  getAllaudit(pageNumber: number, pageSize: number, _fdata: any) {
    this.loading = true;
    this.AllSysAudit = [];
    this.subs = this.dataApi.findAudit(pageNumber, pageSize, _fdata).subscribe(
      (Response: any) => {
        // console.log(Response)
        if (Response.length == 0) {
          if (this.translateService.currentLang == 'ar')
            this.toastService.showWarn('عذرًا', 'لا يوجد معلومات');
          else this.toastService.showWarn('Warning', 'No Data Found');
        }
        this.AllSysAudit = Response.content;
        this.paginatorObj['totalRecords'] = Response.totalElements;
        console.log('this.paginatorObj');
        console.log(this.paginatorObj);

        // this.titles.noAuditsFound;
        this.loading = false;
      },
      (error) => {
        this.msgErrorApi = 'errorMsg';

        this.loading = false;
      }
    );
  }

  exportExcel() {
    this.dataID = document.getElementById('auditTable');
    this.sharedService.export(this.dataID, `SysAudit`);
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
      this.getAllaudit(0, this.searchSize, this.objectbySearch);
    }
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
