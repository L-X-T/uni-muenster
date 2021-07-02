import { Component } from '@angular/core';

import { Flight } from '../../entities/flight';
import { FlightService } from './flight.service';
import { validCities } from '../../shared/validation/city-validator.directive';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent {
  from: string;
  to: string;
  flights: Flight[] = [];
  selectedFlight: Flight;

  message: string;

  basket: object = {
    '3': true,
    '5': true
  };

  validCities = validCities;

  constructor(private flightService: FlightService) {}

  search(): void {
    this.flightService.find(this.from, this.to).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      }
    });
  }

  select(f: Flight): void {
    this.selectedFlight = f;
  }

  /*save(flight: Flight): void {
    if (flight.id <= 5) {
      console.error('Error', 'We cannot update this flight!');

      this.message = 'Error!';
    }

    this.flightService.save(flight ? flight : this.selectedFlight).subscribe({
      next: (flight) => {
        this.selectedFlight = flight;

        const flightToReplace = this.flights.find((aFlight) => aFlight.id === flight.id);
        if (flightToReplace) {
          flightToReplace.from = flight.from;
          flightToReplace.to = flight.to;
          flightToReplace.date = flight.date;
          flightToReplace.delayed = flight.delayed;

          if (environment.debug) {
            console.log('flight saved successfully!');
          }
        }

        this.message = 'Success!';
      },
      error: (errResponse) => {
        console.error('Error', errResponse);
        this.message = 'Error!';
      }
    });
  }*/

  delayFirstFlight(): void {
    const ONE_MINUTE = 1000 * 60;

    const oldFlights = this.flights;
    const oldFlight = oldFlights[0];
    const oldDate = new Date(oldFlight.date);

    // Mutable
    // oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
    // oldFlight.date = oldDate.toISOString();

    // Immutable
    const newDate = new Date(oldDate.getTime() + 15 * ONE_MINUTE);
    const newFlight: Flight = { ...oldFlight, date: newDate.toISOString() };
    this.flights = [newFlight, ...oldFlights.slice(1)];
  }
}
