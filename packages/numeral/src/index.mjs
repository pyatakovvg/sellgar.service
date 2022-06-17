
import numeral from 'numeral';


numeral.register('locale', 'ru-2', {
  delimiters: {
    thousands: ' ',
    decimal: ','
  },
});

numeral.locale('ru-2');
numeral.defaultFormat('0,0');


export default numeral;
