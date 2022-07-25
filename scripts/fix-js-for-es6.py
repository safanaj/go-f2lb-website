#!/usr/bin/python3

import re
import sys
parent_pkg = ''
exports = []

if __name__ == '__main__':
    data = sys.stdin.readlines()
    for i, l in enumerate(data):
        if l == "var jspb = require('google-protobuf');\n":
            data[i] = "import * as jspb from 'google-protobuf';\n"
        elif ' require(' in l:
            m = re.match(r'^var (.*) = require\((.*)\);$', l)
            if m:
                data[i] = f'import * as {m.group(1)} from {m.group(2)};\n'
        if l.startswith('goog.exportSymbol('):
            exports.append(l)
        if l.startswith("goog.object.extend(exports, "):
            parent_pkg = re.match(r'^goog.object.extend\(exports, (.*)\);$', l).group(1)
            data[i] = "\n"

    for ex in exports:
        m = re.match(f"^goog.exportSymbol\('({parent_pkg}\.(.*))', .*$", ex)
        new_l = f"export const {m.group(2).replace('.', '')} = {m.group(1)}\n"
        data.append(new_l)

    sys.stdout.write("".join(data))
    sys.stdout.write("\n")
    sys.stdout.flush()
