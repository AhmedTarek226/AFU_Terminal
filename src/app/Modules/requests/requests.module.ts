import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AllRequestsComponent } from './allRequests.component';
import { SearchComponent } from './search/search.component';
import { GenerateTableComponent } from './single-request/generate-table/generate-table.component';
import { GenerateFormComponent } from './single-request/generate-form/generate-form.component';
import { HandleVoidValuePipe } from 'src/app/pipes/handle-void-value.pipe';
import { SingleRequestComponent } from './single-request/single-request.component';

const routes: Routes = [
  { path: 'Requests', component: AllRequestsComponent },
  {
    path: 'Requests/:id',
    component: SingleRequestComponent,
    pathMatch: 'full',
  },
];
@NgModule({
  declarations: [
    SearchComponent,
    AllRequestsComponent,
    SingleRequestComponent,
    GenerateTableComponent,
    GenerateFormComponent,
    HandleVoidValuePipe,
    SingleRequestComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
})
export class RequestsModule {}
