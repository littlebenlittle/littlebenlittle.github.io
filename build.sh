#!/bin/bash

set -e

pushd ./site-builder
    # volume mount is hack for buildah 3.x
    buildah build \
        -t site-builder \
        -v "$PWD"/node_modules:/run/node_modules:z \
        .
popd
