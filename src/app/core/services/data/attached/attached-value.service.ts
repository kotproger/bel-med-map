import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { HttpService, BackEndResponse } from '../../http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// Сервис получения списка строений для отображения на карте
export class AttachedValueService {
    // public attachedSubj$ = new Subject<Blob>();
    // public attached$: Observable<Blob> = this.attachedSubj$.asObservable();
    constructor(
        private httpService: HttpService,
    ) {
    }

    public getAttached(id): Observable<object> {
        return this.httpService.setParam('id', id)
            .get({
                url: environment.phpUrl + '/get_attached_file.php'
            })
            .pipe(
                take(1),
            );
            // .subscribe(handler);
    }
}
