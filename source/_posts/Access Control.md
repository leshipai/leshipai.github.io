---
title: Portswigger BAC Labs 1
date: 2026-10-14
categories:
  - - Writeups
tags:
  - Web
  - Portswigger
cover: /images/lain2.jpeg
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

## Lab: User ID controlled by request parameter

We have our test creds `wiener:peter` and we are supposed to obtain the API key for the user `carlos` and submit it as the solution.

After logging in , there is an api key displayed in our account page.

Now to try the first and easiest theory , changing the value of my-account query to `carlos` and replay the request:

```http
GET /my-account?id=carlos HTTP/2
Host: 0aca0060036ec9958056e4b700150053.web-security-academy.net
Cookie: session=9ovbNHPigKrY3FX2hQgrV4CSU2DFJHHp
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Referer: https://0aca0060036ec9958056e4b700150053.web-security-academy.net/login
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Priority: u=0, i
Te: trailers


```

And just like that we are in:

![](images/change_id.png)

## Lab: User ID controlled by request parameter, with unpredictable user IDs

We login using our test creds `wiener:peter` and immediately notice the url looking different from how it normally does : `https://0a9f00c404228be8827583cd00e2006e.web-security-academy.net/my-account?id=716cbeac-e93f-4678-9301-fb5783cd4c9d` 

According to the lab description we need to find carlos' GUID and replacing our own GUID with his.

Finding Carlos GUID -> Inspecting the blog and posts we notice the UserIDs of the authors are included in the post URl -> Now we just need to find carlos post ->Replace the GUID with our GUID in the account page ->Get the API key->solve the lab

![](images/guid.png)

## Lab: User ID controlled by request parameter with data leakage in redirect
### Description

>This lab contains an access control vulnerability where sensitive information is leaked in the body of a redirect response.
To solve the lab, obtain the API key for the user `carlos` and submit it as the solution.
You can log in to your own account using the following credentials: `wiener:peter`

### Solve

We login as normal using `wiener:peter` and are redirected to our account . In burp , we change the id in the query from `wiener` to `carlos`

```http
GET /my-account?id=carlos HTTP/2
Host: 0a7d00b4034d5ffa83182d3b00ad00f1.web-security-academy.net
Cookie: session=By2Ykc5lu8kCa1ZWpZp7X7qLwps2rsfJ
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8


```

Check the response , Although its  a 302 and we are are redirected to `/login`

![](images/302.png)

Checking the render side , we see that `carlos` API key is leaked in the body:

![](images/api_key.png)

Go ahead and submit the API key and solve the lab