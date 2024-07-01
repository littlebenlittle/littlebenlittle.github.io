#!/bin/bash

set -e

git checkout -b "draft/$2" || git checkout "draft/$2"
./gen.sh new -t "$2"
