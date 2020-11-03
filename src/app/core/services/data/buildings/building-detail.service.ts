import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { HttpService, BackEndResponse } from '../../http';
import { BuildingDetail } from './buildings.models';

@Injectable({
  providedIn: 'root'
})

// Сервис получения списка строений для отображения на карте
export class BuildingDetailService {
    public buildingSubj$ = new BehaviorSubject<BuildingDetail>(null);
    public building$: Observable<BuildingDetail> = this.buildingSubj$.asObservable();
    constructor(
        private httpService: HttpService,
    ) {
        this.handleGetBuilding = this.handleGetBuilding.bind(this);
    }

    public getBuilding(id): void {
        this.buildingSubj$.next(null);
        this.httpService.setParam('id', id)
            .get({
                url: 'oracle/building.php',
                body: id

            })
            .pipe(
                take(1),
            )
            .subscribe(this.handleGetBuilding);
    }

    public setBuilding(building: BuildingDetail): void {
        this.buildingSubj$.next(building);
    }

    private handleGetBuilding(response: BackEndResponse<BuildingDetail>): void {
        const { success, data, message} = response;
        if (!success) {
        // error handling
        }
        this.setBuilding(data);
    }
}
