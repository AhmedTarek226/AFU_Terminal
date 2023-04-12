import { Component, Input, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/Services/requests.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css'],
})
export class EditRequestComponent {
  @Input() requestData: any;
  // : any;
  constructor(private requestsService: RequestsService) {}
  // ngOnInit(): void {
  //   this.requestsService.getSingleRequest(this.requestId).subscribe({
  //     next: (response: any) => {
  //       this.requestData = response.body;
  //     },
  //     error: (err) => {
  //       console.log('error', err);
  //     },
  //     complete: () => {},
  //   });
  // }
}
