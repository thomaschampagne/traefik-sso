FROM node:lts-alpine AS builder
LABEL maintener="Thomas Champagne"
WORKDIR /build
COPY . .
RUN apk --no-cache update \
    && apk --no-cache upgrade
RUN echo Npm version: $(npm --version)
RUN echo Node version: $(node --version)
RUN npm install --unsafe-perm \
  && npm run build:prod

FROM node:lts-alpine AS runner
ENV DOCKER true
VOLUME /data
VOLUME /logs
RUN apk --no-cache update \
    && apk --no-cache upgrade
WORKDIR /app
COPY --from=builder /build/dist/ .
EXPOSE 3000/tcp
CMD node main.js
