# FROM mtgupf/essentia
FROM python:3.9
WORKDIR /backend
# RUN apt-get update -y && apt-get upgrade -y
# # install node
# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
# RUN apt-get install -y nodejs
# RUN apt-get install -y npm

RUN apt-get update &&\
    apt-get -y install curl &&\
    curl -sL https://deb.nodesource.com/setup_16.x | bash - &&\
    apt-get -y install nodejs &&\
    ln -s /usr/bin/nodejs /usr/local/bin/node



COPY ["package.json", "./"]
RUN npm -v
RUN node -v
RUN npm install

COPY . .

RUN pip install -r requirements.txt

CMD [ "npm", "start" ]
