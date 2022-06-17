#!/usr/bin/env bash

echo ''
echo 'Сборка пакетов "UI" для "Client"'
echo '-------------------'

cd ./ui.packages || return

echo '[--- Kit ---]'
cd ./client-kit && npx yarn build
echo '[--- Dialog ---]'
cd ../client-dialog && npx yarn build
echo '[--- Application ---]'
cd  ../client-application && npx yarn build
echo '[--- Notifications ---]'
cd ../client-notifications && npx yarn build

echo '[--- HOC ---]'
cd ../hoc && npx yarn build

echo ''
echo 'Сборка модулей для приложения "Client"'
echo '-----------------------------------------'

cd ../../modules/client || return

echo '[--- Client main ---]'
cd  ./main && npx yarn build
echo '[--- Client product ---]'
cd  ../product && npx yarn build
echo '[--- Client order ---]'
cd  ../order && npx yarn build
echo '[--- Client order draft ---]'
cd  ../order-draft && npx yarn build
echo '[--- Client comments ---]'
cd  ../comments && npx yarn build
echo '[--- Client about ---]'
cd  ../about && npx yarn build
echo '[--- Client profile ---]'
cd  ../profile && npx yarn build
echo '[--- Client page not found ---]'
cd  ../not-found && npx yarn build

exit 0
