import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  returnPage: 'Home' | 'Login' = 'Home';
  subscriptions: Subscription[] = [];
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    let sub = this.authService.checkLogout.subscribe((val) => {
      if (val === true) {
        this.returnPage = 'Login';
      } else {
        this.returnPage = 'Home';
      }
    });

    this.subscriptions.push(sub);
  }

  navigate() {
    if (this.returnPage === 'Login') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
