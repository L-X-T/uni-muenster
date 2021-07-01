import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'flight-validation-errors',
  templateUrl: './flight-validation-errors.component.html',
  styleUrls: ['./flight-validation-errors.component.css']
})
export class FlightValidationErrorsComponent implements OnInit {
  @Input() errors: any;

  constructor() {}

  ngOnInit(): void {}
}
