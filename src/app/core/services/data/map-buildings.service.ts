import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BuildingPoint } from './buildings.models';

import { BuildingsService } from './buildings.service';

import { ICONS } from '../../../modules/map/data/mock-icons';

import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import ClusterSource from 'ol/source/Cluster';
import Feature from 'ol/Feature';
import * as olProj from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import {
    Icon,
    Style,
    Stroke,
    Text
} from 'ol/style';

@Injectable({
    providedIn: 'root'
})

// Сервис преобразования данных по строениям в структуры для отображения на карте
export class MapBuildingsService {
    private subscription: Subscription;
    public vectorLayersSubj$ = new BehaviorSubject<VectorLayer[]>([]);
    public vectorLayers$: Observable<VectorLayer[]> = this.vectorLayersSubj$.asObservable();

    constructor(
        private buildingsService: BuildingsService
    ) {
        this.handleGetMapBuildings = this.handleGetMapBuildings.bind(this);
        this.subscription = buildingsService.buildingsSubj$.subscribe(this.handleGetMapBuildings);
    }

    // обработка получения массива зданий
    public handleGetMapBuildings(buildings: BuildingPoint[]): void{
        // обработка незаполненнных типов использований
        buildings.forEach(element => {
            element.usageType  =  element.usageType || 'Прочие';
        });

        // распределение зданий по типу использования
        const byUsageType = buildings.reduce((rezult, current) => {
            const future = new Feature(
                new Point(olProj.fromLonLat([current.lon, current.lat]))
            );
            future.setProperties({
                buildingId: current.buildingId,
                buildingName: current.buildingName,
                organizationId: current.organizationId,
                organizationName: current.organizationName,
                usageType: current.usageType
            });

            if (rezult[current.usageType] !== undefined){
                rezult[current.usageType].push(future);
            } else {
                rezult[current.usageType] = [future];
            }
            return rezult;
        }, {});

        const vectorLayers: VectorLayer[] = [];

        // хранение кэша стилей кластеров точек
        const styleCache = {};

        for (const property of Object.keys(byUsageType)){

            const vectorSource = new VectorSource({
                features: byUsageType[property]
            });

            const clusterSource = new ClusterSource({
                distance: 30,
                source: vectorSource
            });

            const vectorLayer = new VectorLayer({
                    source: clusterSource,
                    style: feature => {
                        const size = feature.get('features').length;
                        const styleName = property + '_' + size;
                        const style = styleCache[styleName];

                        if (style) {
                            return style;
                        }

                        // создание иконки маркера
                        const styles = [new Style({
                            image: new Icon({
                                src: ICONS[property],
                                anchor: [0.5, 0],
                                anchorOrigin: 'bottom-left'
                            })
                        })];

                        // если в кластере более 1 элемента - добавить стиль подписи
                        if (size > 1) {
                            styles.push(
                                new Style({
                                    image: new Icon({
                                        src: ICONS[property],
                                        anchor: [0.5, 0],
                                        anchorOrigin: 'bottom-left'
                                    }),
                                    text: new Text({
                                        text: size + '',
                                        scale: 1.1,
                                        offsetY: -7,
                                        stroke: new Stroke({
                                            color: '#fafafa',
                                            width: 3
                                        }),
                                        padding: [0, -2, -2, 0]
                                    })
                                })
                            );
                        }
                        styleCache[styleName] = styles;
                        return styles;
                    }
                });
            vectorLayer.set('name', property);
            vectorLayers.push(vectorLayer);
        }
        this.setVectorLayers(vectorLayers);
    }

    public getMapBuildings(): void{
        this.buildingsService.getBuildings();
    }

    public setVectorLayers(vectorLayers: VectorLayer[]): void{
        this.vectorLayersSubj$.next(vectorLayers);
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
