import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Flight } from '../../entities/flight';
import { validateCity } from '../../shared/validation/city-validator';
import { validCities } from '../../shared/validation/city-validator.directive';
import { validateRoundTrip } from '../../shared/validation/form-round-trip';

@Component({
  selector: 'flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css']
})
export class FlightEditComponent implements OnChanges, OnInit {
  @Input() flight: Flight;

  @Output() saved: EventEmitter<Flight> = new EventEmitter<Flight>();

  editForm: FormGroup;
  isEditFormInitialized = false;

  controls: { label: string; field: string; validators?: ValidatorFn | ValidatorFn[] }[] = [
    {
      label: 'Id',
      field: 'id'
    },
    {
      label: 'From',
      field: 'from',
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity(validCities)]
    },
    {
      label: 'To',
      field: 'to',
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity(validCities)]
    },
    {
      label: 'Date',
      field: 'date',
      validators: [Validators.required, Validators.minLength(21), Validators.maxLength(35)]
    }
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnChanges(): void {
    this.initForm();

    this.logEditForm();
  }

  ngOnInit(): void {
    if (!this.isEditFormInitialized) {
      this.initForm();
    }

    this.editForm.validator = validateRoundTrip;

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

  private initForm(): void {
    this.editForm = this.formBuilder.group({});
    for (let control of this.controls) {
      this.editForm.addControl(control.field, new FormControl(this.flight[control.field], control.validators));
    }

    this.isEditFormInitialized = true;
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
