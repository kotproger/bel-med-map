import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy} from '@angular/core';

import {
    BuildingPoint,
    BuildingsInOrganization,
    BuildingsInOrganizationSet,
    SimpleObject
 } from '../../../core/services/data/buildings/buildings.models';
import { ICONS } from '../data/mock-icons';

const GROUPDISPALYINDEX = 0;
const SEARCHDISPALYINDEX = 1;
const DETAILDISPALYINDEX = 2;

@Component({
    selector: 'app-map-popup',
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPopupComponent implements OnInit, OnDestroy {

    @Input()
    set inGroupOrganizationsSet(inGroupOrganizationsSet: BuildingsInOrganizationSet<SimpleObject>) {

        this.usageType = inGroupOrganizationsSet
        ? inGroupOrganizationsSet.usageType
        : null;

        this.inGroupOrganizations = inGroupOrganizationsSet
            ? inGroupOrganizationsSet.items
            : null;

        this.parentViewIndex = this.inGroupOrganizations
            ? GROUPDISPALYINDEX
            : SEARCHDISPALYINDEX;

        this.isOneOrganzation = this.inGroupOrganizations && this.inGroupOrganizations.length === 1;
        this.selectedOrganization  = this.isOneOrganzation
            ? this.inGroupOrganizations[0].organization
            : null;

        this.isOneBuilding = this.isOneOrganzation  && this.inGroupOrganizations[0].buildings.length === 1;
        this.onSelectBuilding({
            organization: this.selectedOrganization,
            building:  this.isOneBuilding
                ? this.inGroupOrganizations[0].buildings[0]
                : null
        });
    }

    @Input()
    set inSearchOganizationsSet(inSearchOganizationsSet: BuildingsInOrganization<BuildingPoint>[]) {

        this.inSearchOrganizations = inSearchOganizationsSet
            ? inSearchOganizationsSet
            : null;

        this.parentViewIndex = this.inSearchOrganizations
            ? SEARCHDISPALYINDEX
            : GROUPDISPALYINDEX;

        this.isOneOrganzation = this.inSearchOrganizations && this.inSearchOrganizations.length === 1;
        this.selectedOrganization  = this.isOneOrganzation
            ? this.inSearchOrganizations[0].organization
            : null;

        this.isOneBuilding = this.isOneOrganzation  && this.inSearchOrganizations[0].buildings.length === 1;
        this.onSelectBuilding({
            organization: this.selectedOrganization,
            building:  this.isOneBuilding
                ? this.inSearchOrganizations[0].buildings[0]
                : null
        });
    }

    // массив организаций для отображения значений по клику
    public inGroupOrganizations: BuildingsInOrganization<SimpleObject>[];
    // массив организаций для отображения значений результатов отбора
    public inSearchOrganizations: BuildingsInOrganization<BuildingPoint>[];
    public usageType: SimpleObject;

    public icons = ICONS;
    // флаг наличия только одной организации
    public isOneOrganzation = false;
    // флаг наличия только одного здания
    public isOneBuilding = false;

    public selectedOrganization: SimpleObject = null;
    public selectedBuilding: SimpleObject | BuildingPoint = null;

    public viewIndex = 0;
    public parentViewIndex: number;

    constructor(
    ) { }

    ngOnInit(): void {
    }

    // выбор здания
    onSelectBuilding(evt): void {
        const {building, organization} = evt;

        this.selectedOrganization = organization;
        this.selectedBuilding = building;

        this.viewIndex = this.selectedBuilding
            ? DETAILDISPALYINDEX
            : this.parentViewIndex;
    }

    onReturn(evt: number): void {
        this.viewIndex = evt;
        this.selectedBuilding = null;
    }

    ngOnDestroy(): void {
    }
}
