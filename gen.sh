#!/bin/bash

set -e

podman run -ti --rm \
    --name site-builder \
    --workdir /run \
    --volume ./site:/run/site:ro \
    --volume ./build:/run/build:rw \
    site-builder "$@"
