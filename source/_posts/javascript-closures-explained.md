---
title: JavaScript Closures — What They Are and Why They Matter
date: 2025-07-05 10:00:00
categories: JavaScript
tags:
  - JavaScript
  - Front-end
---

Closures are one of those JavaScript concepts that everyone uses but few can explain precisely. Let me fix that.

<!-- more -->

## The Definition

A closure is a function that **remembers the variables from the scope where it was created**, even after that scope has exited.

```javascript
function makeCounter() {
  let count = 0; // this variable is "closed over"
  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

`makeCounter` has finished executing, but `count` is still alive because the inner function holds a reference to it.

## Why This Matters

**Module pattern** — before ES modules, closures were how you created private state:

```javascript
const bank = (function() {
  let balance = 0;
  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) { balance -= amount; },
    getBalance() { return balance; }
  };
})();
```

`balance` is completely private — accessible only through the returned interface.

## The Classic Gotcha

```javascript
// Broken: all callbacks share the same `i`
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3

// Fixed: each iteration gets its own `j`
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Output: 0, 1, 2
```

`let` creates a new binding per iteration. `var` shares one binding across all.

## Memory Considerations

Closures keep referenced variables alive. In event listeners or long-lived callbacks, this can cause memory leaks if you're not careful about cleanup.
