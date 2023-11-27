FROM node:alpine

WORKDIR /store-api
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 2020
# To run test
# CMD ["npm", "test"]

CMD ["npm", "start"]
