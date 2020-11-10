import {BuildingsInOrganization, SimpleObject} from '../buildings/buildings.models';
// структура хранилища иконок
export interface MapToolTip {
    position: number[];
    data: BuildingsInOrganization<SimpleObject>[];
}

