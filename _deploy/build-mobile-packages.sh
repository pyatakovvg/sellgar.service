#!/usr/bin/env bash

echo ''
echo 'Сборка пакетов "UI" для "Mobile"'
echo '-------------------'

cd ./ui.packages || return

echo '[--- Application ---]'
cd  ./mobile-application && npx yarn build
echo '[--- Kit ---]'
cd ../mobile-kit && npx yarn build
echo '[--- HOC ---]'
cd ../hoc && npx yarn build
echo '[--- Menu ---]'
cd ../mobile-menu && npx yarn build
echo '[--- Dialog ---]'
cd ../mobile-dialog && npx yarn build
echo '[--- Notifications ---]'
cd ../mobile-notifications && npx yarn build

echo ''
echo 'Сборка модулей для приложения "Mobile"'
echo '-----------------------------------------'

cd ../../modules/mobile || return

echo '[--- mobile products ---]'
cd  ./main && npx yarn build
echo '[--- mobile product ---]'
cd  ../product && npx yarn build
echo '[--- mobile order ---]'
cd  ../order && npx yarn build
echo '[--- mobile orders ---]'
cd  ../orders && npx yarn build
echo '[--- mobile order draft ---]'
cd  ../order-draft && npx yarn build
echo '[--- mobile about ---]'
cd  ../about && npx yarn build
echo '[--- mobile comments ---]'
cd  ../comments && npx yarn build
echo '[--- mobile settings ---]'
cd  ../options && npx yarn build
echo '[--- mobile not found ---]'
cd  ../not-found && npx yarn build

exit 0
