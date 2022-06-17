#!/usr/bin/env sh

cd ./packages || return 0


echo '------------------------------------'
echo 'Пакет "Errors"'
echo '------------------------------------'
cd ./errors && npx yarn build || return 0