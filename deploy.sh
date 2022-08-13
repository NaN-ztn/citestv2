#deploy.sh

docker build --platform linux/amd64 -t citest:latest .
docker tag citest:latest citest
docker push citest