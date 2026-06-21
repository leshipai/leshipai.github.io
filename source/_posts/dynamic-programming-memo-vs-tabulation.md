---
title: Dynamic Programming — Memoization vs Tabulation
date: 2025-08-15 09:00:00
categories: Algorithm
tags:
  - Algorithm
  - Dynamic Programming
---

Dynamic programming (DP) is just recursion with a memory upgrade. The two main approaches — memoization and tabulation — are different ways of achieving the same goal: avoid recomputing subproblems.

<!-- more -->

## The Classic Example: Fibonacci

**Naive recursion** — O(2^n):
```javascript
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

`fib(40)` calls `fib(2)` over a million times. This is the problem DP solves.

## Memoization (Top-Down)

Cache results as you compute them:

```javascript
function fib(n, memo = {}) {
  if (n in memo) return memo[n]; // cache hit
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}
```

Starts from `n` and recurses down. Natural to write, follows the recursive structure of the problem.

## Tabulation (Bottom-Up)

Build up from base cases:

```javascript
function fib(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Space-optimized: only need last two values
function fibOptimal(n) {
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}
```

Starts from base cases and works up. No recursion stack, easier to optimize space.

## Which to Use?

| Situation | Use |
|---|---|
| Problem is naturally recursive | Memoization |
| Need optimal space | Tabulation |
| Not all subproblems are needed | Memoization |
| Simple iteration reads clearly | Tabulation |

Both give the same time complexity. The choice is usually about clarity and stack depth.
