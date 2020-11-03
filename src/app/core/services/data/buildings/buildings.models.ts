export interface BuildingIcon  {
    [key: string]: string;
}

export interface SimpleObject  {
    name: string;
    id: string;
}

export interface BuildingPoint  {
    buildingId: number;
    buildingName: string;
    organizationId: number;
    organizationName: string;
    geoId: number;
    usageType?: string;
    lon: number;
    lat: number;
}

export interface BuildingsInOrganization  {
    organization: SimpleObject;
    buildings: SimpleObject[];
}
export interface BuildingsInOrganizationSet  {
    items: BuildingsInOrganization[];
    usageType: string|null;
}


export interface BuildingsGroupByOrganizations  {
    [key: string]: BuildingsInOrganization;
}

export interface BuildingDetail {
    buildingId: number;
    buildingName: string;
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
    usageType?: string;
}

