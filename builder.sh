#!/usr/bin/env sh


echo '------------------------------------'
echo '|        Сборка helpers            |'
echo '------------------------------------'

cd ./helpers || return

echo '------------------------------------'
echo 'Пакет "Utils"'
echo '------------------------------------'
cd ./utils && npm run build


echo '------------------------------------'
echo '|        Сборка packages            |'
echo '------------------------------------'

cd ../../packages || return 0

echo '------------------------------------'
echo 'Пакет "Errors"'
echo '------------------------------------'
cd ./errors && npm run build || return 0

echo '------------------------------------'
echo 'Пакет "Logger"'
echo '------------------------------------'
cd ../logger && npm run build || return 0

echo '------------------------------------'
echo 'Пакет "Numeral"'
echo '------------------------------------'
cd ../numeral && npm run build || return 0

echo '------------------------------------'
echo 'Пакет "Moment"'
echo '------------------------------------'
cd ../moment && npm run build || return 0

echo '------------------------------------'
echo 'Пакет "Request"'
echo '------------------------------------'
cd ../request && npm run build || return 0

echo '------------------------------------'
echo 'Пакет "Sharp"'
echo '------------------------------------'
cd ../sharp && npm run build || return 0


echo '------------------------------------'
echo '|        Сборка libraries            |'
echo '------------------------------------'

cd ../../libraries || return 0

echo '------------------------------------'
echo 'Пакет "app"'
echo '------------------------------------'
cd ./app && npm run build || return 0


echo '------------------------------------'
echo '|        Сборка plugins            |'
echo '------------------------------------'

cd ../../plugins || return 0

echo '------------------------------------'
echo 'Пакет "db"'
echo '------------------------------------'
cd ./db && npm run build || return 0

echo '------------------------------------'
echo 'Пакет "db2"'
echo '------------------------------------'
cd ../typeOrm && npm run build || return 0

echo '------------------------------------'
echo 'Пакет "rabbit"'
echo '------------------------------------'
cd ../rabbit && npm run build || return 0

echo '------------------------------------'
echo 'Пакет "rabbit"'
echo '------------------------------------'
cd ../rabbit && npm run build || return 0