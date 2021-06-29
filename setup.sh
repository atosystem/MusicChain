mkdir docker/ipfs/ipfs_data
mkdir docker/ipfs/export
docker-compose build
docker-compose up -d
cd react
npm i
npm run setup
