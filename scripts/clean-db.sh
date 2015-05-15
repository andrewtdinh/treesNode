#!/bin/bash

if [ -z "$1" ] ; then
  echo "Enter a database name"
  exit 1
fi

mongoimport --jsonArray --drop --db $1 --collection users --file ../db/users.json
mongoimport --jsonArray --drop --db $1 --collection trees --file ../db/trees.json
mongoimport --jsonArray --drop --db $1 --collection lives --file ../db/lives.json
