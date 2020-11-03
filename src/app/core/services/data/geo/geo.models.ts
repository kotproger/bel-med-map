export interface GeoTree {
    id: number;
    pid: number;
    name: string;
    typeShortName: string;
    typeFullName: string;
    level: number;
    parent?: GeoTree;
    childs?: GeoTree[];
}

export interface GeoRecord {
    id: number;
    pid: number;
    name: string;
    typeShortName: string;
    typeFullName: string;
    level: number;
}
