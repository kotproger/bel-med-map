import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { BuildingDetailService } from '../../../../core/services/data/buildings/building-detail.service';
import { ICONS } from '../../data/mock-icons';
import {
    SimpleObject,
    BuildingPoint,
    BuildingDetail
 } from '../../../../core/services/data/buildings/buildings.models';

@Component({
    selector: 'app-popup-detail',
    templateUrl: './popup-detail.component.html',
    styleUrls: ['./popup-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupDetailComponent implements OnInit {

    @Input() organization: SimpleObject;
    @Input() usageType: SimpleObject;
    @Input() isOneBuilding: boolean;
    @Input() fromId: number;

    @Input()
        set building(building: BuildingPoint) {

            if (building) {
                this.buildingDetailService.getBuilding(building.id);
                if (building.usageTypeId) {
                    this.usageType = {
                        id: building.usageTypeId,
                        name: building.usageTypeName
                    };
                }
            } else {
                this.buildingDetailService.getBuilding(null);
            }
        }

    @Output() returnEvent = new EventEmitter<number>();

    public detailOfBuilding$: BehaviorSubject<BuildingDetail> = this.buildingDetailService.buildingSubj$;

    public icons = ICONS;

    constructor(
        private buildingDetailService: BuildingDetailService
    ) { }

    ngOnInit(): void {
    }

    return(): void {
        this.returnEvent.emit(this.fromId);
    }

}
