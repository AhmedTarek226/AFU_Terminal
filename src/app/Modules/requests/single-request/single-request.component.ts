import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { RequestsService } from 'src/app/Services/requests.service';
import { GenerateFormComponent } from './generate-form/generate-form.component';
import { GenerateTableComponent } from './generate-table/generate-table.component';
import { ToastService } from 'src/app/Services/toast.service';
import { Location } from '@angular/common';
type statusOption =
  | 'In-Complete Data'
  | 'Failed'
  | 'Pending Approval'
  | 'Approved';
@Component({
  selector: 'app-single-request',
  templateUrl: './single-request.component.html',
  styleUrls: ['./single-request.component.css'],
})
export class SingleRequestComponent {
  requestData: any;
  requestId: number = 0;
  status: statusOption = 'Failed';
  @ViewChild(GenerateFormComponent)
  generateFormComponent!: GenerateFormComponent;
  @ViewChild(GenerateTableComponent)
  generateTableComponent!: GenerateTableComponent;
  // updatedAttributes: Map<any, any> = new Map();
  // statusList: string[] = ['In-Complete Data', 'Failed', 'Pending Approval'];
  isEditable: boolean = false;
  constructor(
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    private location: Location
  ) {
    this.requestsService.backFromSingleRequest.next(false);
    this.location.go('/Requests');
  }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: any) {
  //   this.location.forward();
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // onBeforeUnload(event: any) {
  //   event.preventDefault();
  //   event.returnValue = false;
  // }
  ngOnInit(): void {
    // this.location.replaceState('/Requests');
    this.route.params.subscribe((params) => {
      this.requestId = params['id'];
      this.status = params['status'];
      console.log(this.requestId);
      console.log(this.status);
      if (
        this.status &&
        (this.status === 'In-Complete Data' || this.status === 'Failed')
      )
        this.isEditable = true;
      else this.isEditable = false;
    });
    // return;
    this.requestsService.getSingleRequest(this.requestId).subscribe({
      next: (response: any) => {
        this.requestData = response;
        if (this.requestData.length == 0) {
          this.toastService.showWarn('Warning', 'No Data Found');
        }
        console.log(this.requestData);
      },
      error: (err) => {
        console.log('error', err);
      },
      complete: () => {},
    });
  }

  // editFormValue(attribute: any) {
  //   this.updatedAttributes.set(attribute.id, attribute.attValue);
  // }
  // editTableValue(rowsData: any, field: any, ids: any) {
  //   let lastUpdatedValue = '';
  //   for (let row of rowsData) {
  //     lastUpdatedValue += row.get(field) + '/*$';
  //   }
  //   this.updatedAttributes.set(ids.get(field), lastUpdatedValue);
  //   // this.updatedAttributes.set(ids.get(field), lastUpdatedValue);
  // }
  backToRequests() {
    this.requestsService.backFromSingleRequest.next(true);
    this.router.navigate(['/Requests']);
  }
  updateChanges() {
    // this.updatedAttributes.set
    // let updatedAttributes = new Map([
    //   ...this.generateFormComponent?.updatedAttributes,
    //   ...this.generateTableComponent?.updatedAttributes,
    // ]);

    // let newUpdatedAttributes = this.handleUpdatedAttributes(
    //   this.updatedAttributes
    // );
    // console.log('updatedAttributes', this.updatedAttributes.entries());
    // if (newUpdatedAttributes.length == 0) {
    //   this.toastService.showWarn('Warning', 'No Changes Available');
    //   return;
    // }

    if (!this.requestsService.editRequest(this.requestId)) {
      this.toastService.showWarn('Warning', 'No Changes Available');
    } else {
      this.requestsService.editRequest(this.requestId)?.subscribe({
        next: (res: any) => {
          // console.log(res)
          if (res?.statusCode == 200) {
            this.toastService.showSuccess(
              'Success',
              'Changes Updated Successfully'
            );
            this.reloadWithChanges();
          } else {
            this.toastService.showWarn('Warning', res.clientMessage);
          }
        },
        error: (err) => {
          this.toastService.showError('ERROR', 'Unknown Error !!');
        },
        complete: () => {
          this.requestsService.updatedAttributes.clear();
        },
      });
    }
  }
  reloadWithChanges() {
    let searchObject = {
      requestId: this.requestId,
      jiraNum: '',
      status: '',
      creationDate: '',
    };
    this.requestsService.findRequests(0, 10, searchObject).subscribe({
      next: (Response: any) => {
        this.status = Response?.content[0]?.status;
        const navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve', // Optional: To preserve existing query parameters
          skipLocationChange: true, // Optional: To prevent updating the browser URL
          replaceUrl: true,
        };
        this.router.navigate(
          ['/Requests', this.requestId, { status: this.status }],
          navigationExtras
        );
      },
      error: (err: any) => {
        // this.msgErrorApi = 'errorMsg';
      },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  approveReq() {
    console.log('approve btn pressed');
    this.requestsService.approveReq(this.requestId, this.status).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200) {
          this.toastService.showSuccess(
            'Success',
            'Request approved successfully'
          );
          this.status = 'Approved';
        } else {
          this.toastService.showWarn('Warning', res.clientMessage);
        }
      },
      error: (err) => {
        this.toastService.showError('ERROR', 'Unknown Error !!');
      },
      complete: () => {},
    });
  }
}
