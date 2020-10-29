import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [MapComponent]
})
export class MapModule {}
