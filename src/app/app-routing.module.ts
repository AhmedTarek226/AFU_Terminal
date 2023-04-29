import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Modules/login/login.component';
import { MainlayoutComponent } from './shared/mainlayout/mainlayout.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/requests', pathMatch: 'full' },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('src/app/Modules/home/home.module').then((m) => m.HomeModule),
    // loadChildren:'src/app/Modules/home/home.module#HomeModule',
  },
  {
    path: '',
    component: MainlayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/Modules/requests/requests.module').then(
            (m) => m.RequestsModule
          ),
      },
    ],
  },
  {
    path: 'audit',
    component: MainlayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/Modules/audit/audit.module').then(
            (m) => m.AuditModule
          ),
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
