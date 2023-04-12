import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
declare var $: any;

interface IRowData {
  merchantId: string;
  terminalId: number;
  terminalSerialNo: number;
  terminalName: string;
  terminalType: string;
  accountNo: number;
  currency: string;
}

interface IColumn {
  field: string;
  header: string;
  display: number;
}
@Component({
  selector: 'app-generate-table',
  templateUrl: './generate-table.component.html',
  styleUrls: ['./generate-table.component.css'],
})
export class GenerateTableComponent implements OnInit {
  @Input() sectionDetails: any;
  headers: string[] = [];
  rowsData: any;
  // selectedColumns: string[] = [];
  tableId: string;
  dataKey: string;
  @ViewChild('myTable') myTable: any;
  constructor(private sharedService: SharedService) {
    this.tableId = this.sectionDetails?.sectionId;
    this.dataKey = 'merchantId';
  }

  cols: IColumn[] = [];
  selectedcols: any[] = [];
  _selectedColumns: any[] = [];
  totalRow: number = 10;
  ngOnInit(): void {
    // console.log('headers', this.headers);
    console.log(this.sectionDetails);
    this.headers = this.sectionDetails?.headers;
    this.rowsData = this.sectionDetails?.attributes;
    this.selectedColumns = this.sectionDetails?.columns;
    console.log('selectedColumns', this.selectedColumns);

    for (let i = 0; i < this.selectedColumns?.length; i++) {
      this.cols.push({
        field: this.selectedColumns[i],
        header: this.headers[i],
        display: 1,
      });
    }
    this.selectedcols = this.cols.filter((col: any) => col.display == 1);
    this._selectedColumns = this.selectedcols;

    // this.selectedColumns = this.cols;
    console.log('on init table', this.cols);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this.selectedcols = val;
    this._selectedColumns = this.cols.filter((col: any) => val.includes(col));
    this._selectedColumns = this.selectedcols;
  }

  // @ViewChild() myTable: ElementRef;

  // filterGlobal(filterValue: string) {
  //   this.myTable.filterGlobal(filterValue, 'contains');
  // }

  resetOnlyTable(): void {
    $('#inputID').val('');
    this.myTable.reset();
  }
  dataID: any;
  exportExcel() {
    this.dataID = document.getElementById('myTable');
    this.sharedService.export(this.dataID, `${this.tableId}`);
  }
}
