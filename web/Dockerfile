FROM node:18
WORKDIR /usr/local/share/hackrbot.hackrlabs.dev

ARG NPM_TOKEN
ARG PORT

RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/
RUN npm config set "//npm.fontawesome.com/:_authToken" ${NPM_TOKEN}

COPY ./package.json ./
RUN yarn
COPY ./ ./

EXPOSE ${PORT}

RUN yarn build
CMD ["yarn", "dev"]