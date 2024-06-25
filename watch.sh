#!/bin/bash

while inotifywait -r -e modify,create ./site
    do ./gen.sh build ./site ./build
done
