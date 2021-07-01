import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[city]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CityValidatorDirective,
      multi: true
    }
  ]
})
export class CityValidatorDirective implements Validator {
  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    const validCities: string[] = ['Hamburg', 'Graz'];

    if (control.value && validCities.indexOf(control.value) === -1) {
      return {
        city: {
          actualValue: control.value,
          validCities: validCities
        }
      };
    }

    return null;
  }
}
