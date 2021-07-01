import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityPipe } from './pipes/city.pipe';
import { CityValidatorDirective } from './validation/city-validator.directive';
import { AsyncCityValidatorDirective } from './validation/async-city-validator.directive';
import { FormRoundTripDirective } from './validation/form-round-trip.directive';

const pipes = [CityPipe];
const directives = [CityValidatorDirective, AsyncCityValidatorDirective, FormRoundTripDirective];

@NgModule({
  imports: [CommonModule],
  declarations: [...pipes, ...directives],
  exports: [...pipes, ...directives]
})
export class SharedModule {}
