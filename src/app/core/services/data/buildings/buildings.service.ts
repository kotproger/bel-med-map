import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { HttpService, BackEndResponse } from '../../http';
import { BuildingPoint } from './buildings.models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// Сервис получения списка строений для отображения на карте
export class BuildingsService {
    public buildingsSubj$ = new ReplaySubject<BuildingPoint[]>(1);
    public buildings$: Observable<BuildingPoint[]> = this.buildingsSubj$.asObservable();
    constructor(
        private httpService: HttpService,
    ) {
        this.handleGetBuildings = this.handleGetBuildings.bind(this);
    }

    public getBuildings(): void {
        this.httpService.get({
            url: environment.phpUrl + '/get_buildings.php',
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
