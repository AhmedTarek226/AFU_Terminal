import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ISearchData } from 'src/app/Models/requests/ISearchData';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  // workOrders!: IWorkOrderDetails[];
  isLoading: boolean = false;
  searchError: { msg: string; show: boolean };
  subscriptions: Subscription[] = [];
  @Output() searchData = new EventEmitter<ISearchData>();
  @Output() clearView = new EventEmitter();
  constructor(
    private sharedService: SharedService,
    private translateService: TranslateService
  ) {
    this.searchError = {
      msg: 'fieldsRequired',
      show: false,
    };
    if (this.searchError.show == true) {
      this.search();
    }
    this.searchForm = new FormGroup({
      requestId: new FormControl(''),
      jiraNum: new FormControl(''),
      status: new FormControl(''),
      creationDate: new FormControl(''),
    });
    // this.searchData.emit({ field1: '', field2: '', field3: '' });
  }

  ngOnInit(): void {}

  reset() {
    this.searchError = {
      msg: 'fieldsRequired',
      show: false,
    };
    this.searchForm.reset();
    this.clearView.emit();
    // this.searchData.emit({ OM_ID: '', telephoneNO: '', WFM_WO_ID: '' });
    // this.workOrders = [];
  }

  search() {
    if (
      this.searchForm.value.requestId ||
      this.searchForm.value.jiraNum ||
      this.searchForm.value.status ||
      this.searchForm.value.creationDate
    ) {
      this.searchError.show = false;
      let x = this.searchForm.value.creationDate;
      let newDateFormat = '';
      console.log(x);

      if (typeof x === 'object' && x !== null) {
        x = String(x?.toDateString()).split(' ');
        newDateFormat = `${x[2]}-${x[1]}-${x[3]?.slice(2)}`;
      }
      this.searchData.emit({
        requestId: this.searchForm.value.requestId,
        jiraNum: this.searchForm.value.jiraNum,
        status: this.searchForm.value.status,
        creationDate: newDateFormat,
      });
    } else {
      this.searchError = {
        msg: 'fieldsRequired',
        show: true,
      };
    }
  }

  ngOnDestroy(): void {
    this.searchData.unsubscribe();
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
