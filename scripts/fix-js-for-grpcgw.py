#!/usr/bin/python3

import re
import sys
parent_pkg = ''
exports = []

if __name__ == '__main__':
    data = sys.stdin.readlines()
    for i, l in enumerate(data):
        if ' google_api_' in l:
            data[i] = "\n"

    sys.stdout.write("".join(data))
    sys.stdout.write("\n")
    sys.stdout.flush()
