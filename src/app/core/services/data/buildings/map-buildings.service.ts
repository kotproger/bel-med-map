import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, Subscription } from 'rxjs';
import { BuildingPoint, BuildingsSupportData } from './buildings.models';

import { BuildingsService } from './buildings.service';

import { ICONS } from '../../../../modules/map/data/mock-icons';

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
    public buildingsSupportDataSubj$ = new ReplaySubject<BuildingsSupportData>(1);
    public buildingsSupportData$: Observable<BuildingsSupportData> = this.buildingsSupportDataSubj$.asObservable();

    private buildingStyleFilter: any = null;
    private buildingsSupportData: BuildingsSupportData = null;

    constructor(
        private buildingsService: BuildingsService
    ) {
        this.handleGetMapBuildings = this.handleGetMapBuildings.bind(this);
        this.subscription = buildingsService.buildingsSubj$.subscribe(this.handleGetMapBuildings);
    }

    // обработка получения массива зданий
    public handleGetMapBuildings(buildings: BuildingPoint[]): void {

         // распределение знаний по группам
        const buildingsSupportData: BuildingsSupportData = {};

        // обработка незаполненнных типов использований
        buildings.forEach(element => {
            element.usageTypeId  =  element.usageTypeId || 'none'; // Id прочих
            element.usageTypeName  =  element.usageTypeName || 'Нет данных'; // Id прочих
        });

        // распределение зданий по типу использования
        const byusageTypeId = buildings.reduce((rezult, current) => {
            const future = new Feature(
                new Point(olProj.fromLonLat([current.lon, current.lat]))
            );
            future.setProperties({
                properties: {
                    id: current.id,
                    name: current.name,
                    organizationId: current.organizationId,
                    organizationName: current.organizationName,
                    usageTypeId: current.usageTypeId,
                    usageTypeName: current.usageTypeName
                }
            });

            if (rezult[current.usageTypeId] !== undefined){
                rezult[current.usageTypeId].push(future);

                const element = buildingsSupportData[current.usageTypeId];
                element.buildinsArr.push(current);
                element.buildinsObj[current.id] = current;
                element.featuresArr.push(future);
                element.featuresObj[current.id] = future;

            } else {
                rezult[current.usageTypeId] = [future];

                buildingsSupportData[current.usageTypeId] = {
                    usageTypeId: current.usageTypeId,
                    usageTypeName: current.usageTypeName,
                    buildinsArr: [current],
                    buildinsObj: {
                        [current.id]: current
                    },
                    featuresArr: [future],
                    featuresObj: {
                        [current.id]: future
                    },
                    layerInfo: null,
                    layerUsage: true
                };

            }
            return rezult;
        }, {});

        const vectorLayers: VectorLayer[] = [];

        // хранение кэша стилей кластеров точек
        const styleCache = {};

        for (const property of Object.keys(byusageTypeId)){

            const vectorSource = new VectorSource({
                features: byusageTypeId[property]
            });

            const clusterSource = new ClusterSource({
                distance: 30,
                source: vectorSource
            });

            const vectorLayer = new VectorLayer({
                    source: clusterSource,
                    style: feature => {
                        const features = feature.get('features');
                        const size = features.length;

                        const opacity = this.buildingStyleFilter
                            ? this.buildingStyleFilter(feature)
                                ? 1
                                : 0.2
                            : 1;

                        const imgName = property + '_' + opacity;
                        // получить или создать стиль иконки
                        if (!styleCache[imgName]) {
                            styleCache[imgName] = new Style({
                                image: new Icon({
                                    src: ICONS[property],
                                    anchor: [0.5, 0],
                                    anchorOrigin: 'bottom-left',
                                    // tslint:disable-next-line: object-literal-shorthand
                                    opacity: opacity
                                })
                            });
                        }
                        const imgStyle = styleCache[imgName];

                        // если в кластере более 1 элемента - добавить стиль подписи
                        if (size > 1) {

                            const textName = 'text' + size + opacity;

                            if (!styleCache[textName]) {
                                styleCache[textName] = new Style({
                                    text: new Text({
                                        text: size + '',
                                        scale: 1.1,
                                        offsetY: -7,
                                        stroke: new Stroke({
                                            color: 'rgba(249, 246, 224, ' + opacity + ')',
                                            width: 3
                                        }),
                                        padding: [0, -2, -2, 0],
                                        color: 'rgba(0, 0, 0, ' + opacity + ')'
                                    })
                                });
                            }
                            return [imgStyle, styleCache[textName]];

                        } else {
                            return imgStyle;
                        }
                    }
                });

            buildingsSupportData[property].layerInfo = vectorLayer;
            vectorLayer.set('name', property);
            vectorLayers.push(vectorLayer);
        }
        this.setVectorLayers(buildingsSupportData);
    }

    public getMapBuildings(): void{
        this.buildingsService.getBuildings();
    }

    public setVectorLayers(vectorLayers: BuildingsSupportData): void{
        this.buildingsSupportDataSubj$.next(vectorLayers);
        this.buildingsSupportData = vectorLayers;
    }

    // установка фильтра обновления стиля маркеров
    setBuildingStyleFilter(filter): void {
        this.buildingStyleFilter = filter;
        if (!filter){
            for (const property of Object.keys(this.buildingsSupportData)){
                const vl = this.buildingsSupportData[property];
                vl.layerInfo.changed({force: true});
            }
        }
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
