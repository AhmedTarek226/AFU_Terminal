import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-allaudit',
  templateUrl: './allaudit.component.html',
  styleUrls: ['./allaudit.component.css'],
})
export class allauditComponent implements OnInit {
  // [x:string]:any;

  constructor() {}

  ngOnInit(): void {}

  handleChange(e: any) {
    var index = e.index;
    if (index == 0) {
    }
  }
}
