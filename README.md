# Ben Little's `github.io` Page

### TODOs

- [ ] "show code" for larger blocks
- [ ] add md extension to compile graphs
- [ ] add md extension to compile math
- [x] use `markdown-it` plugin for highlightjs
- [ ] refactor project structure
- [x] add "hire me" CTA beneath hero on home page
- [ ] add smarter canonical links to builder
- [ ] group posts in directories
- [x] fix overflow on `pre` blocks
- [x] blog post url paths should be uuids
- [ ] content warning on posts with sensitive content
- [x] put name in site header
- [ ] spell checking in the build
- [ ] `{{#aside}}` helper
- [ ] pagination for blog posts
- [ ] implement tag system for resolving uuids
- [ ] filter posts by tag
- [ ] (_maybe_) implement in-browser post editor
- [ ] (_maybe_) syndication handlers in ci
- [ ] fix padding and bg color around code blocks
- [ ] (_maybe_) Mega-Markdown Monstrocity, aka mmmmmmmmm _microwave_
- [ ] `target=_blank` for external links in markdown
- [ ] (_maybe_) a `{{ tootit }}` in-line helper that toots excerpts from posts
- [ ] spellcheck, or at least unique word finder

### Notes

#### Frontmatter should use `>-` for string blocks

Markdown is kinda dumb and doesn't realize that

```md
_
Here is some text
that is meant to
be italic
_
```

shold be italicized. So when

```md
---
excerpt: |
  blah blah
  blah blah
  blah blah blah!
---

_{{{ excerpt }}}_
```

is rendered, you won't get italicized text. Instead use

```md
---
excerpt: >-
  blah blah
  blah blah
  blah blah blah!
---

_{{{ excerpt }}}_
```

so that no newline characters are inserted.
