mkdir docker/ipfs/ipfs_data
mkdir docker/ipfs/export
docker-compose build
docker-compose up -d
docker exec ipfs_host ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec ipfs_host ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST", "OPTIONS"]'
docker-compose restart ipfs