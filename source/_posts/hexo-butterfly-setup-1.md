---
title: Setting up a Hexo + Butterfly blog (1)
date: 2026-09-01 21:30:00
updated: 2026-09-02 08:00:00
categories:
  - [Blogging]
tags:
  - Butterfly
  - node-js
sticky: 1
cover: /images/avatar.png
---

Notes on standing this blog up from scratch, plus a list of the theme parts I intend to change.

<!-- more -->

## Environment

```bash
npm install -g hexo-cli
hexo init my-blog
cd my-blog
npm install
```

The theme goes into `themes/` as a git checkout so it can always be diffed against upstream:

```bash
git clone -b dev https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

## What actually matters

1. Theme settings live in the site-root `_config.butterfly.yml` and should only hold keys that differ from the defaults.
2. Custom styling goes in `source/css/custom.styl`, pulled in after the theme stylesheet via `inject.head`.
3. Custom scripts go in `source/js/custom/`, pulled in via `inject.bottom`.

> Every override should be a new file plus four or five lines of template, so an upstream upgrade only produces small conflicts.

## Next up

- [x] Dark-mode-first palette
- [x] Category chip bar on the homepage
- [ ] Links page
- [ ] Gallery page
