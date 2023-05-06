import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'handleVoidValue',
})
export class HandleVoidValuePipe implements PipeTransform {
  transform(value: string): string {
    if (
      value == '?????' ||
      value == null ||
      value === undefined ||
      value === 'Void' ||
      value == 'void' ||
      value == 'blank' ||
      value == ''
    )
      return '---';
    else if (value.includes('/*$')) {
      return value.replaceAll('/*$', ',');
    }
    return value;
  }
}
