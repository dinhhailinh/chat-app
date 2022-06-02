FROM node:14.16.0-alpine3.13

WORKDIR /app

# install app dependencies

COPY . ./

RUN npm install

ENV REACT_APP_BASE_URL=http://localhost:5000

EXPOSE 3000

CMD ["npm", "start"]
