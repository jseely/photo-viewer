package main

import (
	"fmt"
	"image"
	"log"
	"net/http"
	"os"

	_ "image/jpeg"
	_ "image/png"
)

func serveImages(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	fi, err := os.Stat("/static-assets" + r.URL.Path)
	if err != nil {
		w.WriteHeader(404)
		fmt.Println("Error os.Stat(\"/static-assets\" + \""+r.URL.Path+"\"):", err.Error())
		return
	}

	switch mode := fi.Mode(); {
	case mode.IsRegular():
		http.ServeFile(w, r, "/static-assets"+r.URL.Path)
	case mode.IsDir():
		f, err := os.Open("/static-assets" + r.URL.Path)
		defer f.Close()
		if err != nil {
			w.WriteHeader(500)
			fmt.Println("Error os.Open(\"/static-assets\" + \"" + r.URL.Path + "\")")
			return
		}
		dfi, err := f.Readdir(0)
		if err != nil {
			w.WriteHeader(500)
			fmt.Println("Error f.Readdir(0)")
			return
		}
		w.Header().Add("Content-Type", "application/json")
		fmt.Fprint(w, "[")
		for i, fi := range dfi {
			if i == 0 {
				fmt.Fprint(w, createJSONObject(r.URL.Path, fi))
			} else {
				fmt.Fprint(w, ","+createJSONObject(r.URL.Path, fi))
			}
		}
		fmt.Fprint(w, "]")
	}
}

func createJSONObject(dir string, fi os.FileInfo) string {
	var src = dir + "/" + fi.Name()
	var img = dir + "/" + fi.Name()
	var height = 512
	var width = 512
	if fi.IsDir() {
		img = "/images/folder-icon.png"
	}
	file, err := os.Open("/static-assets/" + img)
	if err == nil {
		image, _, err := image.DecodeConfig(file)
		if err == nil {
			height = image.Height
			width = image.Width
		}
	}
	return fmt.Sprintf("{\"src\":\"%v\",\"img\":\"%v\",\"imgSize\":{\"width\":%v,\"height\":%v},\"isDir\":%v}", src, img, width, height, fi.IsDir())
}

func main() {
	fs := http.FileServer(http.Dir("/static-assets"))
	http.Handle("/", fs)
	http.HandleFunc("/photos/", http.HandlerFunc(serveImages))

	log.Println("Listening...")
	http.ListenAndServe("0.0.0.0:80", nil)
}
