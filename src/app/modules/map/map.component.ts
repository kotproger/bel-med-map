import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { MapBuildingsService } from '../../core/services/data/buildings/map-buildings.service';
import {
    BuildingPoint,
    BuildingsInOrganization,
    BuildingsInOrganizationSet,
    SimpleObject,
    BuildingsSupportData,
    BuildingsSupportElement
} from '../../core/services/data/buildings/buildings.models';

import { FiilterById } from '../../core/filters/marker-filter';

import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import { createXYZ } from 'ol/tilegrid';
import {defaults as defaultControls} from 'ol/control';
import * as olProj from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

const mapZoom = 8;
const initCoords = [36.5763, 50.5919];

interface GetMapFeaturesAtPixel {
    features: BuildingsInOrganization<SimpleObject>[];
    lastFeature: any;
    usageType: SimpleObject|null;
}

@Component({
    selector: 'app-map-component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit, OnDestroy {

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private mapBuildingsService: MapBuildingsService,
    ) { }

    @ViewChild('med_map') medMapDiv: ElementRef;
    @ViewChild('tooltip') tooltipDiv: ElementRef;

    private subscription: Subscription;

    public map: any;
    public layersGroup: any;

    imgUrl = environment.iconUrl;

    mapZoomConfig: any = {
        zoom: mapZoom,
        maxZoom: 18,
        minZoom: 4
    };

    clickedItems: BuildingsInOrganizationSet<SimpleObject> = null;
    searchedItems: BuildingsInOrganization<BuildingPoint>[] = null;

    hoveredItems: BuildingsInOrganization<SimpleObject>[] = null;
    hoveredItemsPosition: any = null;

    ngAfterViewInit(): void {

        // Определение проекции EPSG:3395 для карт яндекса
        proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
        register(proj4);

        // создание карты
        this.map = new Map({
            target: this.medMapDiv.nativeElement,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'http://vec0{1-4}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        tileGrid: createXYZ({
                            extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
                        })
                    })
                })
            ],
            controls : defaultControls({
                attribution : false,
                zoom : false,
            }),
            view: new View({
                center: olProj.fromLonLat(initCoords),
                zoom: this.mapZoomConfig.zoom,
                maxZoom: 18,
                minZoom: 4
            })
        });

        // запрос зданий
        this.mapBuildingsService.getMapBuildings();

        // вывод векторных стоев на карту
        this.subscription = this.mapBuildingsService.buildingsSupportDataSubj$.subscribe((buildingsVectorLayers: BuildingsSupportData) => {
            const vectorLayers: BuildingsSupportElement[] = [];
            for (const property of Object.keys(buildingsVectorLayers)){
                vectorLayers.push(buildingsVectorLayers[property].layerInfo);
            }
            this.map.addLayer(
                this.layersGroup = new LayerGroup({
                    layers: vectorLayers
                })
            );
        });

        // получение значения приближения карты при скролле
        this.map.on('moveend', () => {
            const currZoom = this.map.getView().getZoom();
            if (currZoom !== this.mapZoomConfig.zoom){
                this.mapZoomConfig.zoom = currZoom;
                this.changeDetectorRef.detectChanges();
            }
        });

        this.map.on('click', evt => {
            const pixel = this.map.getEventPixel(evt.originalEvent);
            const rezult: GetMapFeaturesAtPixel = this.getMapFeaturesAtPixel(pixel);
            // console.log(rezult);
            this.clickedItems = {
                items: rezult.features,
                usageType: rezult.usageType
            };
            this.changeDetectorRef.detectChanges();

            // this.map.removeLayer(this.layersGroup.getLayersArray()[0]);
            // this.layersGroup.getLayers().remove(this.layersGroup.getLayersArray()[0])
        });

        // наведение курсора на элемнет.изменение указателя мышки и показ всплывающей подсказки
        let lastFeature = null;
        this.map.on('pointermove', evt => {

            // изменение курсора при наведении на маркер
            const pixel = this.map.getEventPixel(evt.originalEvent);
            const hit = this.map.hasFeatureAtPixel(pixel);
            this.map.getTarget().style.cursor = hit
                ? 'pointer'
                : '';

            const rezult: GetMapFeaturesAtPixel = this.getMapFeaturesAtPixel(pixel, lastFeature);
            this.hoveredItems = rezult.features;
            if (rezult.features){
                // показ всплывающей подсказки
                const styleTip = this.tooltipDiv.nativeElement.style;
                styleTip.top = pixel[1] + 'px';
                styleTip.left = pixel[0] + 'px';
                this.changeDetectorRef.detectChanges();
                setTimeout(() => {
                    this.tooltipDiv.nativeElement.children[0].tabIndex = 1;
                    this.tooltipDiv.nativeElement.children[0].focus();
                });
            } else if (lastFeature && !rezult.lastFeature){
                this.changeDetectorRef.detectChanges();
            }
            lastFeature  = rezult.lastFeature;
        });

    }

    // проверка доступности приближения карты
    zoomInDisabled(): boolean {
        return this.mapZoomConfig.zoom >=  this.mapZoomConfig.maxZoom;
    }

    // проверка доступности отдаления карты
    zoomOutDisabled(): boolean {
        return this.mapZoomConfig.zoom <=  this.mapZoomConfig.minZoom;
    }

    // приближение/отдаление карты
    zoomChange(value: number): void {
        let tZoom = this.mapZoomConfig.zoom + value;
        tZoom = tZoom > this.mapZoomConfig.maxZoom
            ? this.mapZoomConfig.maxZoom
            : tZoom;
        tZoom = tZoom < this.mapZoomConfig.minZoom
            ? this.mapZoomConfig.minZoom
            : tZoom;
        this.mapZoomConfig.zoom = tZoom;
        this.map.getView().setZoom(tZoom);
        this.changeDetectorRef.detectChanges();
    }

    // установка начальной позиции карты
    mapInit(): void {
        this.map.getView().animate({
            center: olProj.fromLonLat(initCoords),
            zoom: mapZoom
        });
    }

    // получить объекты под указателем курсора по координатам
    getMapFeaturesAtPixel(pixel: number[], lastFeature?: any): GetMapFeaturesAtPixel {
        // получение списка зданий, привязанных к маркеру
        const feature = this.map.forEachFeatureAtPixel(pixel, f => f);
        if (feature && (!lastFeature || lastFeature.ol_uid !== feature.ol_uid)) {
            lastFeature = feature;
            const resultFeatures = feature.get('features');
            if (resultFeatures && resultFeatures.length){

                // группировка зданий по организациям
                const prop = resultFeatures[0].getProperties().properties;
                return {features: resultFeatures
                    .map(f => f.getProperties())
                    .reduce((rezult, current) => {
                        if (rezult.flag[current.properties.organizationId]){
                            rezult.flag[current.properties.organizationId].buildings.push({
                                name: current.properties.name,
                                id: current.properties.id
                            });
                        } else {
                            rezult.flag[current.properties.organizationId] = {
                                organization: {
                                    name: current.properties.organizationName,
                                    id: current.properties.organizationId,
                                },
                                buildings: [{
                                    name: current.properties.name,
                                    id: current.properties.id
                                }]
                            };
                            rezult.rez.push(rezult.flag[current.properties.organizationId]);
                        }
                        return rezult;
                    }, {
                        rez: [],
                        flag: {}
                    }).rez,
                    lastFeature: feature,
                    usageType: {id: prop.usageTypeId, name: prop.usageTypeName}
                };
            }
        } else if (!feature){
            return {
                features: null,
                lastFeature: null,
                usageType: null
            };
        }
        return {
            features: null,
            lastFeature: feature,
            usageType: null
        };
    }

    // при получении результатов поиска
    onSearchBuildings(evt: BuildingsInOrganization<BuildingPoint>[] ): void {
        this.searchedItems = evt;

        // границы области
        let bouns = [];

        const filtredBuildings = {};

        if (this.searchedItems && this.searchedItems.length) {
            this.searchedItems.forEach(organization => {

                organization.buildings.forEach(building => {
                    // формируем фильтр
                    filtredBuildings[building.id] = true;
                    // формируем bouns
                    bouns = bouns.length
                    ? [
                        bouns[0] >  building.lon
                            ? building.lon
                            : bouns[0],
                        bouns[1] >  building.lat
                            ? building.lat
                            : bouns[1],
                        bouns[2] <  building.lon
                            ? building.lon
                            : bouns[2],
                        bouns[3] <  building.lat
                            ? building.lat
                            : bouns[3]
                    ]
                    : [
                        building.lon,
                        building.lat,
                        building.lon,
                        building.lat
                    ];
                });
            });

            if (bouns.length){
                this.mapBuildingsService.setBuildingStyleFilter(FiilterById(filtredBuildings));

                // вычисляем отступы для результатов
                const dLon = bouns[2] - bouns[0];
                const dLat = bouns[3] - bouns[1];
                let delta = dLat > dLon
                    ? dLat
                    : dLon;
                delta = delta * 0.3;

                // устанавливаем отступы
                bouns = [
                    bouns[0] - delta,
                    bouns[1] - delta,
                    bouns[2] + delta,
                    bouns[3] + delta
                ];

                bouns = [
                    ...olProj.fromLonLat([bouns[0], bouns[1]]),
                    ...olProj.fromLonLat([bouns[2], bouns[3]])
                ];
                this.map.getView().fit(bouns, { duration: 1000 });
            } else {
                this.mapBuildingsService.setBuildingStyleFilter(null);
            }

        } else {
            this.mapBuildingsService.setBuildingStyleFilter(null);
        }

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
