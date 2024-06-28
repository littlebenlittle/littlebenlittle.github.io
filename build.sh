#!/bin/bash

set -e

# hack to cache apt repositories
if ! podman images | grep 'localhost/node-graphviz' >/dev/null; then
    ctr=$(buildah from docker.io/library/node:21)
    buildah run "$ctr" -- apt-get update
    buildah run "$ctr" -- apt-get install -y graphviz
    buildah commit "$ctr" localhost/node-graphviz
fi

pushd ./site-builder
    # volume mount is hack for buildah 3.x
    buildah build \
        -t site-builder \
        -v "$PWD"/node_modules:/run/node_modules:z \
        .
popd
