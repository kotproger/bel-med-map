import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import { combineLatest, Subscription, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';

import { MapBuildingsSearchService } from './map-buildings-search.service';
import { GeoTreeService } from '../../../core/services/data/geo/geo-tree.servise';
import { MapBuildingsService } from '../../../core/services/data/buildings/map-buildings.service';

import { GeoTree } from '../../../core/services/data/geo/geo.models';
import {
    BuildingsInOrganization,
    BuildingPoint
} from '../../../core/services/data/buildings/buildings.models';

// валидатор на заполнение структурой геообъекта
export function objectValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const testValue = control.value;

        return !testValue
            ? null
            : testValue.id || testValue.organization
                ? null
                : {geoObject: {value: control.value}};
    };
  }

@Component({
    selector: 'app-map-buildings-search',
    templateUrl: './map-buildings-search.component.html',
    styleUrls: ['./map-buildings-search.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapBuildingsSearchComponent implements OnInit, OnDestroy {

    @Output() searchBuildingsEvent = new EventEmitter<BuildingsInOrganization<BuildingPoint>[]>();

    // отфильтрованные значения полей ввода для автокомплита
    filteredStatesList: Observable<GeoTree[]>;
    filteredCitisList: Observable<GeoTree[]>;
    filteredOrganizationsList: Observable<BuildingsInOrganization<BuildingPoint>[]>;

    private subscriptions: Subscription[] = [];

    // контролы полей ввода
    selectedState = new FormControl({value: '', disabled: false}, [Validators.required, objectValidator()]);
    selectedCiti = new FormControl({value: '', disabled: true}, objectValidator());
    selectedOrganization = new FormControl({value: '', disabled: true}, objectValidator());

    // варианты выбора для фильтров
    listOfStates: GeoTree[] = [];
    listOfCities: GeoTree[] = [];
    listOfOrganizations: BuildingsInOrganization<BuildingPoint>[] = [];

    lastGeoObject: GeoTree;

    constructor(
        private geoTreeService: GeoTreeService,
        private mapBuildingsService: MapBuildingsService,
        private changeDetectorRef: ChangeDetectorRef,
        private mapBuildingsSearchService: MapBuildingsSearchService
    ) {
        // подписка на получение зданий и дерева геообъектов - используем геообъекты когда уже есть и массив зданий
        this.subscriptions.push(combineLatest([

            this.geoTreeService.geoTreeSubj$,
            this.mapBuildingsService.buildingsSupportDataSubj$

        ]).pipe(
            map(([geo, buildings]) => {
                return {geoTree: geo, mapBuildings: buildings};
            })
        ).subscribe(({geoTree, mapBuildings}) => {

            // this.geoTree = geoTree;
            this.listOfStates = geoTree;

            // отбор автокомплита для поля ввода районов
            this.filteredStatesList = this.selectedState.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this.filterGeo(name, this.listOfStates) : this.listOfStates.slice())
            );

            // отбор автокомплита для поля ввода городов
            this.filteredCitisList = this.selectedCiti.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this.filterGeo(name, this.listOfCities) : this.listOfCities.slice())
            );

            // отбор автокомплита для поля ввода организаций
            this.filteredOrganizationsList = this.selectedOrganization.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.organization.name),
                map(name => name ? this.filterOrganization(name, this.listOfOrganizations) : this.listOfOrganizations.slice())
            );

            // при изменении значения поля ввода районов
            this.subscriptions.push(this.selectedState.valueChanges.subscribe(state => {

                this.selectedCiti.setValue('');
                this.selectedOrganization.setValue('');

                if (this.selectedState.valid) {
                    this.listOfCities = state.childs;
                    this.selectedCiti.enable();
                    this.selectedOrganization.enable();
                } else {
                    this.listOfCities = [];
                    this.selectedCiti.disable();
                    this.selectedOrganization.disable();
                }

                this.onChengeFilters();
            }));

            // при изменении значения поля ввода городов
            this.subscriptions.push(this.selectedCiti.valueChanges.subscribe(() => {
                this.onChengeFilters();
            }));
            // при изменении значения поля ввода органзаций
            this.subscriptions.push(this.selectedOrganization.valueChanges.subscribe(organization => {
                this.showResult();
            }));

            this.changeDetectorRef.detectChanges();
        }));

        // получение результатов фильтрации по геообъекту
        this.subscriptions.push(this.mapBuildingsSearchService.filtredBildingsSubj$.subscribe( filtredBuildsByOrg => {
            this.listOfOrganizations = filtredBuildsByOrg;
            this.selectedOrganization.updateValueAndValidity();
            this.searchBuildingsEvent.emit(filtredBuildsByOrg);
        }));
    }

    ngOnInit(): void {
    }

    // формирование отображения значения геообъекта
    displayGeoFn(geo: GeoTree): string {
        return geo && geo.name
        ? geo.name + ' ' + geo.typeFullName.toLowerCase()
        : '';
    }

    displayOrgFn(org: BuildingsInOrganization<BuildingPoint>): string {
        return org && org.organization
        ? org.organization.name
        : '';
    }

    // фильтрация геообъектов по введеному названию
    private filterGeo(name: string, source: GeoTree[]): GeoTree[] {
        const filterValue = name.toLowerCase();
        return source.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    // фильтрация геообъектов по введеному названию
    private filterOrganization(name: string, source: BuildingsInOrganization<BuildingPoint>[]): BuildingsInOrganization<BuildingPoint>[] {
        const filterValue = name.toLowerCase();
        return source.filter(option => option.organization.name.toLowerCase().indexOf(filterValue) === 0);
    }

    // обработка измений фильтров
    private onChengeFilters(): void {

        const geoObject: GeoTree = this.selectedCiti.valid && this.selectedCiti.value
            ? this.selectedCiti.value
            : this.selectedState.valid && this.selectedState.value
                ? this.selectedState.value
                : null;

        // запуск фильтрации по геообъектам
        if (geoObject && geoObject !== this.lastGeoObject) {
            this.listOfOrganizations = [];
            this.selectedOrganization.setValue('');
            this.mapBuildingsSearchService.startSearch(geoObject);
        } else if (!geoObject) {
            this.searchBuildingsEvent.emit(null);
            this.listOfOrganizations = [];
        }

        this.lastGeoObject = geoObject;
    }

    // Отобразить результат поиска в зависимости от выбранной организации
    showResult(): void {
        const organization = this.selectedOrganization.value;
        this.searchBuildingsEvent.emit(
            organization && this.selectedOrganization.valid
                ? [organization]
                : [...this.listOfOrganizations]
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}
