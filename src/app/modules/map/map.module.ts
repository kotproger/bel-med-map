import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { MapComponent } from './map.component';
import { MapPopupComponent } from './map-popup/map-popup.component';
import { MapLayersListComponent } from './map-layers-list/map-layers-list.component';
import { MapBuildingsSearchComponent } from './map-buildings-search/map-buildings-search.component';

@NgModule({
    declarations: [
        MapComponent,
        MapPopupComponent,
        MapLayersListComponent,
        MapBuildingsSearchComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [MapComponent]
})
export class MapModule {}
