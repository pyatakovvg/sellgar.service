#!/usr/bin/env bash

cd ..

echo ''
echo 'Сборка пакетов "UI" для "Provider"'
echo '-------------------'

cd ./ui.packages || return

echo '[--- Application ---]'
cd  ./application && npx yarn build
echo '[--- Kit ---]'
cd ../kit && npx yarn build


echo ''
echo 'Сборка пакетов "UI" для "Widgets"'
echo '-------------------'

cd ../../ui.widgets || return

echo '[--- Profile ---]'
cd  ./profile && npx yarn build


echo ''
echo 'Сборка пакетов "UI" для "Modules"'
echo '-------------------'

cd ../../ui.modules/provider-ui || return

echo '[--- Sign In ---]'
cd  ./sign-in && npx yarn build
echo '[--- Sign Up ---]'
cd  ../sign-up && npx yarn build
echo '[--- Sign In ---]'
cd  ../error404 && npx yarn build
echo '[--- Goods ---]'
cd  ../goods && npx yarn build

exit 0
