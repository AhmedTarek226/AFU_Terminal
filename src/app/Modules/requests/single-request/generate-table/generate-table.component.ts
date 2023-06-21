import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { SingleRequestComponent } from '../single-request.component';
import { RequestsService } from 'src/app/Services/requests.service';
declare var $: any;

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
  rowsData: any[] = [];
  // selectedColumns: string[] = [];
  tableId: string;
  dataKey: string;
  @ViewChild('myTable') myTable: any;
  @Input() isEditable: boolean = false;
  constructor(
    private sharedService: SharedService,
    private requestsService: RequestsService
  ) {
    this.tableId = this.sectionDetails?.sectionId;
    this.dataKey = 'merchantId';
  }

  cols: IColumn[] = [];
  selectedcols: any[] = [];
  _selectedColumns: any[] = [];
  totalRow: number = 10;
  output: Map<any, any> = new Map();
  ids: Map<any, any> = new Map();

  ngOnInit(): void {
    let isAttValue = true;
    this.sectionDetails?.attributes.map((val: any) => {
      this.headers.push(val.attName);
      if (val?.attValue !== null) isAttValue = false;
    });
    if (isAttValue) {
      this.pushEmptyRows();
    } else {
      this.handleRows();
    }

    this.selectedColumns = this.headers;
    for (let i = 0; i < this.selectedColumns?.length; i++) {
      this.cols.push({
        field: this.selectedColumns[i],
        header: this.headers[i],
        display: 1,
      });
    }
    this.selectedcols = this.cols.filter((col: any) => col.display == 1);
    this._selectedColumns = this.selectedcols;
    console.log('Rows Data -> ', this.rowsData);
  }

  newValue: string | null = null;
  pushEmptyRows() {
    for (let i = 0; i < 2; i++) {
      this.sectionDetails?.attributes.forEach((attribute: any) => {
        this.output.set(attribute.attName, '');
        this.ids.set(attribute.attName, attribute.id);
      });
      this.rowsData.push(this.output);
      this.output = new Map();
    }
  }
  getMaxLength(attributes: any[]): number {
    let maxLength = 0;
    for (let i = 0; i < attributes.length; i++) {
      if (attributes[i].attValue?.split('/*$').length > maxLength) {
        maxLength = attributes[i].attValue?.split('/*$').length;
      }
    }
    return maxLength;
  }
  removeEmptyRows(): boolean {
    let pushOutput = false;
    for (let j = 0; j < this.output.size; j++) {
      let value = this.output.get(Array.from(this.output.keys())[j]);
      if (
        value == '' ||
        value == 'blank' ||
        value == undefined ||
        value == null
      ) {
        continue;
      } else {
        pushOutput = true;
        break;
      }
    }
    return pushOutput;
  }
  handleRows() {
    let maxLength = this.getMaxLength(this.sectionDetails?.attributes);
    for (let i = 0; i < maxLength; i++) {
      this.sectionDetails?.attributes.forEach((attribute: any) => {
        let val = attribute.attValue ? attribute.attValue?.split('/*$')[i] : '';
        this.output.set(attribute.attName, val);
        this.ids.set(attribute.attName, attribute.id);
      });
      let pushOutput = this.removeEmptyRows();
      if (pushOutput) {
        this.rowsData.push(this.output);
      }
      console.log('output ->', this.output);
      this.output = new Map();
    }
  }

  updatedAttributes: Map<any, any> = new Map();
  // setChanges(rowData: any, field: any) {
  //   // console.log('ID -> ', this.ids.get(field));
  //   // console.log('rowdata -> ', rowData);
  //   // console.log('field -> ', field);
  //   // console.log('New Value -> ', this.newValue);
  //   rowData.set(field, this.newValue);
  //   // console.log('Rows Data -> ', this.rowsData);
  //   let lastUpdatedValue = '';
  //   for (let row of this.rowsData) {
  //     lastUpdatedValue += row.get(field) + '/*$';
  //     // row.get(field);
  //   }
  //   this.updatedAttributes.set(this.ids.get(field), lastUpdatedValue);
  //   // console.log('updated Attributes -> ', this.updatedAttributes);

  //   this.newValue = '';
  //   // this.updatedAttributes.set(attribute.id, attribute.attValue);
  // }
  // @ViewChild(SingleRequestComponent) singleRequest!: SingleRequestComponent;
  setChanges(rowData: any, field: any) {
    rowData.set(field, this.newValue);
    this.requestsService.editTableValue(this.rowsData, field, this.ids);
    this.newValue = null;
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
  dataID: any;
  exportExcel() {
    this.dataID = document.getElementById('myTable');
    this.sharedService.export(this.dataID, `${this.tableId}`);
  }
}
