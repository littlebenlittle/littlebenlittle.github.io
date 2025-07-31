# Ben Little's `github.io` Page

### TODOs

None right now.

### Notes

#### Frontmatter should use `>-` for string blocks

Markdown is kinda dumb and doesn't realize that

```md
_ Here is some text that is meant to be italic _
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
    blah blah blah blah blah blah blah!
---

_{{{ excerpt }}}_
```

so that no newline characters are inserted.
