import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment'; 

import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import { createXYZ } from 'ol/tilegrid';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import ClusterSource from 'ol/source/Cluster';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import * as olProj from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import {Icon, Style, Circle as CircleStyle, Stroke, Fill, Text} from 'ol/style';

import * as SampleJson from '../../../assets/json/org_list.json';

@Component({
    selector: 'app-map-component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

    private map: any;
    @ViewChild('med_map') medMapDiv: ElementRef;

    constructor() { }

    ngAfterViewInit(): void {
        // Определение проекции EPSG:3395 для карт яндекса
        proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
        register(proj4);

        const USAGE_TUPE = 'usage_type';
        const listImages = {
            'Центры ОВП(СМ)' : environment.iconUrl + 'assets/img/layers/ovp_32.png',
            'Скорая помощь' : environment.iconUrl + 'assets/img/layers/skor_32.png',
            'Стоматология' : environment.iconUrl + 'assets/img/layers/dant_32.png',
            'ФАПы' : environment.iconUrl + 'assets/img/layers/fap_32.png',
            'Поликлиники' : environment.iconUrl + 'assets/img/layers/polic_32.png',
            'Городские больницы' : environment.iconUrl + 'assets/img/layers/bolnica_32.png',
            'Специализированные' : environment.iconUrl + 'assets/img/layers/cpec_bolnica_32.png',
            'Инфекционные' : environment.iconUrl + 'assets/img/layers/infect_bolnica_32.png',
            'ЦРБ' : environment.iconUrl + 'assets/img/layers/crb_32.png',
            'АмбУчБол' : environment.iconUrl + 'assets/img/layers/ambulatoria_32.png',
            'Прочие' : environment.iconUrl + 'assets/img/layers/others_32.png'
        };

        const geoJson = SampleJson['default'];

        geoJson.forEach(element => {
            element[USAGE_TUPE]  =  element[USAGE_TUPE] || 'Прочие';
        });

        // const byUsageType = geoJson.reduce((rezult, current) => {
        //     if (rezult[current[USAGE_TUPE]] !== undefined){
        //         rezult[current[USAGE_TUPE]].push({
        //             type: 'Feature',
        //             geometry: {
        //                 type: 'Point',
        //                 coordinates: [current.lon, current.lat]
        //             },
        //             properties: current
        //           });
        //     } else {
        //         rezult[current[USAGE_TUPE]] = [{
        //             type: 'Feature',
        //             geometry: {
        //                 type: 'Point',
        //                 coordinates: [current.lon, current.lat]
        //             },
        //             properties: current
        //         }];
        //     };
        //     return rezult;
        // }, {});

        // const geoJsonLayersArrays = [];

        // for(let property in byUsageType){
        //     geoJsonLayersArrays.push(
        //         new VectorLayer({
        //             source: new VectorSource({
        //                 features: new GeoJSON({dataProjection: 'EPSG:4326', featureProjection:'EPSG:3857'}).readFeatures({
        //                     type: 'FeatureCollection',
        //                     totalFeatures: byUsageType[property].length,
        //                     features: byUsageType[property],
        //                     crs: {
        //                         type: 'name',
        //                         properties: {
        //                             name: 'EPSG:4326'
        //                         }
        //                     }
        //                 })
        //             }),
        //             style: new Style({
        //                 image: new Icon({
        //                     src: listImages[property]
        //                 })
        //             })
        //         })
        //     );
        // };


        const byUsageType = geoJson.reduce((rezult, current) => {
            const future = new Feature(
                new Point(olProj.fromLonLat([current.lon, current.lat]))
            );
            // future.setProperties({
            //     buildId: current.build_id,
            //     buildName: current.building_name,
            //     organizationId: current.organization_id,
            //     organizationName: current.organization
            // });

            if (rezult[current[USAGE_TUPE]] !== undefined){
                rezult[current[USAGE_TUPE]].push(future);
            } else {
                rezult[current[USAGE_TUPE]] = [future];
            }
            return rezult;
        }, {});

        const geoJsonLayersArrays = [];

        for(let property in byUsageType){
            
            let source = new VectorSource({
                features: byUsageType[property]
            });
              
            let clusterSource = new ClusterSource({
                distance: 30,
                source: source
            });

            geoJsonLayersArrays.push(
                new VectorLayer({
                    source: clusterSource,
                    style: feature => {
                        let size = feature.get('features').length; 
                        let styles = [new Style({
                            image: new Icon({
                                src: listImages[property],
                                anchor: [0.5, 0],
                                anchorOrigin: 'bottom-left'
                            })
                        })];
                        if (size > 1) {
                            styles.push(
                                new Style({
                                    image: new Icon({
                                        src: listImages[property],
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
                                        padding: [0,-2,-2,0]
                                    })
                                })
                            );
                        }
                        return styles;
                        
                    }
                })
            );
        };



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
                // new VectorLayer({
                //     source: new VectorSource({
                //         features: new GeoJSON({dataProjection: 'EPSG:4326', featureProjection:'EPSG:3857'}).readFeatures(geoJson)

                //     }),
                //     style: new Style({
                //         image: new Icon({
                //             src: environment.iconUrl + 'assets/cpec_bolnica_32.png',
                //         })
                //     })
                // })
            ],
            view: new View({
                center: olProj.fromLonLat([36.5763, 50.5919]),
                zoom: 8
                // projection: 'EPSG:3395'
            })
        });

        this.map.addLayer(
            new LayerGroup({
                layers: geoJsonLayersArrays
            })
        );

        console.log(SampleJson);
    }

}

