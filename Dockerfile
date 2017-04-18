FROM golang:alpine
MAINTAINER Justin Seely <justin.seely@gmail.com>

RUN mkdir -p /go/src/photo-viewer
COPY ./server.go /go/src/photo-viewer/server.go

WORKDIR /go/src/photo-viewer
RUN go install

RUN mkdir /node_modules
COPY ./node_modules/lightbox2/dist /node_modules/lightbox2/dist
COPY ./node_modules/react/dist /node_modules/react/dist
COPY ./node_modules/react-dom/dist /node_modules/react-dom/dist
COPY ./static-assets /static-assets

ENTRYPOINT ["/go/bin/photo-viewer"]
