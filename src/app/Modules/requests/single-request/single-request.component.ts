import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from 'src/app/Services/requests.service';
import { GenerateFormComponent } from './generate-form/generate-form.component';
import { GenerateTableComponent } from './generate-table/generate-table.component';
import { ToastService } from 'src/app/Services/toast.service';

@Component({
  selector: 'app-single-request',
  templateUrl: './single-request.component.html',
  styleUrls: ['./single-request.component.css'],
})
export class SingleRequestComponent {
  requestData: any;
  requestId: any;
  @ViewChild(GenerateFormComponent)
  generateFormComponent!: GenerateFormComponent;
  @ViewChild(GenerateTableComponent)
  generateTableComponent!: GenerateTableComponent;
  // updatedAttributes: Map<any, any> = new Map();

  constructor(
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestId = params['id'];
    });
    this.requestsService.getSingleRequest(this.requestId).subscribe({
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

    if (!this.requestsService.editRequest()) {
      this.toastService.showWarn('Warning', 'No Changes Available');
    } else {
      this.requestsService.editRequest()?.subscribe({
        next: (res: any) => {
          // console.log(res)
          if (res?.statusCode == 200) {
            this.toastService.showSuccess(
              'Success',
              'Changes Updated Successfully'
            );
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

  approve() {
    console.log('approve btn pressed');
  }
}
