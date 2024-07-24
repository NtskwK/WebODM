#!/bin/bash

docker-compose down
./webodm.sh down
docker stop webapp db broker worker
docker rm webapp db broker worker