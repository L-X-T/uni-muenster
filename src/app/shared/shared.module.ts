import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityPipe } from './pipes/city.pipe';
import { CityValidatorDirective } from './validation/city-validator.directive';
import { AsyncCityValidatorDirective } from './validation/async-city-validator.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [CityPipe, CityValidatorDirective, AsyncCityValidatorDirective],
  exports: [CityPipe, CityValidatorDirective, AsyncCityValidatorDirective]
})
export class SharedModule {}
