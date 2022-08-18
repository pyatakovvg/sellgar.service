
import numeral from 'numeral';
import 'numeral/locales/ru-ua';

numeral.locale('ru-ua');
numeral.defaultFormat('-0,0.00');

export default numeral;
