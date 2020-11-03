import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { GeoTreeService } from '../../../core/services/data/geo/geo-tree.servise';
import { MapBuildingsService } from '../../../core/services/data/buildings/map-buildings.service';
import { map } from 'rxjs/operators';
import { GeoTree } from '../../../core/services/data/geo/geo.models';

@Component({
    selector: 'app-map-buildings-search',
    templateUrl: './map-buildings-search.component.html',
    styleUrls: ['./map-buildings-search.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapBuildingsSearchComponent implements OnInit {

    public geoTree: GeoTree[];
    private subscription: Subscription;

    constructor(
        private geoTreeService: GeoTreeService,
        private mapBuildingsService: MapBuildingsService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        // подписка на получение зданий и дерева геообъектов - используем геообъекты когда уже есть и массив зданий
        this.subscription = combineLatest([
            this.geoTreeService.geoTreeSubj$,
            this.mapBuildingsService.vectorLayersSubj$
        ]).pipe(
            map(([geo, buildings]) => {
                return {geoTree: geo, mapBuildings: buildings};
            })
        ).subscribe(({geoTree, mapBuildings}) => {
            this.geoTree = geoTree;
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnInit(): void {
    }

}
