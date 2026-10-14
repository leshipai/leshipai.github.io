---
title: Portswigger BAC Labs
date: 2026-10-14
categories:
  - - Writeups
tags:
  - Web
  - Portswigger
cover: /images/rize.jpg
---

Tackling the Access Control Labs from Portswigger

<!-- more -->

---

## Lab: Unprotected admin functionality

We don't have test credentials like we usually do. First thing we do , is check the `robots.txt` file:

![](images/robots_txt.png)

We see a path `/administrator-panel` which upon visiting it , we are able to delete the users and solve the lab: 

![](images/admin_path.png)

## Lab: Unprotected admin functionality with unpredictable URL

No test creds once again . We are supposed to look for the admin path , supposedly its unpredictable so that crosses out wordlists.

First check the view-source and search for `admin` :

![](images/view_source.png)
 
And there we have it the path `/admin-14p3mt` . Visit and delete the user to solve the lab.

![](images/solve_unpredictable_path.png)

## Lab: User role controlled by request parameter

We have test creds this time around `wiener:peter`. We know of the existence of the path `/admin`. Visiting it greets you with the error , `Admin interface only available if logged in as an administrator`

Checking the cookies available using developer tools:

![](images/here_is_the_cookie.png)

We can just change its value from `false` to `true` right in the browser and suddenly we are able to access the admin panel:

![](images/change_cookie_value.png)

Delete the user and solve the lab:

![](images/admin_cookie.png)

## Lab: User role can be modified in user profile

We have our test creds `wiener:peter` , we need to elevate our privileges to admin by updating the `roleid` to `2` and delete `carlos` account.

At first , I tried to add the `roleid` parameter to `/login` and `?my-account?id=wiener` but both were dead ends.

A nudge from a blog confirmed a hypothesis i was too naive to test. The site provides an additional functionality of updating the email address. Intercepting this request and add the `roleid` as a json object elevates our privileges:

```http
POST /my-account/change-email HTTP/2
Host: 0a5b001004f95b948182d435007c004c.web-security-academy.net
Cookie: session=znyHNSGlFyu6fkF46wJKRbclXsJB6iPY
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: */*
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: text/plain;charset=UTF-8


{"email":"wiener@weiner",
"roleid":2}
```

![](images/roleid_2.png)
