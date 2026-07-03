FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src/ ./src/
COPY .sequelizerc ./

EXPOSE 4000

CMD ["node", "src/server.js"]
