import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AllRequestsComponent } from './allRequests.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { SearchComponent } from './search/search.component';
import { EditRequestComponent } from './requests-list/edit-request/edit-request.component';
import { GenerateTableComponent } from './requests-list/generate-table/generate-table.component';
import { GenerateFormComponent } from './requests-list/generate-form/generate-form.component';
import { HandleVoidValuePipe } from 'src/app/pipes/handle-void-value.pipe';

const routes: Routes = [{ path: '', component: AllRequestsComponent }];

@NgModule({
  declarations: [
    RequestsListComponent,
    SearchComponent,
    AllRequestsComponent,
    EditRequestComponent,
    GenerateTableComponent,
    GenerateFormComponent,
    HandleVoidValuePipe,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
})
export class RequestsModule {}
