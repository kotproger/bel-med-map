import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { HttpService, BackEndResponse } from '../http';
import { BuildingPoint } from './buildings.models';

@Injectable({
  providedIn: 'root'
})

// Сервис получения списка строений для отображения на карте
export class BuildingsService {
    public buildingsSubj$ = new BehaviorSubject<BuildingPoint[]>([]);
    public buildings$: Observable<BuildingPoint[]> = this.buildingsSubj$.asObservable();
    constructor(
        private httpService: HttpService,
    ) {
        this.handleGetBuildings = this.handleGetBuildings.bind(this);
    }

    public getBuildings(): void {
        this.httpService.get({
            url: 'oracle/buildings.php',
            body: ''
        })
        .pipe(
            take(1),
        )
        .subscribe(this.handleGetBuildings);
    }

    public setBuildings(Buildings: BuildingPoint[]): void {
        this.buildingsSubj$.next(Buildings);
    }

    private handleGetBuildings(response: BackEndResponse<BuildingPoint[]>): void {
        const { success, data, message} = response;
        if (!success) {
        // error handling
        }
        this.setBuildings(data);
    }
}
