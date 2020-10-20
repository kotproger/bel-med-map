import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
// import Projection  from 'ol/proj/Projection';
import { createXYZ } from 'ol/tilegrid';


@Component({
    selector: 'map-component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

    private map:any;
  
    constructor() { }

    ngOnInit(): void {

        // let projection = new Projection({
        //   code: 'EPSG:3395',
        //   extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
        // });

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
                  })
              ],
              view: new View({
                  center: olProj.fromLonLat([36.5791, 50.3907]),
                  zoom: 10
              })
        });
    }

}

