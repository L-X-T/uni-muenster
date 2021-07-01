import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

export const validCities = ['Hamburg', 'Graz', 'Wien', 'Berlin', 'Innsbruck', 'Rom'];

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
  @Input() city: string[];

  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
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
