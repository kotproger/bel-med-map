import { Injectable } from '@angular/core';
import { combineLatest, Subscription, Observable, ReplaySubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { MapBuildingsService } from '../../../core/services/data/buildings/map-buildings.service';
import { GeoTreeService } from '../../../core/services/data/geo/geo-tree.servise';

import { GeoTree } from '../../../core/services/data/geo/geo.models';
import { BuildingsSupportData, BuildingsInOrganization, BuildingPoint } from '../../../core/services/data/buildings/buildings.models';


@Injectable({
  providedIn: 'root'
})

// Сервис фильтрации зданий по геообъектам
export class MapBuildingsSearchService {

    private geoTree: GeoTree[];
    private buildingsSupportData: BuildingsSupportData;

    public filtredBildingsSubj$ = new ReplaySubject<BuildingsInOrganization<BuildingPoint>[]>(1);
    public filtredBildings$: Observable<BuildingsInOrganization<BuildingPoint>[]> = this.filtredBildingsSubj$.asObservable();

    private subscriptions: Subscription[] = [];

    constructor(
        private mapBuildingsService: MapBuildingsService,
        private geoTreeService: GeoTreeService
    ) {

        this.subscriptions.push(combineLatest([

            this.geoTreeService.geoTreeSubj$,
            this.mapBuildingsService.buildingsSupportDataSubj$

        ]).pipe(
            map(([geo, buildings]) => {
                return {geoTree: geo, buildingsInfo: buildings};
            })
        ).subscribe(({geoTree, buildingsInfo}) => {

            this.geoTree = geoTree;
            this.buildingsSupportData = buildingsInfo;

        }));
    }

    // формирование перечня id всех дочерних (листьев) геообъектов от текущего
    private getGeoObjectFilter(geoObject: GeoTree): any {
        const result = {};
        const f = (element: GeoTree) => {
            if (element.childs) {
                element.childs.forEach( el => {
                    f(el);
                });
            } else {
                result[element.id] = true;
            }
        };
        f(geoObject);
        return result;
    }

    // фильтрация зданий по принадлежности геообъектам
    private filterBuildinsToArray(filterObj): BuildingPoint[] {

        const resultBuildings: BuildingPoint[] = [];
        const source = this.buildingsSupportData;

        for (const property of Object.keys(source)){
            if (source[property].layerUsage) {
                const searchArr = source[property].buildinsArr;
                source[property].buildinsArr.map((value) => {
                    if (filterObj[value.geoId]) {
                        resultBuildings.push(value);
                    }
                });
            }
        }

        return resultBuildings;
    }

    // преобразование массива зданий в массив группировки по зданиям
    private buildinsArrayToGroups(buildings: BuildingPoint[]): BuildingsInOrganization<BuildingPoint>[] {
        return buildings.reduce((rezult, current) => {

            if (rezult.flag[current.organizationId]){
                rezult.flag[current.organizationId].buildings.push({
                    name: current.name,
                    id: current.id,
                    usageTypeId: current.usageTypeId,
                    usageTypeName: current.usageTypeName
                });

            } else {
                rezult.flag[current.organizationId] = {
                    organization: {
                        name: current.organizationName,
                        id: current.organizationId,
                    },
                    buildings: [{
                        name: current.name,
                        id: current.id,
                        usageTypeId: current.usageTypeId,
                        usageTypeName: current.usageTypeName
                    }]
                };

                rezult.rez.push(rezult.flag[current.organizationId]);
            }
            return rezult;
        }, {
            rez: [],
            flag: {}
        }).rez;
    }

    // поиск среди зданий
    startSearch(geoObject: GeoTree): void {

        const geoObjectsFilter = this.getGeoObjectFilter(geoObject);

        const resultBuildings = this.filterBuildinsToArray(geoObjectsFilter);

        this.filtredBildingsSubj$.next(this.buildinsArrayToGroups(resultBuildings));

    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy(): void {
        this.subscriptions.forEach( subscription =>
            subscription.unsubscribe()
        );
    }
}
