FROM node:16
WORKDIR /usr/src/app

COPY package*.json ./
COPY *.json ./
RUN npm install -g @nestjs/cli
RUN npm install -g pnpm
RUN npm install -g cross-env
RUN npm install

COPY . .

COPY .env.development .env.development ./
COPY .env.production .env.production ./

RUN npm run build
EXPOSE 5500
CMD ["npm", "run", "start:prod"]
