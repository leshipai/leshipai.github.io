---
title: How Browsers Actually Render Web Pages
date: 2025-06-18 08:00:00
categories: Web
tags:
  - Web
  - Browser
  - Performance
---

You write HTML, CSS, and JavaScript. The browser turns it into pixels. But what happens in between? Understanding this pipeline helps you write faster, smoother web apps.

<!-- more -->

## The Rendering Pipeline

1. **Parse HTML** → builds the DOM tree
2. **Parse CSS** → builds the CSSOM tree
3. **Combine** → creates the Render Tree (only visible nodes)
4. **Layout** → calculates positions and sizes
5. **Paint** → fills in pixels per layer
6. **Composite** → layers are combined and drawn to screen

## What Triggers Each Stage

Not every change reruns the full pipeline:

| Change | Triggers |
|---|---|
| `color`, `opacity` | Paint only |
| `width`, `margin`, `font-size` | Layout + Paint |
| `transform`, `filter` | Composite only ✅ |

This is why `transform: translateX()` is preferred over `left:` for animations — it skips layout and paint entirely.

## The Main Thread vs. Compositor Thread

JavaScript runs on the **main thread**. If your JS takes too long (>16ms per frame at 60fps), frames get dropped and animations stutter.

`will-change: transform` hints to the browser to promote an element to its own compositor layer, allowing animations to run on a separate thread.

## Practical Takeaways

- Batch DOM reads before DOM writes (avoid layout thrashing)
- Use `requestAnimationFrame` for visual updates
- Prefer CSS animations over JS animations for transform/opacity
- Profile in DevTools Performance tab — don't guess
