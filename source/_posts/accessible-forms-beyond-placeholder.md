---
title: Building Accessible Forms — Beyond Placeholder Text
date: 2024-10-28 10:00:00
categories: Front-end
tags:
  - Front-end
  - Accessibility
  - HTML
---

Placeholder text is not a label. This is the most common accessibility mistake in web forms, and it's entirely avoidable.

<!-- more -->

## The Placeholder Problem

```html
<!-- BAD: placeholder disappears when user types -->
<input type="email" placeholder="Enter your email">

<!-- GOOD: label is always visible -->
<label for="email">Email address</label>
<input type="email" id="email" placeholder="you@example.com">
```

Placeholders disappear the moment a user starts typing. For anyone with short-term memory issues, cognitive load, or who's filling out a long form, this is a real problem.

## The ARIA Essentials

```html
<!-- Required field -->
<label for="name">Name <span aria-hidden="true">*</span></label>
<input type="text" id="name" required aria-required="true">

<!-- Error state -->
<label for="email">Email</label>
<input 
  type="email" 
  id="email" 
  aria-describedby="email-error"
  aria-invalid="true"
>
<span id="email-error" role="alert">Please enter a valid email address</span>
```

`aria-describedby` links the input to its error message. Screen readers announce both the field label and the error.

## Focus Management

When a form submission fails:
1. Show inline errors next to each invalid field
2. Move focus to the first invalid field (or a summary at the top)
3. Don't clear valid fields — that's infuriating

```javascript
// After failed submission
const firstInvalid = document.querySelector('[aria-invalid="true"]');
firstInvalid?.focus();
```

## Testing Accessibility

- **Keyboard only**: Tab through your entire form. Can you reach and use every control?
- **Screen reader**: VoiceOver (Mac) or NVDA (Windows). Does every field announce correctly?
- **Zoom to 200%**: Does the form still work at high zoom levels?

The bar for accessible forms is low. Most sites fail it. Clearing it makes a real difference to real people.
