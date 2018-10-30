#!/bin/sh

if [ ! $1 ]; then
  exit "Give a release version number."
fi

DATE=`date +%F`
VERSION=$1
DESTINATION_DIR=dist

CLIENT_ID_DEV=800330000065-4s9jkfceicmqgsgujet454t524qbct39
CLIENT_ID_PROD=800330000065-4t2qu8mb19ahnv3gq0tmsf8o7bt2irvd
CLIENT_SECRET_DEV=usq5dT6yGdw6sjdlE65XWHp5
CLIENT_SECRET_PROD=3ZpXoZdkZfAvJWODA7TVHcm4

if [ ! -d $DESTINATION_DIR ]; then
  mkdir $DESTINATION_DIR
fi

# update version number
sed -i '' '5s/.*/  "version": "'$VERSION'",/g' manifest.json
sed -i '' "s/Unreleased/[$VERSION] - $DATE/g" CHANGELOG.md

# copy release files
cp -R _locales assets icons manifest.json $DESTINATION_DIR

# update api keys
sed -i '' "s/$CLIENT_ID_DEV/$CLIENT_ID_PROD/g" $DESTINATION_DIR/manifest.json
sed -i '' "s/$CLIENT_SECRET_DEV/$CLIENT_SECRET_PROD/g" $DESTINATION_DIR/assets/js/background.js

#remove unnecessary "key" key
sed -i '' '/key/d' $DESTINATION_DIR/manifest.json
