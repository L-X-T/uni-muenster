import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { FlightService } from '../flight-search/flight.service';
import { Flight } from '../../entities/flight';
import { validateCity } from '../../shared/validation/city-validator';

@Component({
  selector: 'flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css']
})
export class FlightEditComponent implements OnChanges {
  @Input() flight: Flight;

  @Output() saved: EventEmitter<Flight> = new EventEmitter<Flight>();

  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private flightService: FlightService) {}

  ngOnChanges(): void {
    this.editForm = this.formBuilder.group({
      id: [this.flight.id],
      from: [this.flight.from, [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity]],
      to: [this.flight.to, [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity]],
      date: [this.flight.date, [Validators.required, Validators.minLength(21), Validators.maxLength(35)]]
    });

    this.logEditForm();

    if (environment.debug) {
      this.editForm.valueChanges.subscribe((value) => {
        console.debug('changes: ', value);
      });
    }
  }

  save(): void {
    this.logEditForm();

    this.saved.emit(this.editForm.value);
  }

  private logEditForm(): void {
    if (environment.debug) {
      console.log('value: ', this.editForm.value);
      console.log('valid: ', this.editForm.valid);
      console.log('touched: ', this.editForm.touched);
      console.log('dirty: ', this.editForm.dirty);
    }
  }
}
