FROM node:20-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

# copy from to
COPY ./ ./

RUN npm install --force
RUN npm run build

EXPOSE 7223
CMD ["npm", "start"]