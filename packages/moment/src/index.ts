
import moment from 'moment';
import momentTZ from 'moment-timezone';

import 'moment/locale/ru';


moment.updateLocale('ru', {
  calendar : {
    sameDay: '[сегодня, в] LT',
    nextDay: 'L, [в] LT',
    lastDay: '[вчера, в] LT',
    nextWeek: 'L, [в] LT',
    lastWeek: 'L, [в] LT',
    sameElse: 'L, [в] LT'
  }
});

moment.locale('ru');
moment.suppressDeprecationWarnings = true;

momentTZ.tz.setDefault('Europe/Moscow');
// momentTZ.updateLocale('ru', moment.localeData()._config);



export default momentTZ;
