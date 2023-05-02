import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from 'src/app/Services/requests.service';
import { GenerateFormComponent } from './generate-form/generate-form.component';
import { GenerateTableComponent } from './generate-table/generate-table.component';

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
    private route: ActivatedRoute
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
    console.log('updatedAttributes', updatedAttributes.entries());
    this.requestsService
      .editRequest(this.requestId, updatedAttributes)
      .subscribe((res: any) => console.log(res));
  }
}
