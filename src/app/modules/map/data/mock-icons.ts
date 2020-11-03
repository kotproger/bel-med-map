import { environment } from 'src/environments/environment';

import { BuildingIcon } from '../../../core/services/data/buildings/buildings.models';

export const ICONS: BuildingIcon = {
    'Центры ОВП(СМ)' : environment.iconUrl + 'assets/img/layers/ovp_32.png',
    'Скорая помощь' : environment.iconUrl + 'assets/img/layers/skor_32.png',
    // tslint:disable-next-line: object-literal-key-quotes
    'Стоматология' : environment.iconUrl + 'assets/img/layers/dant_32.png',
    // tslint:disable-next-line: object-literal-key-quotes
    'ФАПы' : environment.iconUrl + 'assets/img/layers/fap_32.png',
    // tslint:disable-next-line: object-literal-key-quotes
    'Поликлиники' : environment.iconUrl + 'assets/img/layers/polic_32.png',
    'Городские больницы' : environment.iconUrl + 'assets/img/layers/bolnica_32.png',
    // tslint:disable-next-line: object-literal-key-quotes
    'Специализированные' : environment.iconUrl + 'assets/img/layers/cpec_bolnica_32.png',
    // tslint:disable-next-line: object-literal-key-quotes
    'Инфекционные' : environment.iconUrl + 'assets/img/layers/infect_bolnica_32.png',
    // tslint:disable-next-line: object-literal-key-quotes
    'ЦРБ' : environment.iconUrl + 'assets/img/layers/crb_32.png',
    // tslint:disable-next-line: object-literal-key-quotes
    'АмбУчБол' : environment.iconUrl + 'assets/img/layers/ambulatoria_32.png',
    // tslint:disable-next-line: object-literal-key-quotes
    'Прочие' : environment.iconUrl + 'assets/img/layers/others_32.png'
};
