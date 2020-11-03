import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MapBuildingsService } from '../../../core/services/data/buildings/map-buildings.service';
import { Subscription } from 'rxjs';
import { VectorLayer } from 'ol/layer/Vector';
import { ICONS } from '../data/mock-icons';

interface LayerListInfo {
    layer: VectorLayer;
    name: string;
    checked: boolean;
}

@Component({
    selector: 'app-map-layers-list',
    templateUrl: './map-layers-list.component.html',
    styleUrls: ['./map-layers-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapLayersListComponent implements OnInit, OnDestroy {


    @Input() map!: any;
    @Input() layersGroup!: any;

    public layersList: LayerListInfo[];
    private subscription: Subscription;

    public icons = ICONS;

    constructor(
        private mapBuildingsService: MapBuildingsService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.subscription = this.mapBuildingsService.vectorLayersSubj$.subscribe((buildingsVectorLayers: VectorLayer[]) => {
            this.layersList = buildingsVectorLayers.map( lay => {
                return {
                    name: lay.get('name'),
                    layer: lay,
                    checked: true
                };
            });
            this.changeDetectorRef.detectChanges();
        });
    }

    // изменение z-index выбранного слоя (на передний план)
    onSelectLayer(layerInfo: LayerListInfo): void {
        if (layerInfo.checked) {
            this.layersList.forEach( element => {
                element.layer.setZIndex(element === layerInfo
                    ? 1
                    : 0);
            });
        }
    }

    // обработка видимости слоя
    onLayerCheckChange(evt: Event, layerInfo: LayerListInfo): void {
        layerInfo.checked = !layerInfo.checked;
        if (layerInfo.checked) {
            this.layersGroup.getLayers().insertAt(0, layerInfo.layer);
        } else {
            this.layersGroup.getLayers().remove(layerInfo.layer);
        }
        evt.preventDefault();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
