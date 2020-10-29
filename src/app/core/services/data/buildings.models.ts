export interface BuildingIcon  {
    [key: string]: string;
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


