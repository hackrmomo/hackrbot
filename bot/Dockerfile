FROM node:18
WORKDIR /usr/local/share/bot.hackrbot.hackrlabs.dev

ARG PORT


COPY ./package.json ./
RUN yarn
COPY ./ ./

RUN apt update
RUN apt install ffmpeg -y

EXPOSE ${PORT}

CMD ["yarn", "dev"]