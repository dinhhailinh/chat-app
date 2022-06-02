FROM node:14.16.0-alpine3.13
#
WORKDIR /app
#
COPY . .

RUN npm install

EXPOSE 5000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

CMD ["npm", "start"]
