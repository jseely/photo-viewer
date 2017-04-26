package main

import (
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"os"
	"path"
	"time"
)

const logMT string = "%v: %v %v request for %v to %v."
const logPt string = "%v: %v"

func logMessage(r *http.Request, message string, props map[string]string) {
	l := fmt.Sprintf(logMT, time.Now(), message, r.Method, r.URL.Path, r.RemoteAddr)
	if len(props) > 0 {
		l += " ("
		first := true
		for k, v := range props {
			if !first {
				l += " | "
			}
			first = false
			l += fmt.Sprintf(logPt, k, v)
		}
		l += ")"
	}
	log.Println(l)
}

func logError(r *http.Request, err error) {
	logMessage(r, "Failed serving", map[string]string{"Error": err.Error()})
}

func fileError(f string, e error) map[string]string {
	return map[string]string{"File": f, "Error": e.Error()}
}

func ViewAsset(w http.ResponseWriter, r *http.Request, assetPath string) {
	af := path.Join(assetPath, r.URL.Path)
	fi, err := os.Stat(af)
	if err != nil {
		w.WriteHeader(404)
		logMessage(r, "Failed serving", fileError(af, err))
		return
	}

	if !fi.Mode().IsDir() {
		w.WriteHeader(503)
		logMessage(r, "Denied serving", map[string]string{"File": af, "Error": "Attempt at VIEWing non-directory."})
		return
	}

	f, err := os.Open(af)
	defer f.Close()
	if err != nil {
		w.WriteHeader(500)
		logMessage(r, "Failed serving", fileError(af, err))
		return
	}

	dfi, err := f.Readdir(0)
	if err != nil {
		w.WriteHeader(500)
		logMessage(r, "Failed serving", fileError(af, err))
		return
	}

	w.Header().Add("Content-Type", "application/json")
	resp := "["
	for i, fi := range dfi {
		jsonObj, err := createJsonObject(af, r.URL.Path, fi)
		if err != nil {
			continue
		}
		if i == 0 {
			resp += jsonObj
		} else {
			resp += "," + jsonObj
		}
	}
	resp += "]\n\n"
	fmt.Fprint(w, resp)
	logMessage(r, "Finished serving", map[string]string{"File": af, "Response": resp})
}

func createJsonObject(dirPath, apiDirPath string, fi os.FileInfo) (string, error) {
	if fi.IsDir() {
		return fmt.Sprintf("{\"path\":\"%v\",\"isDir\":%v}", path.Join(apiDirPath, fi.Name()), fi.IsDir()), nil
	}

	width, height, err := getImageDimensions(path.Join(dirPath, fi.Name()))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("{\"path\":\"%v\",\"isDir\":%v,\"width\":%v,\"height\":%v}", path.Join(apiDirPath, fi.Name()), fi.IsDir(), width, height), nil
}

func getImageDimensions(imagePath string) (int, int, error) {
	file, err := os.Open(imagePath)
	if err != nil {
		return 0, 0, err
	}

	image, _, err := image.DecodeConfig(file)
	if err != nil {
		return 0, 0, err
	}
	return image.Width, image.Height, nil
}

func GetAsset(w http.ResponseWriter, r *http.Request, assetPath string) {
	af := path.Join(assetPath, r.URL.Path)
	fi, err := os.Stat(af)
	if err != nil {
		w.WriteHeader(404)
		logMessage(r, "Failed serving", fileError(af, err))
		return
	}

	if !fi.Mode().IsRegular() {
		w.WriteHeader(503)
		logMessage(r, "Denied serving", map[string]string{"File": af, "Error": "Attempt at GETing non-regular file."})
		return
	}

	f, err := os.Open(af)
	defer f.Close()
	if err != nil {
		w.WriteHeader(500)
		logMessage(r, "Failed to open file serving", fileError(af, err))
		return
	}

	http.ServeFile(w, r, af)
	logMessage(r, "Finished serving", map[string]string{"File": af})
}

func serveStaticAssets(w http.ResponseWriter, r *http.Request) {
	logMessage(r, "Serving", nil)

	switch r.Method {
	case "VIEW":
		ViewAsset(w, r, "/photos")
		return
	case http.MethodGet:
		if r.URL.Path == "/" || r.URL.Path == "/index.html" {
			http.ServeFile(w, r, "/static-assets/index.html")
			return
		}
		GetAsset(w, r, "/photos")
		return
	default:
		logMessage(r, "Rejected serving", map[string]string{"Reason": "Method unimplemented."})
		return
	}
}

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", http.HandlerFunc(serveStaticAssets))
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("/static-assets"))))
	mux.Handle("/node_modules/", http.StripPrefix("/node_modules/", http.FileServer(http.Dir("/node_modules"))))

	log.Println("Listening...")
	log.Fatalln(http.ListenAndServe("0.0.0.0:80", mux))
}
