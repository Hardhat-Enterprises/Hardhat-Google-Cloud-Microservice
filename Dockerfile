FROM node:14-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "src/app.js"]
