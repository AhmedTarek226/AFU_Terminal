import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IRoute } from 'src/app/Models/IRoute';
import { HomeModule } from 'src/app/Modules/home/home.module';
import { PermisionsService } from 'src/app/Services/permissions.service';
import { SidebarService } from 'src/app/Services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  routes: IRoute[] = [];
  isShow: boolean = true;
  constructor(
    private permisions: PermisionsService,
    public translateService: TranslateService,
    private el: ElementRef,
    private renderer2: Renderer2,
    private sidebarService: SidebarService
  ) {
    this.routes = [
      {
        name: 'requests',
        src: '',
        routerLink: '/requests',
        // permision: true,
        permision: this.permisions.havePermisions('Requests.view'),
      },
      {
        name: 'audit',
        src: '',
        routerLink: '/audit',
        // permision: true,
        permision: this.permisions.havePermisions('Audit.view'),
      },
      {
        name: 'reports',
        src: '',
        routerLink: '/reports',
        // permision: true,
        permision: this.permisions.havePermisions('Reports.view'),
      },
    ];
    this.sidebarService.isShow.subscribe((data) => {
      this.isShow = data;
    });
  }

  ngOnInit(): void {}

  redirect(link: string): void {
    if (link.startsWith('h')) {
      window.location.href = link;
      return;
    }

    window.location.href = 'http://' + window.location.host + link;
  }
  ty: boolean = true;
  translate() {
    this.ty = !this.ty;
  }
}
