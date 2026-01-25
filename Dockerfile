# ---- Build frontend ----
FROM node:latest AS frontend
WORKDIR /client
COPY ./apps/client/package*.json ./

RUN npm i

COPY ./apps/client/ .

RUN npm run build

# ---- Build Go server ----
FROM golang:latest AS backend
WORKDIR /app

COPY ./apps/backend/go.mod ./apps/backend/go.sum ./
RUN go mod download

COPY ./apps/backend .

RUN CGO_ENABLED=0 GOOS=linux go build -o /backend-exec

# ---- Final HA runtime image ----
ARG BUILD_FROM
FROM $BUILD_FROM

WORKDIR /app

ENV MODE=prod 
ENV CONFIG_PATH=/testing/config

COPY --from=backend /backend-exec /app/backend-exec

COPY ./scripts/run_without_download.sh /run_without_download.sh
COPY ./resources /app/resources

RUN chmod +x /run_without_download.sh

COPY --from=frontend /client/dist /app/client/dist
EXPOSE 8099

ENTRYPOINT ["/run_without_download.sh"]

