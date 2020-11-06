import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { ICONS } from '../../data/mock-icons';
import {
    SimpleObject,
    BuildingsInOrganization,
    BuildingPoint

 } from '../../../../core/services/data/buildings/buildings.models';

@Component({
    selector: 'app-popup-list',
    templateUrl: './popup-list.component.html',
    styleUrls: ['./popup-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupListComponent implements OnInit {

    @Input() organizations: BuildingsInOrganization<SimpleObject | BuildingPoint>[];
    @Input() usageType: SimpleObject;
    @Input() title = '';
    @Output() selectBuildingEvent = new EventEmitter<any>();

    public icons = ICONS;

    constructor(
    ) { }

    ngOnInit(): void {
    }

    onSelectBuilding(o: SimpleObject, b: SimpleObject | BuildingPoint): void {
        this.selectBuildingEvent.emit({organization: o, building: b});
    }

}
