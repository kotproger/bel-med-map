import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy} from '@angular/core';
import { BuildingDetailService } from '../../../core/services/data/buildings/building-detail.service';
import { BehaviorSubject } from 'rxjs';
import {
    BuildingsInOrganization,
    BuildingsInOrganizationSet,
    SimpleObject,
    BuildingDetail
 } from '../../../core/services/data/buildings/buildings.models';
import { ICONS } from '../data/mock-icons';

@Component({
    selector: 'app-map-popup',
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPopupComponent implements OnInit, OnDestroy {

    // @Input() organizations: BuildingsInOrganization[]|null;
    @Input()
    set organizationsSet(organizationsSet: BuildingsInOrganizationSet<SimpleObject>) {

        this.usageTypeId = organizationsSet
        ? organizationsSet.usageTypeId
        : null;

        this.usageTypeName = organizationsSet
        ? organizationsSet.usageTypeName
        : null;

        this._organizations = organizationsSet
            ? organizationsSet.items
            : null;
        this.isOneOrganzation = this._organizations && this._organizations.length === 1;
        this.selectedOrganization  = this.isOneOrganzation
            ? this._organizations[0]
            : null;

        this.isOneBuilding = this.isOneOrganzation  && this._organizations[0].buildings.length === 1;
        this.onSelectBuilding(this.selectedOrganization, this.isOneBuilding
            ? this._organizations[0].buildings[0]
            : null
        );
    }

    // массив организаций
    // tslint:disable-next-line: variable-name
    public _organizations: BuildingsInOrganization<SimpleObject>[]|null;
    public usageTypeId: string;
    public usageTypeName: string;
    public icons = ICONS;
    // флаг наличия только одной организации
    public isOneOrganzation = false;
    // флаг наличия только одного здания
    public isOneBuilding = false;

    public selectedOrganization: BuildingsInOrganization<SimpleObject> = null;
    public selectedBuilding: SimpleObject = null;
    public viewIndex = 0;

    public detailOfBuilding$: BehaviorSubject<BuildingDetail> = this.buildingDetailService.buildingSubj$;

    constructor(
        public buildingDetailService: BuildingDetailService
    ) { }

    ngOnInit(): void {
    }

    // выбор здания
    onSelectBuilding(organization: BuildingsInOrganization<SimpleObject>, building: SimpleObject): void {

        this.selectedOrganization = organization;
        this.selectedBuilding = this.selectedBuilding === building
            ? null
            : building;
        this.viewIndex = this.selectedBuilding
            ? 1
            : 0;

        if (this.selectedBuilding) {
            this.buildingDetailService.getBuilding(this.selectedBuilding.id);
        }
    }

    ngOnDestroy(): void {
    }
}
