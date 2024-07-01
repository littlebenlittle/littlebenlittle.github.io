#!/bin/bash

NODE_IMAGE=docker.io/library/node:21
CACHE_VOLUME=site-builder-cache

function build {
    ctr=$(buildah from "$NODE_IMAGE")
    buildah run "$ctr" -- apt-get update
    buildah run "$ctr" -- apt-get install -y graphviz
    buildah commit "$ctr" localhost/node-graphviz
    unset ctr
}

function compile {
    podman run -ti --rm \
        --name site-builder-compiler \
        --workdir /run/builder \
        --volume ./builder:/run/builder:ro \
        --volume "$CACHE_VOLUME:/run/cache:rw" \
        "$NODE_IMAGE" \
        npx tsc --outDir /run/cache/
}

function site-builder {
    if [ ! -d ./dist ]; then mkdir ./dist; fi
    podman run -ti --rm \
        --name site-builder \
        --workdir /run \
        --env NODE_PATH=/run/node_modules \
        --volume ./builder/node_modules:/run/node_modules:ro \
        --volume ./site:/run/site:ro \
        --volume ./dist:/run/dist:rw \
        --volume "$CACHE_VOLUME:/run/cache:ro" \
        localhost/node-graphviz node /run/cache/builder.js "$@"
}

function serve {
    podman run -ti --rm \
        --name server \
        --workdir /var/www \
        --volume ./dist:/var/www:ro \
        --publish 8080:8080 \
        docker.io/library/python \
        python -m http.server 8080
}

function watch {
    while inotifywait -e modify,create -r ./site; do
        site-builder build "$@"
    done
}

function new {
    git checkout -b "draft/$2" || git checkout "draft/$2"
    site-builder new -t "$2"
}
