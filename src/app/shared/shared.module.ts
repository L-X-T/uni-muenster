import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityPipe } from './pipes/city.pipe';
import { CityValidatorDirective } from './validation/city-validator.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [CityPipe, CityValidatorDirective],
  exports: [CityPipe, CityValidatorDirective]
})
export class SharedModule {}
