FROM node:12.16.3-alpine

ENV APP_HOME /app
WORKDIR $APP_HOME

# copy repo files into docker
COPY . $APP_HOME

ENV PORT 8000
ENV LOCAL_DOCKER true

# IMPORTANT!: specify host
ENV HOST 0.0.0.0
EXPOSE $PORT

RUN apk add --no-cache --update git

# this command is execed after building container
CMD ["sh", "entrypoint.sh"]
