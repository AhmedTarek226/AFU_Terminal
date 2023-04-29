import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from 'src/app/Services/requests.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css'],
})
export class EditRequestComponent {
  requestData: any;
  requestId: any;
  // : any;
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
}
