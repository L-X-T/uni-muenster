import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroup, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { FlightService } from '../../flight-booking/flight-search/flight.service';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Directive({
  selector: 'form[asyncFlight]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: AsyncFlightValidatorDirective,
      multi: true
    }
  ]
})
export class AsyncFlightValidatorDirective {
  @Input() asyncFlight: string[] = ['from', 'to'];

  constructor(private flightService: FlightService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (this.asyncFlight.length !== 2) {
      return of(null);
    }

    const group: FormGroup = control as FormGroup; // type cast
    const from = group?.controls[this.asyncFlight[0]]?.value;
    const to = group?.controls[this.asyncFlight[1]]?.value;

    if (!from || !to) {
      return of(null);
    }

    return this.flightService.find(from, to).pipe(
      map((flights) => {
        return flights.length > 0 ? null : { asyncFlight: true };
      })
      // delay(1000)
    );
  }
}
