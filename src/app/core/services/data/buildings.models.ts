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
    usageType?: string;
    lon: number;
    lat: number;
}

export interface BuildingsInOrganization  {
    organization: SimpleObject;
    buildings: SimpleObject[];
}

export interface BuildingsGroupByOrganizations  {
    [key: string]: BuildingsInOrganization;
}


