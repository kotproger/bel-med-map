// структура хранилища иконок
export interface BuildingIcon  {
    [key: string]: string;
}

// минимальные данные об объекте (организация, здание....)
export interface SimpleObject  {
    name: string;
    id: string;
}

// краткая информация о здании
export interface BuildingPoint  {
    id: number;
    name: string;
    organizationId: number;
    organizationName: string;
    geoId: number;
    usageTypeId?: string;
    usageTypeName?: string;
    lon: number;
    lat: number;
}

// список зданий одной организации
export interface BuildingsInOrganization<T>  {
    organization: SimpleObject ;
    buildings: T[];
}
// список зданий в массиве организаций, сгрупперованных по типу использования
export interface BuildingsInOrganizationSet<E>  {
    items: BuildingsInOrganization<E>[];
    usageType?: SimpleObject;
}

// подробная информация о здании
export interface BuildingDetail {
    id: number;
    name: string;
    organizationId: number;
    organizationName: string;
    yearOfConstruction: number;
    floors: number;
    totalArea: number;
    planCountVisits: number;
    address: string;
    phone: string;
    email: string;
    site: string;
    eregistryUrl: string;
    worktime: string;
    usageTypeId?: string;
    usageTypeName?: string;
    lon: number;
    lat: number;
}


// вспомогательная структура - список зданий и их массив, список гео-точек и их массив, слой с гео-точками и его используемость
export interface BuildingsSupportElement {
    usageTypeId?: string;
    usageTypeName?: string;
    buildinsArr: BuildingPoint[];
    buildinsObj: {
        [key: string]: BuildingPoint;
    };
    featuresArr: any[];
    featuresObj: {
        [key: string]: any;
    };
    layerInfo: any;
    layerUsage: boolean;
}

export interface BuildingsSupportData {
    [key: string]: BuildingsSupportElement;
}



