#!/bin/bash

NODE_IMAGE=docker.io/library/node:21
CACHE_VOLUME=site-builder-cache

# function build {
#     local ctr
#     ctr=$(buildah from "$NODE_IMAGE")
#     buildah run "$ctr" -- apt-get update
#     buildah run "$ctr" -- apt-get install -y graphviz
#     buildah commit "$ctr" localhost/node-graphviz
# }

function build-html {
    [ -z "$1" ] && echo "Need arg {cv,card}" && return
    [ ! -d ./dist/www ] && mkdir -p -m 666 ./dist/www
    podman run -ti --rm \
        --name   gh.io_build-html-cv \
        --volume ./dist/cv.js:/run/builder.js:ro,Z \
        --volume ./builder/node_modules:/run/node_modules:ro,Z \
        --volume ./"$1"/"$1".yaml:/run/data.yaml:ro,Z \
        --volume ./"$1"/"$1".pug:/run/tmpl.pug:ro,Z \
        --volume ./"$1"/"$1".scss:/run/style.scss:ro,Z \
        --volume ./"$1"/includes:/run/includes:ro,Z \
        --workdir /run \
        "$NODE_IMAGE" \
        node builder.js \
            --data=data.yaml \
            --tmpl=tmpl.pug \
            --style=style.scss \
    > ./dist/www/"$1".html
}

function build-pdf {
    [ ! -d ./dist/www ] && mkdir -p -m 666 ./dist/www
    podman run -ti --rm \
        -v ./dist:/home/pptruser/dist:rw,Z \
        ghcr.io/puppeteer/puppeteer \
        node dist/pdf.js "$@"
}

function install {
    podman run -ti --rm \
        --name site-builder-compiler \
        --workdir /run/builder \
        --volume ./builder:/run/builder:Z \
        "$NODE_IMAGE" \
        npm install "$@"
}

function compile {
    [ ! -d ./dist ] && mkdir -p -m 666 ./dist
    podman run -ti --rm \
        --name gh.io_compile \
        --workdir /run/builder \
        --volume ./builder:/run/builder:ro,Z \
        --volume ./dist:/run/dist:rw,Z \
        "$NODE_IMAGE" \
        npx tsc --outDir /run/dist/
}

function site-builder {
    [ ! -d ./dist/www ] && mkdir -p -m 666 ./dist/www
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
        --volume ./dist/www:/var/www:ro,Z \
        --publish 8080:8080 \
        docker.io/library/python \
        python -m http.server 8080
}

function watch {
    while inotifywait -e modify,create -r ./site; do
        site-builder build "$@"
    done
}

# function new {
#     git checkout -b "draft/$2" || git checkout "draft/$2"
#     site-builder new -t "$2"
# }
