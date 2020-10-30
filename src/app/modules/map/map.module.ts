import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { MapComponent } from './map.component';
import { MapPopupComponent } from './map-popup.component';

@NgModule({
  declarations: [MapComponent, MapPopupComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [MapComponent]
})
export class MapModule {}
