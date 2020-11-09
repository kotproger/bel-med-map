import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MapBuildingsService } from '../../../core/services/data/buildings/map-buildings.service';
import { Subscription } from 'rxjs';
import { ICONS } from '../data/mock-icons';
import { MapBuildingsSearchService } from '../map-buildings-search/map-buildings-search.service';
import {
    BuildingsSupportData,
    BuildingsSupportElement
 } from '../../../core/services/data/buildings/buildings.models';

@Component({
    selector: 'app-map-layers-list',
    templateUrl: './map-layers-list.component.html',
    styleUrls: ['./map-layers-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapLayersListComponent implements OnInit, OnDestroy {


    @Input() map!: any;
    @Input() layersGroup!: any;

    public layersList: BuildingsSupportElement[];
    private subscription: Subscription;

    public icons = ICONS;

    constructor(
        private mapBuildingsService: MapBuildingsService,
        private changeDetectorRef: ChangeDetectorRef,
        private mapBuildingsSearchService: MapBuildingsSearchService
    ) { }

    ngOnInit(): void {
        this.subscription = this.mapBuildingsService.buildingsSupportDataSubj$.subscribe((buildingsVectorLayers: BuildingsSupportData) => {

            const layers: BuildingsSupportElement[] = [];
            for (const property of Object.keys(buildingsVectorLayers)){
                layers.push(buildingsVectorLayers[property]);
            }

            this.layersList = layers;
            this.changeDetectorRef.detectChanges();
        });
    }

    // изменение z-index выбранного слоя (на передний план)
    onSelectLayer(layerInfo: BuildingsSupportElement): void {

        if (layerInfo.layerUsage) {
            this.layersList.forEach( element => {
                element.layerInfo.setZIndex(element === layerInfo
                    ? 1
                    : 0);
            });
        }
    }

    // обработка видимости слоя
    onLayerCheckChange(evt: Event, layer: BuildingsSupportElement): void {

        layer.layerUsage = !layer.layerUsage;
        if (layer.layerUsage) {
            this.layersGroup.getLayers().insertAt(0, layer.layerInfo);
        } else {
            this.layersGroup.getLayers().remove(layer.layerInfo);
        }

        this.mapBuildingsSearchService.updateSearch();
        evt.preventDefault();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
