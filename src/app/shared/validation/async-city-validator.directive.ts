import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';

import { FlightService } from '../../flight-booking/flight-search/flight.service';

@Directive({
  selector: '[asyncCity]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: AsyncCityValidatorDirective,
      multi: true
    }
  ]
})
export class AsyncCityValidatorDirective {
  @Input() asyncCity: 'from' | 'to';

  constructor(private flightService: FlightService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const from = this.asyncCity === 'from' ? control.value : '';
    const to = this.asyncCity === 'to' ? control.value : '';

    return this.flightService.find(from, to).pipe(
      map((flights) => (flights.length > 0 ? {} : { asyncCity: true })),
      delay(1000)
    );
  }
}
