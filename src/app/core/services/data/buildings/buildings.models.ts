export interface BuildingIcon  {
    [key: string]: string;
}

export interface SimpleObject  {
    name: string;
    id: string;
}

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

export interface BuildingsInOrganization<T>  {
    organization: SimpleObject ;
    buildings: T[];
}
export interface BuildingsInOrganizationSet<E>  {
    items: BuildingsInOrganization<E>[];
    usageTypeId?: string;
    usageTypeName?: string;
}


export interface BuildingsGroupByOrganizations<K>  {
    [key: string]: BuildingsInOrganization<K>;
}

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
}

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



