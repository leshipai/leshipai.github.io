---
title: Understanding XSS — From Basics to DOM-Based Attacks
date: 2025-11-15 10:00:00
categories: Security
tags:
  - Security
  - XSS
  - Web
---

Cross-Site Scripting (XSS) remains one of the most common web vulnerabilities even in 2025. This post walks through the three main types and focuses on the subtle DOM-based variant that most scanners miss.

<!-- more -->

## Three Flavors of XSS

XSS attacks come in three varieties:

1. **Reflected XSS** — Payload is in the request and reflected in the response
2. **Stored XSS** — Payload is persisted to a database and served to other users
3. **DOM-based XSS** — Payload executes entirely client-side via unsafe DOM manipulation

## A Simple Reflected Example

```javascript
// Vulnerable: server reflects user input directly
const name = req.query.name;
res.send(`<h1>Hello, ${name}</h1>`);
```

Visiting `/?name=<script>alert(1)</script>` triggers the attack.

## DOM-Based XSS

This is where it gets interesting. The server is completely clean — the vulnerability lives in the JavaScript:

```javascript
// Vulnerable: reading from location.hash without sanitization
document.getElementById('output').innerHTML = location.hash.slice(1);
```

Visiting `/#<img src=x onerror=alert(1)>` runs code without any server involvement.

## Defense

- **Output encoding** — always encode before inserting into HTML context
- **Content Security Policy** — restrict which scripts can run
- **`textContent` over `innerHTML`** — when you don't need HTML

The browser is a powerful execution environment. Treat all user-controlled data as hostile.
