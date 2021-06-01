# music-dapp
## Setup ipfs
1. install ipfs desktop [link](https://github.com/ipfs/ipfs-desktop#install)
2. configure
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST", "OPTIONS"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
```

## Run backend & ipfs in docker
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
```