package webserver

import (
	"embed"
	"io/fs"
	"strings"
)

var rootFS embed.FS

var webFS fs.FS
var appFS fs.FS

const webFSPrefix = "webui/build"
const appFSPrefix = "webui/build/_app"

func SetRootFS(efs embed.FS) error {
	var err error
	rootFS = efs
	webFS, err = fs.Sub(rootFS, webFSPrefix)
	if err != nil {
		return err
	}
	appFS, err = fs.Sub(rootFS, appFSPrefix)
	return err
}
func GetRootFS() embed.FS         { return rootFS }
func GetWebFS() fs.FS             { return webFS }
func GetWebFSAsGlobFS() fs.GlobFS { return webFS.(fs.GlobFS) }
func GetPages() []string {
	pages, _ := GetWebFSAsGlobFS().Glob("*.html")
	return pages
}
func GetPagesAndPaths() ([]string, []string) {
	pages := []string{}
	paths := []string{}
	for _, p := range GetPages() {
		idx := strings.LastIndex(p, ".html")
		pages = append(pages, p)
		paths = append(paths, "/"+p[:idx])
	}
	return pages, paths
}
