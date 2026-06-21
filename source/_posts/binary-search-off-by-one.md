---
title: Binary Search — Why Off-By-One Errors Are So Common
date: 2025-04-10 10:00:00
categories: Algorithm
tags:
  - Algorithm
  - JavaScript
---

Binary search is famously simple to describe and notoriously hard to implement correctly. Let me show you the patterns that eliminate off-by-one errors for good.

<!-- more -->

## The Core Idea

Find a target in a sorted array in O(log n) time by halving the search space each step.

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
```

## Why `left + Math.floor((right - left) / 2)` and not `(left + right) / 2`?

Integer overflow. In languages with fixed-size integers (Java, C), `left + right` can overflow if both are large. The subtraction form is safe. In JavaScript this doesn't matter, but it's a good habit.

## The Template Pattern

Once you spot the pattern — two pointers converging — many "search" problems reduce to binary search:

- **First occurrence**: keep searching left after finding target (`right = mid - 1`)
- **Last occurrence**: keep searching right after finding target (`left = mid + 1`)  
- **Lower bound**: smallest index where `arr[i] >= target`
- **Upper bound**: smallest index where `arr[i] > target`

## When to Recognize It

If the problem is: "find some boundary in a monotonic function" — binary search applies. Classic examples:

- Koko Eating Bananas (LeetCode 875)
- Ship Within D Days (LeetCode 1011)
- Find Minimum in Rotated Sorted Array (LeetCode 153)

The condition doesn't have to be "is element == target". It just has to split the space into a "true" half and a "false" half.
