---
title: Portswigger OS injection Labs
date: 2026-10-29
categories:
  - - Web
    - RCE
tags:
  - Web
  - Portswigger
cover: /images/pv.jpg
---

Tackling the OS Command Injection Labs from Portswigger

<!-- more -->

---
## Lab: OS command injection, simple case

### Description

>This lab contains an OS command injection vulnerability in the product stock checker.
>The application executes a shell command containing user-supplied product and store IDs, and returns the raw output from the command in its response.
>To solve the lab, execute the `whoami` command to determine the name of the current user.

### Solve

Visiting the `Check Stock` functionality and inspecting the POST request:

```http
POST /product/stock HTTP/2
Host: 0aa500a204a6653485bb90c0001f0071.web-security-academy.net
Cookie: session=7MyD0aiDWIpO8kioT6rg3fNwgSuXPFNL
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: */*
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

productId=1&storeId=1
```

At first i tried injecting ` & whoami & 28` but quickly realized that adding a space or a `&` invalidates the parameters . So had to think about a different way of executing commands in linux.

There is two options : `|` a pipe or `;` a semicolon

A pipe sends the output of one command as the input of another command. So the output of the lookup is sent to the command `whoami` which , according to how it was built ignores any input stream and calls the kernel directly , looks up the name and prints it. 

So when we use pipe we only see the name of the current user

A semicolon runs commands sequentially whether the previous on succeeded or not. So in this case we will see both the name of the current user and stock amount