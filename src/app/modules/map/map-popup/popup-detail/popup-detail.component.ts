import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Subscription } from 'rxjs';

import { BuildingDetailService } from '../../../../core/services/data/buildings/building-detail.service';
import { AttachedValueService } from '../../../../core/services/data/attached/attached-value.service';

import { BackEndResponse } from '../../../../core/services/http/http.models';

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
export class PopupDetailComponent implements OnInit, OnDestroy {

    @Input() organization: SimpleObject;
    @Input() usageType: SimpleObject;
    @Input() isOneBuilding: boolean;
    @Input() fromId: number;

    @Input()
        set building(building: BuildingPoint) {

            this.buildingPhoto = null;
            this.buildingDetailService.getBuilding(null);

            if (building) {
                this.buildingDetailService.getBuilding(building.id);
                if (building.usageTypeId) {
                    this.usageType = {
                        id: building.usageTypeId,
                        name: building.usageTypeName
                    };
                }

                // получение фото
            }
            this.changeDetectorRef.detectChanges();
        }

    @Output() returnEvent = new EventEmitter<number>();
    @Output() extentToMapEvent = new EventEmitter<number[]>();

    // public detailOfBuilding$: BehaviorSubject<BuildingDetail> = this.buildingDetailService.buildingSubj$;
    public detailOfBuilding: BuildingDetail = null;

    public icons = ICONS;

    public buildingPhoto: any = null;

    private subscription: Subscription;

    constructor(
        private buildingDetailService: BuildingDetailService,
        private attachedValueService: AttachedValueService,
        private changeDetectorRef: ChangeDetectorRef
    ) {    }

    ngOnInit(): void {
        this.subscription = this.buildingDetailService.buildingSubj$.subscribe(value => {

            this.detailOfBuilding = value;

            if  (value && value.photos && value.photos.length) {
                this.attachedValueService.getAttached(value.photos[0].id)
                    .subscribe((photo: BackEndResponse<any>) => {
                        const { success, data, message} = photo;
                        const detail = this.detailOfBuilding;
                        if (success && detail && detail.photos && detail.photos.length && detail.photos[0].id === data.id) {
                            this.buildingPhoto = 'data:image/png;base64,' + data.blobValue;
                            this.changeDetectorRef.detectChanges();
                        }
                    });
            }
            this.changeDetectorRef.detectChanges();
            // ;
        });
    }

    // выполняется ли загрузка фото
    isLoadingPhoto(): boolean {
        return this.isHavePhoto()
            ? this.buildingPhoto
                ? false
                : true
            : false;
    }

    // есть ли фото у здания
    isHavePhoto(): boolean {
        return this.detailOfBuilding
            ? this.detailOfBuilding.photos && this.detailOfBuilding.photos.length
                ? true
                : false
            : true;
    }
    // событие возврата
    return(): void {
        this.returnEvent.emit(this.fromId);
    }

    // приблизить к координатам точки
    extentToMap(target: any): void {
        target.dispatchEvent(new CustomEvent('extentToPointMapEvent', {
            bubbles: true,  detail: [this.detailOfBuilding.lon, this.detailOfBuilding.lat]
        }));
        // this.extentToMapEvent.emit([this.detailOfBuilding.lon, this.detailOfBuilding.lat]);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
