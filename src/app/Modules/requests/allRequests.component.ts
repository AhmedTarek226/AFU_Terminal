import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ISearchData } from 'src/app/Models/requests/ISearchData';
import { IRequestDetails } from 'src/app/Models/requests/IRequestDetails';
import { RequestsService } from 'src/app/Services/requests.service';
import { ToastService } from 'src/app/Services/toast.service';

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
  constructor(
    private toastService: ToastService,
    private translateService: TranslateService,
    private requestsService: RequestsService
  ) {
    this.showSearchError = false;
    this.subscriptions = [];
    this.requestsList = [];
  }

  ngOnInit(): void {
    this.requestsService.getAllRequests().subscribe({
      next: (response: any) => {
        this.requestsList = response;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }

  reset() {
    this.requestsList = [];
  }

  // searchObj!: ISearchData;
  search(searchData: ISearchData) {
    this.firstExcecute = false;
    if (searchData.field1 || searchData.field2 || searchData.field3) {
      let sub = this.requestsService.search(searchData).subscribe({
        next: (repsonse) => {
          this.requestsList = repsonse;
        },
        error: (err) => {
          // this.isLoading = false;
          if (this.translateService.currentLang == 'en')
            this.toastService.showError('Error', 'Failed to load requests !!!');
          else this.toastService.showError('خطأ', 'فشل تحميل الطلبات  !!!');
        },
        complete: () => {
          if (this.requestsList?.length == 0) {
            if (this.translateService.currentLang == 'en')
              this.toastService.showWarn('Warning', 'No requests found');
            else this.toastService.showWarn('عذرًا', 'لا يوجد طلبات ');
          }
        },
      });
      this.subscriptions.push(sub);
    } else {
      this.reset();
    }
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
