---
id: c190a8a4-0863-4a7e-9665-c338a49e3761
title: Building (Another) Static Site Generator
date: 2024-02-22T20:31:26.392Z
template: post.hbs
excerpt: >-
  Building a static generator is a good exercise in
  computational thinking. Subtle complexities arise
  when thinking about data that is available in the
  source, data that is available during compilation,
  and how these two interact to produce the output
  data.
---

# {{{ title }}}

> _{{{ excerpt }}}_

## What is a Static Site Generator?

At a high level, a static site generator is responsible for taking
files that are stored in some easy-to-edit format like Markdown
and turning them into full-fledged HTML files that can be served
by a webserver. This is usually done via HTML templating, where
the user writes their own HTML for things that won't change often
like the page navigation menu and footer content, but leaves
placeholders for things that are more dynamic, like the page's
text content.

The general process looks like this:

1. Gather source files
2. Compute data for ensuring correct relationships between output files
3. Generate output files 

A very simple static site generator may not need the second step,
however this would mean that the site maintainer needs to be very
careful when things change. For example if a page needs to be moved
to a new URL path, any links to that page from other pages on the
site would need to be updated.

By doing some compile-time processing, the static site generator
can take of this for you. In my generator I use UUIDs to reference
other pages and let the generator figure out what the link should
be. That way I don't have to remember every link on every page!

## First, Picking a Language

Last time I built a static site generator, I used rust simply
because I was learning the language at the time. You can check
ouf the project [here][1]. This time I decided to use TypeScript,
again for educational purposes because I was feeling a bit out of
practice with the language. 

Static site generators needs to be able to read from the file
system, compile source data like Mardown and Sass, and write
them back to the filesystem. Just about every modern programming
language has support for filesystem operations in its standard
library, so the compilation step is more important when picking
a language.

There are plenty of Rust crates for compiling [markdown][rs-md],
[sass][rs-sass], and even [handlebars][rs-hbs]. Go is another
choice, although the community go modules for markdown, sass, and
handlebars haven't been updated in a while. Premier support for
these, however, is in JavaScript, still by far the most popular
programming language in the world today.

So for me, [TypeScript][ts] was the natural choice. I needed a
refresher on the language and I knew I was going to have the most
feature-complete experience.

## Customizing the Build Process

Another thing that is beneficial about writing my own static
site generator is that I get to customize the build process
as much as I want.

For example I liketo be able to use templating
both in the source files and the HTML templates themselves.
This means that the templating engine I use ([handlebars][2])
needs to do two passes. The first pass compiles the page's
content into a valid markdown file with no more templating
placeholders. The second pass compiles the final page using
an HTML template and the generated HTML from the markdown file.

While many existing static site generators allow you to hook into
the generator's build pipeline to make customizations, writing
my own generator in code helps me feel more comfortable that I
fully understand what's happening.

## Computer Science Principles Used

Static site generators use some of the fundamental principles
of CS, namely _interpretation_ and _compilation_. A site
generator reads in data, interprets the user's intent beyond
the data that is immediately available, and compiles a result
that is something more than the original data.

## Conclusion

You can check out my new static site generator under `site-builder`
in this site's repo:
[https://github.come/littlebenlittle/littlebenlittle.github.io][3].

[1]: https://github.com/littlebenlittle/site-gen
[2]: https://handlebarsjs.com/
[3]: https://github.com/littlebenlittle/littlebenlittle.github.io
[rs-md]: https://crates.io/keywords/markdown
[rs-sass]: https://crates.io/search?q=sass
[rs-hbs]: https://crates.io/crates/handlebars
[ts]: https://www.typescriptlang.org/
