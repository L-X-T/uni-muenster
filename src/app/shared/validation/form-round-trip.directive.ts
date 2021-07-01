import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: 'form[roundTrip]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FormRoundTripDirective,
      multi: true
    }
  ]
})
export class FormRoundTripDirective {
  @Input() roundTrip: string[] = [];

  validate(control: AbstractControl): object {
    if (this.roundTrip.length !== 2) {
      return {};
    }

    const group: FormGroup = control as FormGroup; // type cast
    const fromCtrl = group.controls[this.roundTrip[0]];
    const toCtrl = group.controls[this.roundTrip[1]];

    if (!fromCtrl?.value || !toCtrl?.value) {
      return {};
    }

    if (fromCtrl.value === toCtrl.value) {
      return {
        roundTrip: true
      };
    }
  }

  constructor() {}
}
