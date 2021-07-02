import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { FlightStatusToggleComponent } from './flight-status-toggle/flight-status-toggle.component';
import { FlightValidationErrorsComponent } from './flight-validation-errors/flight-validation-errors.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';

import { FLIGHT_BOOKING_ROUTES } from './flight-booking.routes';

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, ReactiveFormsModule, RouterModule.forChild(FLIGHT_BOOKING_ROUTES)],
  declarations: [
    FlightSearchComponent,
    FlightCardComponent,
    FlightStatusToggleComponent,
    FlightValidationErrorsComponent,
    FlightEditComponent,
    PassengerSearchComponent
  ],
  providers: [],
  exports: [FlightSearchComponent]
})
export class FlightBookingModule {}
