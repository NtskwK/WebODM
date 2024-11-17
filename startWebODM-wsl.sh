#!/bin/bash

docker-compose down
./webodm.sh down
./webodm.sh start --dev --gpu --media-dir ../media-webodm