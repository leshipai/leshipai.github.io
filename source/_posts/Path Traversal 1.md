---
title: Portswigger path traversal
date: 2026-10-27
categories:
  - - Web
    - Path Traversal
tags:
  - Web
  - Portswigger
cover: /images/russted.jpeg
---

Tackling the Path Traversal Labs from Portswigger

<!-- more -->

---

## Lab: File path traversal, simple case

### Description

>This lab contains a path traversal vulnerability in the display of product images.
>To solve the lab, retrieve the contents of the `/etc/passwd` file.

### Solve

Open the image of a product in a new tab and take a look at the url

![](images/2dewfw.png)

Trying to change the query parameter to `../../../etc/passwd` and viewing we get an error:

![](images/wefwf.png)

This is because the contents of `/etc/passwd` is text and the page expects an image type . Reload this page and intercept using your proxy , send it and view the response:

![](images/wete5yt5.png)

