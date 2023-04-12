import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrimengModule } from '../primeng/primeng.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PrimengModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PrimengModule,
    FontAwesomeModule,
    HeaderComponent,
  ],
})
export class SharedModule {}
