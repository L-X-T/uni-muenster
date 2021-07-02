import { FormGroup, ValidationErrors } from '@angular/forms';

export function validateRoundTrip(formGroup: FormGroup): ValidationErrors {
  let from = formGroup.controls['from'];
  let to = formGroup.controls['to'];

  if (!from || !to) {
    return null;
  }

  if (from.value === to.value) {
    return { roundTrip: true };
  }

  return null;
}
