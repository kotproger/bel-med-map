import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { HttpService, BackEndResponse } from '../../http';
import { GeoRecord, GeoTree } from './geo.models';

@Injectable({
  providedIn: 'root'
})

// Сервис получения списка строений для отображения на карте
export class GeoTreeService {
    public geoTreeSubj$ = new ReplaySubject<GeoTree[]>(1);
    public geoTree$: Observable<GeoTree[]> = this.geoTreeSubj$.asObservable();

    constructor(
        private httpService: HttpService,
    ) {
        this.handleGetGeoTree = this.handleGetGeoTree.bind(this);
        this.getGeoTree();
    }

    public getGeoTree(): void {
        this.geoTreeSubj$.next(null);
        this.httpService.get({
                url: 'oracle/geo-tree.php'
            })
            .pipe(
                take(1),
            )
            .subscribe(this.handleGetGeoTree);
    }

    public setGeoTree(geoTree: GeoTree[]): void {
        this.geoTreeSubj$.next(geoTree);
    }

    private handleGetGeoTree(response: BackEndResponse<GeoRecord[]>): void {
        const { success, data, message} = response;
        if (!success) {
        // error handling
        }
        const tree: GeoTree[] = [];
        const levels: GeoTree[] = [];
        let lastElement: GeoTree = null;

        // преобразуем плоскую структуру дерева
        data.forEach((record, index) => {

            const currentElement: GeoTree = {
                id: record.id,
                pid: record.pid,
                name: record.name,
                level: record.level,
                typeFullName: record.typeFullName,
                typeShortName: record.typeShortName
            };

            let position = levels.length - 1;
            if (index) {
                const lastReciord = data[index - 1];

            // текущий элемент - дочерний к предыдущему
                if (record.level > lastReciord.level) {
                    currentElement.parent = lastElement;
                    lastElement.childs = [currentElement];
                    levels.push(lastElement);

                // текущий того же порядка, что и предыдущий
                } else if (record.level === lastReciord.level) {
                    currentElement.parent = levels[position];
                    levels[position].childs.push(currentElement);

                // окончание вложенности
                } else if (record.level < lastReciord.level) {
                    levels.splice(position - lastReciord.level + record.level + 1);
                    position = levels.length - 1;

                    if (position >= 0){
                        currentElement.parent = levels[position];
                        levels[position].childs.push(currentElement);
                    } else {
                        tree.push(currentElement);
                    }
                }

            // первый элемент
            } else {
                tree.push(currentElement);
            }
            lastElement = currentElement;
        });
        this.setGeoTree(tree);
    }
}
