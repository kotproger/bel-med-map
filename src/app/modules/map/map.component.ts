import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { environment } from 'src/environments/environment';

import { MapBuildingsService } from './data/map-buildings.service';
import {
    BuildingsInOrganization,
    BuildingsInOrganizationSet
} from '../../core/services/data/buildings.models';

import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
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
    features: BuildingsInOrganization[];
    lastFeature: any;
    usageType: string|null;
}


@Component({
    selector: 'app-map-component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit {

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private mapBuildingsService: MapBuildingsService
    ) {}

    @ViewChild('med_map') medMapDiv: ElementRef;
    @ViewChild('tooltip') tooltipDiv: ElementRef;

    private map: any;

    imgUrl = environment.iconUrl;

    mapZoomConfig: any = {
        zoom: mapZoom,
        maxZoom: 18,
        minZoom: 4
    };

    clickedItems: BuildingsInOrganizationSet = null;
    hoveredItems: BuildingsInOrganization[] = null;
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
        this.mapBuildingsService.vectorLayersSubj$.subscribe((buildingsVectorLayers: VectorLayer[]) => {
            this.map.addLayer(
                new LayerGroup({
                    layers: buildingsVectorLayers
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

                return {features: resultFeatures
                    .map(f => f.getProperties())
                    .reduce((rezult, current) => {
                        if (rezult.flag[current.organizationId]){
                            rezult.flag[current.organizationId].buildings.push({
                                name: current.buildingName,
                                id: current.buildingId
                            });
                        } else {
                            rezult.flag[current.organizationId] = {
                                organization: {
                                    name: current.organizationName,
                                    id: current.organizationId,
                                },
                                buildings: [{
                                    name: current.buildingName,
                                    id: current.buildingId
                                }]
                            };
                            rezult.rez.push(rezult.flag[current.organizationId]);
                        }
                        return rezult;
                    }, {
                        rez: [],
                        flag: {}
                    }).rez,
                    lastFeature: feature,
                    usageType: resultFeatures[0].getProperties().usageType
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
}
