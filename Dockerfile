FROM golang:alpine
MAINTAINER Justin Seely <justin.seely@gmail.com>

RUN mkdir -p /go/src/photo-viewer
COPY ./server.go /go/src/photo-viewer/server.go

COPY ./static-assets /static-assets
COPY ./node_modules /static-assets/node_modules

WORKDIR /go/src/photo-viewer
RUN go install

ENTRYPOINT ["/go/bin/photo-viewer"]
