#!/bin/bash

function watch_site {
    while inotifywait -r -e modify,create ./site
        do ./gen.sh build --local ./site ./build
    done
}

function watch_builder {
    while inotifywait -e modify,create ./site-builder/builder.ts
        do ./build.sh
    done
}

watch_builder&
watch_site
