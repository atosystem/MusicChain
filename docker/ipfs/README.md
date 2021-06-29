# IPFS

## Introduction
IPFS is a peer-to-peer hypermedia protocol designed to preserve and grow humanity's knowledge by making the web upgradeable, resilient, and more open.

## Features
- Distributed System:  IPFS just likes the normal Web, but it runs as a decentralized rather centralized distributed system.
- Content Addressing:
    - Hash: IPFS uses hash to ensure the uniqueness of each file.
    - No Duplication: Because there is a 1-to-1 mapping between file content and IPFS hash, you don't worry about the duplication of the file. It is suitable for storing those content that will not be modified.
- Decentralized Nature:
    - Speed: Because IPFS runs in a decentralized way, you can get content directly from your peer instead a remote server, which often increases the speed of downloading.
    - Transparent: You can get content by IPFS hash directly, which allow all users to join the community instead of being blocked by a single organization.
    - Resilient: There is no central servers. This properties prevent some degree of censorship, allowing files to sustain a way more longer life than their centralized counterparts.

## Setup
1. Run `./setup.sh` in the music-dapp folder.
```
./setup.sh
```
2. After docker container starts running, execute the folling commands to alter IPFS settings. This settings is to bypass the CORS policy to let frontend can directly talk to the backend from different origins.
```
docker exec ipfs_host ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec ipfs_host ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST", "OPTIONS"]'
```

3. Finally restart docker container. If you start the docker-compose without datached, you may need to open another terminal and change to the project directory and then run this command.
```
docker-compose restart ipfs
```

## Use Case
In our project, we use IPFS as the storage system for our audio files. It is not reasonable to upload large file on the blockchain, not only because it will cost to much gas, but also cannot be written into a block so that the transaction will fail.

After setting up the docker containers in the local, it is a relief for testing by preventing sending request to outer network.
