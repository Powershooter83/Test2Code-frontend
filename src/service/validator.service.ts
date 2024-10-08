import {Injectable} from '@angular/core';
import {AbstractControl, ValidatorFn} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() {
  }

  getValidator(language: string): ValidatorFn {
    let testAnnotation = '';

    if (language === 'Java') {
      testAnnotation = '@Test';
    }

    if (language === 'Python') {
      testAnnotation = 'assert';
    }

    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value || '';
      const hasTest = new RegExp(testAnnotation).test(value);
      return hasTest ? null : {requiredTest: true};
    };
  }
}
