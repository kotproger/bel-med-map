import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { MapToolTip } from '../../../core/services/data/_other/models';
import { BuildingsInOrganization, SimpleObject } from '../../../core/services/data/buildings/buildings.models';

@Component({
    selector: 'app-map-tooltip',
    templateUrl: './map-tooltip.component.html',
    styleUrls: ['./map-tooltip.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapTooltipComponent implements OnInit {

    @Input()
    set displayData(displayData: MapToolTip) {

      this.displayValues = displayData
          ? displayData.data
          : null;

      this.position = displayData
          ? [displayData.position[0] + 12, displayData.position[1] - 10]
          : null;
    }

    displayValues: BuildingsInOrganization<SimpleObject>[] = null;
    position: number[];

    constructor() { }
        ngOnInit(): void {
    }
}
