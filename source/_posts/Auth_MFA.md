---
title: Portswigger MFA Labs
date: 2026-10-11
categories:
  - [Web, Authentication]
tags:
  - Web
  - Portswigger
cover: /images/lain3.jpeg
---

Tackling the Multi Factor Auth Labs from Portswigger

<!-- more -->

---


>If the user is first prompted to enter a password, and then prompted to enter a verification code on a separate page, the user is effectively in a "logged in" state before they have entered the verification code. In this case, it is worth testing to see if you can directly skip to "logged-in only" pages after completing the first authentication step.Some sites don't check to see if the MFA stage was verified successfully


## Lab: 2FA simple bypass

We have 2 accounts: our account `wiener:peter` and the target account `carlos:montoya`. We begin testing on our main account for 2FA misconfigurations. On successful login we are asked for a MFA code which we can access from our email client. On inputting the MFA successfully we are redirected to `https://site.com/my-account?id=wiener` . We log out and retry the same with the target account but note we don't have access to the email account of the target. We are going to try and bypass the whole 2FA process completely. 

After successfully logging in , instead of inputting the MFA code(which we don't have) we change the url destination from `login2` to `my-account?id=carlos` and we get a successful bypass.

![](images/2FA_simple_bypass.png)

## Lab: 2FA broken logic

Once more we have our main account `wiener:peter` and our target `carlos`.

We start exploring how authentication works.

When you login successfully you are redirected to `/login2` where the MFA code is submitted. In the HTTP request there is a particular interesting header `Cookie: session=hygNWGHmJZxIe6F2A6yGUbZIawK5ppAc; verify=wiener` . 

The request that generates the MFA is the following 

```http
GET /login2 HTTP/2
Host: 0a5c008e048efaaf803599a200280015.web-security-academy.net
Cookie: session=BjHILDAtd7nyYiJQWnc7wRv3HJclMvI0; verify=wiener
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
```

Without this request the MFA code won't be generated. After Getting the code we can input it and login.

Now testing hypothesis against `carlos` :

We login normally as `wiener:peter` . Back at our proxy we send the `Get /login2` request to Repeater and change the value of `Cookie: session=hygNWGHmJZxIe6F2A6yGUbZIawK5ppAc; verify=wiener` to `Cookie: session=hygNWGHmJZxIe6F2A6yGUbZIawK5ppAc; verify=carlos` and send it.

Next we send the `POST /login2` to intruder and make sure to change `verify=wiener` to `verify=carlos` and bruteforce the MFA code. Interestingly there is no rate limit in place.

We filter using the error `Incorrect security code` . After finding the one request , replay it on your browser and the lab is successfully solved.

![](images/2FA_broken_logic.png)

