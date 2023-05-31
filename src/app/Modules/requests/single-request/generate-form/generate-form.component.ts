import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SingleRequestComponent } from '../single-request.component';
import { RequestsService } from 'src/app/Services/requests.service';

@Component({
  selector: 'app-generate-form',
  templateUrl: './generate-form.component.html',
  styleUrls: ['./generate-form.component.css'],
})
export class GenerateFormComponent implements OnChanges {
  cols: any;
  @Input() sectionDetails: any;
  readOnlyList: any[] = [];

  constructor(private requestsService: RequestsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // let att = 'Visa/*$MasterCard/*$Amex7/*$SamsungPay/*$';
    // console.log(att.replaceAll('/*$', ','));

    console.log(
      'this.sectionDetails.attributes -> ',
      this.sectionDetails.attributes
    );

    for (let att of this.sectionDetails.attributes) {
      if (att.attValue?.includes('/*$')) {
        let newAtt = att.attValue.replaceAll('/*$', ',');
        att.attValue = newAtt;
        this.readOnlyList.push(att.id);
      }
    }
  }

  isReadOnly(id: any): boolean {
    return this.readOnlyList.includes(id);
  }

  // updatedAttributes: Map<any, any> = new Map();
  // @ViewChild(SingleRequestComponent) singleRequest!: SingleRequestComponent;
  editAttributeValue(attribute: any) {
    this.requestsService.editFormValue(attribute);
  }
}
