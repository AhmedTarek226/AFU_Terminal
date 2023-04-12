import { NgModule } from '@angular/core';
import { SearchauditComponent } from './audit/searchaudit/searchaudit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuditComponent } from './audit/audit.component';
import { allauditComponent } from './allAudit/allaudit.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [{ path: '', component: AuditComponent }];

@NgModule({
  declarations: [SearchauditComponent, allauditComponent, AuditComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
})
export class AuditModule {}
