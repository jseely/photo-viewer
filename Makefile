all:
	webpack
	docker build -t jseely/photo-viewer .

ifdef PHOTO_DIR
deploy:
	docker rm -f photo-viewer 2>/dev/null || true
	docker run -d --restart always -p 0.0.0.0:8080:80 -v $(PHOTO_DIR):/photos --name photo-viewer jseely/photo-viewer
else
deploy:
	docker rm -f photo-viewer 2>/dev/null || true
	docker run -d --restart always -p 0.0.0.0:8080:80 --name photo-viewer jseely/photo-viewer
endif

deploy-prod:
	docker rm -f photo-viewer 2>/dev/null || true
	docker run -d --restart always -p 0.0.0.0:8000:80 -v /public/photos:/photos --name photo-viewer jseely/photo-viewer
