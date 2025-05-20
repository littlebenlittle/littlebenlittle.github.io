---
_template: blog.pug
title: Building Another Static Site Generator
description: >-
    Building on lessons learned from my previous attempt, I've built a simpler
    static site generator for my personal website.
---

In [a previous post][1], I explained how I built a static generator using Node.
The result was functional but very hacky. I chose to revisit and simplify,
identifying the core features I wanted:

1. Directory walking
2. Compilation based on file extensions
3. YAML frontmatter for page-specific configuration

The result of this new effort is a static site generator in about 100 lines of
typescript (compared to several hundred in thea tlast attempt). You can check
out the source code on my github [here][2];

[1]: 00-Building-a-Static-Site-Generator.md
[2]: https://github.com/littlebenlittle/littlebenlittle.github.io
