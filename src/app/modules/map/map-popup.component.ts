import { Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {
    BuildingsInOrganization,
    BuildingsInOrganizationSet,
    SimpleObject,
    BuildingDetail
 } from '../../core/services/data/buildings.models';
import { ICONS } from './data/mock-icons';

@Component({
    selector: 'app-map-popup',
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPopupComponent implements OnInit {

    // @Input() organizations: BuildingsInOrganization[]|null;
    @Input()
    set organizationsSet(organizationsSet: BuildingsInOrganizationSet) {
        this.usageType = organizationsSet
        ? organizationsSet.usageType
        : null;

        this._organizations = organizationsSet
            ? organizationsSet.items
            : null;
        this.isOneOrganzation = this._organizations && this._organizations.length === 1;
        this.selectedOrganization  = this.isOneOrganzation
            ? this._organizations[0]
            : null;

        this.isOneBuilding = this.isOneOrganzation  && this._organizations[0].buildings.length === 1;
        this.selectedBuilding  = this.isOneBuilding
            ? this._organizations[0].buildings[0]
            : null;

        this.viewIndex = this.isOneBuilding
            ? 1
            : 0;
    }

    // массив организаций
    // tslint:disable-next-line: variable-name
    public _organizations: BuildingsInOrganization[]|null;
    public usageType: string;
    public icons = ICONS;
    // флаг наличия только одной организации
    public isOneOrganzation = false;
    // флаг наличия только одного здания
    public isOneBuilding = false;

    public selectedOrganization: BuildingsInOrganization = null;
    public selectedBuilding: SimpleObject = null;
    public viewIndex = 0;

    public detailOfBuilding: BuildingDetail = {
        buildingId: 1,
        buildingName: 'Холоднянский ЦОВП (СМ)',
        organizationId: 1,
        organizationName: 'ОГБУЗ «Прохоровская центральная районная больница»',
        address: 'Прохоровский район, с Холодное, ул Центральная, 7',
        yearOfConstruction: 1988,
        floors: 2,
        totalArea: 155.1,
        planCountVisits: 3,
        email: 'test@test.com',
        phone: '84724240013',
        worktime: 'Пн-Сб: 08.00 - 14.00',
        site: 'http://prohorovka-crb.belzdrav.ru/',
        eregistryUrl: 'https://new.2dr.ru/visit?region=2dr_geo_4065206&lpu=7af6dfae-6e75-46b6-9f15-3eaffd288a2e',
        usageType: 'Центры ОВП(СМ)'
    };
    constructor() { }

    ngOnInit(): void {
    }

    // выбор здания
    onSelectBuilding(organization: BuildingsInOrganization, building: SimpleObject): void {
        this.selectedOrganization = organization;
        this.selectedBuilding = this.selectedBuilding === building
            ? null
            : building;
        this.viewIndex = this.selectedBuilding
            ? 1
            : 0;
    }
}
