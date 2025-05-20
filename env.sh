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

function mkdist {
   [ ! -d ./dist/www ] && mkdir -p -m 666 ./dist/www
}

function build-html {
    [ -z "$1" ] && echo "Need arg {cv,card}" && return
    mkdist
    podman run -ti --rm \
        --name   "gh.io_build-html-$1" \
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
    mkdist
    podman run -ti --rm \
        -v ./dist:/home/pptruser/dist:rw,Z \
        ghcr.io/puppeteer/puppeteer \
        node dist/pdf.js "$@"
}

function install {
    podman run -ti --rm \
        --name gh.io_install \
        --workdir /run/builder \
        --volume ./builder:/run/builder:Z \
        "$NODE_IMAGE" \
        npm install "$@"
}

function compile {
    mkdist
    podman run -ti --rm \
        --name gh.io_compile \
        --workdir /run/builder \
        --volume ./builder:/run/builder:ro,Z \
        --volume ./dist:/run/dist:rw,Z \
        "$NODE_IMAGE" \
        npx tsc --outDir /run/dist/
}

function build-site {
    mkdist
    podman run -ti --rm \
        --name gh.io_build-site \
        --workdir /run \
        --volume ./builder/node_modules:/run/node_modules:ro,Z \
        --volume ./dist:/run/dist:rw,Z \
        --volume ./site/pug_site:/run/site:ro,Z \
        "$NODE_IMAGE" \
        node ./dist/site.js "$@"
}

function serve {
    podman run -ti --rm \
        --name gh.io_serve \
        --workdir /var/www \
        --volume ./dist/www:/var/www:ro,Z \
        --publish 8080:8080 \
        docker.io/library/busybox \
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
