import { environment } from 'src/environments/environment';

import { BuildingIcon } from '../../../core/services/data/buildings/buildings.models';

export const ICONS: BuildingIcon = {
    // tslint:disable-next-line: object-literal-key-quotes Центры ОВП(СМ)
    '2935709500' : environment.iconUrl + 'assets/img/layers/ovp_32.png',
    // tslint:disable-next-line: object-literal-key-quotes Скорая помощь
    '2935731423' : environment.iconUrl + 'assets/img/layers/skor_32.png',
    // tslint:disable-next-line: object-literal-key-quotes Стоматология
    '2935732078' : environment.iconUrl + 'assets/img/layers/dant_32.png',
    // tslint:disable-next-line: object-literal-key-quotes ФАПы
    '2934829894' : environment.iconUrl + 'assets/img/layers/fap_32.png',
    // tslint:disable-next-line: object-literal-key-quotes Поликлиники
    '3093796578' : environment.iconUrl + 'assets/img/layers/polic_32.png',
    // tslint:disable-next-line: object-literal-key-quotes Городские больницы
    '3093798089' : environment.iconUrl + 'assets/img/layers/bolnica_32.png',
    // tslint:disable-next-line: object-literal-key-quotes Специализированные
    '3093801576' : environment.iconUrl + 'assets/img/layers/cpec_bolnica_32.png',
    // tslint:disable-next-line: object-literal-key-quotes Инфекционные
    '3093810002' : environment.iconUrl + 'assets/img/layers/infect_bolnica_32.png',
    // tslint:disable-next-line: object-literal-key-quotes ЦРБ
    '3093815904' : environment.iconUrl + 'assets/img/layers/crb_32.png',
    // tslint:disable-next-line: object-literal-key-quotes АмбУчБол
    '3093829971' : environment.iconUrl + 'assets/img/layers/ambulatoria_32.png',
    // tslint:disable-next-line: object-literal-key-quotes Прочие
    '3093837569': environment.iconUrl + 'assets/img/layers/others_32.png',
    // tslint:disable-next-line: object-literal-key-quotes Не заполнено
    'none': environment.iconUrl + 'assets/img/layers/none_32.png'
};
