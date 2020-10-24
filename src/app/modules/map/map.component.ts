import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import * as olProj from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
// import Projection  from 'ol/proj/Projection';
import { createXYZ } from 'ol/tilegrid';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import {Icon, Style, Circle as CircleStyle, Stroke, Fill} from 'ol/style';


import * as SampleJson from '../../../assets/organizations.json';

import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

@Component({
    selector: 'app-map-component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

    private map: any;

    constructor() { }

    ngOnInit(): void {


        // Определение проекции EPSG:3395 для карт яндекса
        proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
        register(proj4);
        let geoJson = SampleJson['default'];
        this.map = new Map({
            target: 'med_map',
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'http://vec0{1-4}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        tileGrid: createXYZ({
                            extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
                        })
                    })
                }),
                new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON({dataProjection: "EPSG:4326", featureProjection:"EPSG:3857"}).readFeatures(geoJson)
                      
                    }),
                    style: new Style({
                        image: new CircleStyle({
                            radius: 10,
                            stroke: new Stroke({
                              color: '#fff',
                            }),
                            fill: new Fill({
                              color: '#3399CC',
                            }),
                        })
                    })
                })
            ],
            view: new View({
                center: olProj.fromLonLat([36.5763, 50.5919], 'EPSG:3395'),
                zoom: 10,
                //projection: 'EPSG:3395'
            })
        });

        console.log(SampleJson);
    }

}

