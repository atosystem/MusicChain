# music-dapp
<!-- ## Setup ipfs
1. install ipfs desktop [link](https://github.com/ipfs/ipfs-desktop#install)
2. configure
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST", "OPTIONS"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
``` -->

## Setup
```
./setup.sh
```
After docker container starts running, execute the folling commands to alter IPFS settings
```
docker exec ipfs_host ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec ipfs_host ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST", "OPTIONS"]'
```
Finally restart docker container
```
docker-compose restart ipfs
```

## Clean backend database data
**Notice that you should also restart your blockchain**
```
./reset_backend.sh
```
<!-- ## Run backend & ipfs in docker
Setup (automatically start docker container)
```
./setup.sh
```
Start docker container
```
docker-compose up -d
```
Stop docker container
```
docker-compose down
```
Clear all data
```
./reset-all.sh
``` -->