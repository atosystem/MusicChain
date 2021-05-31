FROM mtgupf/essentia
RUN apt-get update -y && apt-get upgrade -y
# install node
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

WORKDIR /backend

COPY ["package.json", "./"]

RUN npm install
