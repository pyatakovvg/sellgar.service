#!/usr/bin/env sh


echo '------------------------------------'
echo '|        Сборка helpers            |'
echo '------------------------------------'

cd ./helpers || return

echo ''
echo 'Пакет "Default"'
echo '------------------------------------'
cd ./utils && npx yarn build


echo '------------------------------------'
echo '|        Сборка packages            |'
echo '------------------------------------'

cd ../../packages || return 0

echo '------------------------------------'
echo 'Пакет "Errors"'
echo '------------------------------------'
cd ./errors && npx yarn build || return 0

echo '------------------------------------'
echo 'Пакет "Logger"'
echo '------------------------------------'
cd ../logger && npx yarn build || return 0

echo '------------------------------------'
echo 'Пакет "Numeral"'
echo '------------------------------------'
cd ../numeral && npx yarn build || return 0

echo '------------------------------------'
echo 'Пакет "Moment"'
echo '------------------------------------'
cd ../moment && npx yarn build || return 0

echo '------------------------------------'
echo 'Пакет "Request"'
echo '------------------------------------'
cd ../request && npx yarn build || return 0

echo '------------------------------------'
echo 'Пакет "Sharp"'
echo '------------------------------------'
cd ../sharp && npx yarn build || return 0


echo '------------------------------------'
echo '|        Сборка libraries            |'
echo '------------------------------------'

cd ../../libraries || return 0

echo '------------------------------------'
echo 'Пакет "app"'
echo '------------------------------------'
cd ./app && npx yarn build || return 0


echo '------------------------------------'
echo '|        Сборка plugins            |'
echo '------------------------------------'

cd ../../plugins || return 0

echo '------------------------------------'
echo 'Пакет "db"'
echo '------------------------------------'
cd ./db && npx yarn build || return 0

echo '------------------------------------'
echo 'Пакет "db2"'
echo '------------------------------------'
cd ../typeOrm && npx yarn build || return 0

echo '------------------------------------'
echo 'Пакет "rabbit"'
echo '------------------------------------'
cd ../rabbit && npx yarn build || return 0

echo '------------------------------------'
echo 'Пакет "rabbit"'
echo '------------------------------------'
cd ../rabbit && npx yarn build || return 0