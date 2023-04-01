//go:build ignore

package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"

	"github.com/otiai10/copy"
)

func main() {
	var curdir, tdir string
	ldir := os.Args[1]
	ctx := context.Background()
	curdir, _ = os.Getwd()
	os.MkdirAll(ldir, 0755)

	if tmpDir, err := os.MkdirTemp("", "lisodium_build.*"); err != nil {
		panic(err)
	} else if err := os.Chdir(tmpDir); err != nil {
		panic(err)
	}
	tdir, _ = os.Getwd()

	script := fmt.Sprintf(`
git clone https://github.com/input-output-hk/libsodium.git
cd libsodium
git checkout 1.0.16-519-g66f017f1
./autogen.sh
./configure --enable-static --disable-shared
make -j%d
`, runtime.NumCPU())

	cmd := exec.CommandContext(ctx, "/bin/bash", "-c", script)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		panic(err)
	}

	if err := copy.Copy("libsodium/src/libsodium/.libs/libsodium.a",
		filepath.Join(curdir, ldir, "libsodium.a")); err != nil {
		panic(err)
	}
	if err := copy.Copy("libsodium/src/libsodium/include",
		filepath.Join(curdir, ldir, "include")); err != nil {
		panic(err)
	}

	os.Chdir(curdir)
	os.RemoveAll(tdir)
}
