import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Flight } from '../../entities/flight';
import { validateCity } from '../../shared/validation/city-validator';
import { validCities } from '../../shared/validation/city-validator.directive';
import { validateRoundTrip } from '../../shared/validation/form-round-trip';
import { FlightService } from '../flight-search/flight.service';

@Component({
  selector: 'flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css']
})
export class FlightEditComponent implements OnChanges, OnInit, OnDestroy {
  @Input() flight: Flight;

  @Output() saved: EventEmitter<Flight> = new EventEmitter<Flight>();

  id: string;
  showDetails: string;
  message: string;

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

  private valueChangesSubscription: Subscription;

  constructor(private route: ActivatedRoute, private flightService: FlightService, private formBuilder: FormBuilder) {}

  ngOnChanges(): void {
    this.initForm();

    this.logEditForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.showDetails = params['showDetails'];

      this.flightService.findById(this.id).subscribe(
        (flight) => {
          this.flight = flight;
          this.message = 'Loading was successful.';
          this.initForm();
        },
        (err) => {
          this.message = 'Error loading data!';
        }
      );
    });

    if (!this.isEditFormInitialized) {
      this.initForm();
    }

    this.editForm.validator = validateRoundTrip;
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  save(): void {
    this.logEditForm();

    const flightToSave: Flight = this.editForm.value; // same as: const flightToSave = this.editForm.value as Flight;

    this.flightService.save(flightToSave).subscribe(
      (flight) => {
        console.warn('[save] saved flight:');
        console.log(flight);
        this.flight = flight;
        this.message = 'Saving was successful.';
      },
      (err) => {
        this.message = 'Error saving data!';
      }
    );

    this.saved.emit(this.editForm.value);
  }

  private initForm(): void {
    this.editForm = this.formBuilder.group({});
    for (let control of this.controls) {
      this.editForm.addControl(control.field, new FormControl(this.flight ? this.flight[control.field] : '', control.validators));
    }

    if (environment.debug) {
      if (this.valueChangesSubscription) {
        this.valueChangesSubscription.unsubscribe();
      }

      this.valueChangesSubscription = this.editForm.valueChanges.subscribe((value) => {
        console.debug('changes: ', value);
      });
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
