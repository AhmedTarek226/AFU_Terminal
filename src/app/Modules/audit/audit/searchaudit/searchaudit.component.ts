import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-searchaudit',
  templateUrl: './searchaudit.component.html',
  styleUrls: ['./searchaudit.component.css'],
  providers: [DatePipe],
})
export class SearchauditComponent implements OnInit, OnDestroy {
  [x: string]: any;

  @Output() getResponse = new EventEmitter();
  showSearchError: boolean = false;
  @Output() clearView = new EventEmitter();
  myForm!: FormGroup;
  ActionDate: any = '';
  ActionName: any = '';
  UserName: any = '';
  currentDate: any = new Date();
  maxDate: Date;
  // titles: any;
  subscriptions: Subscription[] = [];

  constructor(
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private cdref: ChangeDetectorRef
  ) {
    // this.titles = this.translateService.data.audit.search;
    // let sub = this.translateService.dataa.subscribe({
    //   next: (data) => {
    //     this.titles = data.audit.search;
    //     if (this.searchError.show == true) {
    //       this.onSubmit();
    //     }
    //   },
    // });
    // this.subscriptions.push(sub);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      ActionDate: new FormControl(''),
      ActionName: new FormControl(''),
      UserName: new FormControl(''),
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  onSubmit() {
    if (
      this.myForm.value?.ActionDate ||
      this.myForm.value?.ActionName ||
      this.myForm.value?.UserName
    ) {
      this.showSearchError = false;
      let x = this.myForm.value?.ActionDate;
      let newDateFormat = '';
      console.log(x);

      if (typeof x === 'object' && x !== null) {
        x = String(x?.toDateString()).split(' ');
        newDateFormat = `${x[2]}-${x[1]}-${x[3]?.slice(2)}`;
      }
      var obj = {
        ActionDate: newDateFormat,
        ActionName: this.myForm.value?.ActionName,
        UserName: this.myForm.value?.UserName,
      };

      this.getResponse.emit(obj);
    } else {
      this.showSearchError = true;
    }
  }

  reset() {
    this.showSearchError = false;

    this.myForm.reset();
    this.clearView.emit();
    // this.getResponse.emit({});
  }

  ngOnDestroy(): void {
    this.getResponse.unsubscribe();
    this.clearView.unsubscribe();
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
