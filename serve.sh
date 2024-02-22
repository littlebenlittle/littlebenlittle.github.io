#!/bin/bash

podman run -ti --rm \
    --name server \
    --workdir /var/www \
    --volume ./build:/var/www:ro \
    --publish 8080:8080 \
    docker.io/library/python \
    python -m http.server 8080
