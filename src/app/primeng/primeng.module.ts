import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion'; //accordion and accordion tab
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';

// import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TabViewModule,
    DropdownModule,
    ProgressSpinnerModule,
    AccordionModule,
    InputNumberModule,
    InputTextModule,
    InputMaskModule,
    CalendarModule,
    FieldsetModule,
    TreeModule,
    ToastModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    KeyFilterModule,
    TableModule,
    MultiSelectModule,
    PaginatorModule,
  ],
  exports: [
    CommonModule,
    TabViewModule,
    DropdownModule,
    ProgressSpinnerModule,
    AccordionModule,
    InputNumberModule,
    InputTextModule,
    InputMaskModule,
    CalendarModule,
    FieldsetModule,
    TreeModule,
    ToastModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    KeyFilterModule,
    TableModule,
    MultiSelectModule,
    PaginatorModule,
  ],
  providers: [ConfirmationService],
})
export class PrimengModule {}
