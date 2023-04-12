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
      field1: new FormControl(''),
      field2: new FormControl(''),
      field3: new FormControl(''),
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
      this.searchForm.value.field1 ||
      this.searchForm.value.field2 ||
      this.searchForm.value.field3
    ) {
      this.searchError.show = false;
      this.searchData.emit({
        field1: this.searchForm.value.field1,
        field2: this.searchForm.value.field2,
        field3: this.searchForm.value.field3,
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
