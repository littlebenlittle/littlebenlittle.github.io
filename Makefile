SHELL=/bin/bash
ctr=jekyll
options=-d --rm --name $(ctr) -v .:/srv/jekyll -p 4000:4000 -e JEKYLL_ROOTLESS=1
img=docker.io/jekyll/jekyll

run:
	@podman run $(options) $(img) sleep infinity

build:
	@podman exec -ti $(ctr) jekyll build

serve:
	@podman exec -ti $(ctr) jekyll serve

update:
	@podman exec -ti $(ctr) bundle update

