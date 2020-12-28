FROM node:8.9.1
WORKDIR /
COPY ./server /
RUN npm install
EXPOSE 7777
CMD [ "npm", "start" ]