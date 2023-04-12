import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SidebarService } from 'src/app/Services/sidebar.service';

@Component({
  selector: 'app-mainlayout',
  templateUrl: './mainlayout.component.html',
  styleUrls: ['./mainlayout.component.css'],
  providers: [MessageService],
})
export class MainlayoutComponent implements OnInit {
  isShowSide: boolean = true;
  constructor(private sidebarService: SidebarService) {}
  ngOnInit(): void {
    this.sidebarService.isShow.subscribe((val) => (this.isShowSide = val));
  }
}
