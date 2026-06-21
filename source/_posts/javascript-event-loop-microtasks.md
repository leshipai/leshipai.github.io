---
title: JavaScript Event Loop — Microtasks vs Macrotasks
date: 2025-12-05 09:00:00
categories: JavaScript
tags:
  - JavaScript
  - Browser
  - Async
---

The event loop is the engine behind JavaScript's asynchronous behavior. Most developers know it exists. Fewer know the difference between microtasks and macrotasks — and that difference matters.

<!-- more -->

## The Event Loop in One Sentence

JavaScript is single-threaded. The event loop continuously checks: "Is the call stack empty? If so, pick the next task and run it."

## Two Task Queues

**Macrotask queue** (a.k.a. task queue):
- `setTimeout`, `setInterval`
- `setImmediate` (Node.js)
- DOM events
- I/O callbacks

**Microtask queue**:
- `Promise.then`, `Promise.catch`, `Promise.finally`
- `queueMicrotask()`
- `MutationObserver`

## The Critical Rule

After every macrotask, **the entire microtask queue drains** before the next macrotask starts.

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0); // macrotask

Promise.resolve().then(() => console.log('3')); // microtask

console.log('4');

// Output: 1, 4, 3, 2
```

`3` prints before `2` even though `setTimeout(fn, 0)` was scheduled first — because microtasks always run before the next macrotask.

## Why This Matters

```javascript
// This can starve the event loop!
function recursiveMicrotask() {
  Promise.resolve().then(recursiveMicrotask);
}
recursiveMicrotask(); // Renders, setTimeout callbacks never run
```

Microtasks have higher priority. If you keep scheduling microtasks, macrotasks (including rendering) never get a chance to run.

## Practical Upshot

- Use `Promise.resolve().then()` for "run after current synchronous code but before any I/O"
- Use `setTimeout(fn, 0)` for "yield to the browser, then continue"
- Never create infinite microtask chains
