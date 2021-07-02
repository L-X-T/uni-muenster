import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Flight } from '../../entities/flight';

@Component({
  selector: 'flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css']
})
export class FlightCardComponent implements OnInit, OnChanges {
  debug = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  @Input() item: Flight;
  @Input() selected: boolean;
  @Output() selectedChange = new EventEmitter<boolean>();

  ngOnChanges(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - OnChanges()]');
      console.log(this.item);
      console.log('selected: ' + this.selected);
    }
  }

  ngOnInit(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnInit()]');
      console.log(this.item);
      console.log('selected: ' + this.selected);
    }
  }

  select(): void {
    this.selected = true;
    this.selectedChange.next(this.selected);
  }

  deselect(): void {
    this.selected = false;
    this.selectedChange.next(this.selected);
  }

  onEdit(flightId: number): void {
    this.router.navigate(['flight-edit', flightId, { showDetails: true }], { relativeTo: this.activatedRoute.parent });
  }
}
