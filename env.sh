#!/bin/bash

NODE_IMAGE=docker.io/library/node:21
CACHE_VOLUME=site-builder-cache

function mkdist {
   [ ! -d ./dist/www ] && mkdir -p -m 777 ./dist/www
}

function build-pdf {
    mkdist
    podman run -ti --rm \
        -v ./dist:/home/pptruser/dist:rw,z \
        ghcr.io/puppeteer/puppeteer \
        node dist/pdf.js "$@"
}

function install {
    podman run -ti --rm \
        --name gh.io_install \
        --workdir /run/builder \
        --volume ./builder:/run/builder:rw,z \
        "$NODE_IMAGE" \
        npm install "$@"
}

function compile {
    mkdist
    podman run -ti --rm \
        --name gh.io_compile \
        --workdir /run/builder \
        --volume ./builder:/run/builder:ro,z \
        --volume ./dist:/run/dist:rw,z \
        "$NODE_IMAGE" \
        npx tsc --outDir /run/dist/
}

function build-site {
    mkdist
    podman run -ti --rm \
        --name gh.io_build-site \
        --workdir /run \
        --volume ./builder/node_modules:/run/node_modules:ro,z \
        --volume ./dist:/run/dist:rw,z \
        --volume ./site:/run/site:ro,z \
        "$NODE_IMAGE" \
        node ./dist/site.js "$@"
}

function serve {
    podman run -ti --rm \
        --name gh.io_serve \
        --workdir /var/www \
        --volume ./dist/www:/var/www:ro,z \
        --publish 8080:8080 \
        docker.io/library/python \
        python -m http.server 8080
}

function watch {
    exec 3>&1
    while inotifywait -e modify,create -r ./site >&3; do
        build-site "$@" >&3
        echo refresh
    done | websocat -s 9001
}

# function new {
#     git checkout -b "draft/$2" || git checkout "draft/$2"
#     site-builder new -t "$2"
# }
