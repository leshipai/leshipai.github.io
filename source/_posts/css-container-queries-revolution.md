---
title: CSS Container Queries — The Layout Revolution You've Been Waiting For
date: 2025-08-10 09:00:00
categories: Front-end
tags:
  - Front-end
  - CSS
  - Web
---

For years, responsive design meant media queries — responding to the viewport size. But components don't live in viewports; they live inside other components. Container queries finally give us what we actually needed.

<!-- more -->

## The Problem with Media Queries

Imagine a card component. In a sidebar it's narrow. In a main content area it's wide. With media queries, you'd have to know where the card will be placed when you write its CSS — breaking component encapsulation.

```css
/* OLD: tied to viewport, not the component's context */
@media (min-width: 768px) {
  .card { flex-direction: row; }
}
```

## Enter Container Queries

```css
/* Define which element is the container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Style the card based on its container's width */
@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

Now the card adapts to wherever it's placed — sidebar, grid, modal — without knowing where it lives.

## Browser Support

As of 2025, container queries have full support across Chrome, Firefox, Safari, and Edge. The `container-type` property is the entry point.

## What This Changes

- Components become truly self-contained
- Design systems become more composable
- Less `!important` hacks when components land in unexpected layouts

This is the biggest CSS feature for component-driven development since Flexbox.
