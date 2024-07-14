docker stop db webapp broker worker  
docker rm db webapp broker worker  
./webodm.sh down
rm -r app/static/app/bundles
./webodm.sh start --dev --media-dir ../media-webodm