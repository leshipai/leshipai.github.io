---
title: React Hooks Deep Dive — useEffect Dependency Arrays
date: 2025-05-22 09:00:00
categories: React
tags:
  - React
  - JavaScript
  - Front-end
---

`useEffect` is the most misunderstood hook in React. Most bugs involving stale data, infinite loops, or missing updates trace back to incorrect dependency arrays.

<!-- more -->

## The Mental Model

`useEffect` is NOT a lifecycle method. It's a **synchronization mechanism**. Think of it as: "whenever these values change, run this side effect."

```jsx
useEffect(() => {
  document.title = `${count} items`;
}, [count]); // Run this effect whenever `count` changes
```

## The Three Array Cases

```jsx
// 1. No array — runs after every render
useEffect(() => { console.log('rendered'); });

// 2. Empty array — runs once on mount
useEffect(() => { fetchData(); }, []);

// 3. With deps — runs when deps change
useEffect(() => { fetchUser(userId); }, [userId]);
```

## The Stale Closure Problem

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // BUG: `count` is stale — always 0
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // Missing `count` in deps
}
```

Fix with the functional updater form:

```jsx
setCount(prev => prev + 1); // No stale closure — uses current state
```

## The Exhaustive Deps Rule

The `react-hooks/exhaustive-deps` ESLint rule exists for good reason. If your effect uses a value, that value should be in the deps array. The exceptions are:

- Stable references (from `useCallback`, `useRef`)
- React state dispatch functions
- `useReducer` dispatch

When you want to suppress the rule, ask why — the answer usually reveals a design issue.
