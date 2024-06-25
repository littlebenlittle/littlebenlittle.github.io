#!/bin/bash

case "$1" in
"new")
    git checkout -b "draft/$2"
    gen.sh new -t "$2"
esac
