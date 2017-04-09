all:
	webpack
	sudo docker build -t jseely/photo-viewer .

ifdef PHOTO_DIR
deploy:
	sudo docker rm -f photo-viewer 2>/dev/null || true
	sudo docker run -d --restart always -p 8080:80 -v $(PHOTO_DIR):/static-assets/photos --name photo-viewer jseely/photo-viewer
else
deploy:
	sudo docker rm -f photo-viewer 2>/dev/null || true
	sudo docker run -d --restart always -p 8080:80 --name photo-viewer jseely/photo-viewer
endif
