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

  updateChanges() {
    let updatedAttributes = new Map([
      ...this.generateFormComponent?.updatedAttributes,
      ...this.generateTableComponent?.updatedAttributes,
    ]);

    let newUpdatedAttributes = this.handleUpdatedAttributes(updatedAttributes);
    console.log('updatedAttributes', updatedAttributes.entries());
    if (newUpdatedAttributes.length == 0) {
      this.toastService.showWarn('Warning', 'No Changes Available');
      return;
    }
    this.requestsService.editRequest(newUpdatedAttributes).subscribe({
      next: (res: any) => {
        // console.log(res)
        if (res.statusCode == 200) {
          this.toastService.showSuccess(
            'Success',
            'Changes Updated Successfully'
          );
        }
      },
      error: (err) => {
        this.toastService.showError('ERROR', 'Unknown Error !!');
      },
    });
  }

  handleUpdatedAttributes(updatedAttributes: Map<any, any>) {
    let newFormat = [];
    for (const [key, value] of updatedAttributes) {
      newFormat.push({
        attId: key,
        attVal: value,
      });
    }
    return newFormat;
  }
}
