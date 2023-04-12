import { Component } from '@angular/core';

@Component({
  selector: 'app-generate-form',
  templateUrl: './generate-form.component.html',
  styleUrls: ['./generate-form.component.css'],
})
export class GenerateFormComponent {
  cols: any;
  constructor() {
    this.cols = [
      { field: 'Bank Name', data: 'Access Bank' },
      { field: 'Bank Name', data: 'Access Bank' },
      { field: 'Bank Name', data: 'Access Bank' },
      { field: 'Bank Name', data: 'Access Bank' },
      { field: 'Bank Name', data: 'Access Bank' },
      { field: 'Bank Name', data: 'Access Bank' },
    ];
  }
}
