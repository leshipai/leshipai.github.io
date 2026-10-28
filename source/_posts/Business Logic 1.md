---
title: Portswigger Business Logic Labs 1
date: 2026-10-16
categories:
  - [Web, Business Logic]
tags:
  - Web
  - Portswigger
cover: /images/lain2.jpeg
---

Tackling the Business Logic Labs from Portswigger

<!-- more -->

---

## Lab: Excessive trust in client-side controls

### Description

>This lab doesn't adequately validate user input. You can exploit a logic flaw in its purchasing workflow to buy items for an unintended price. To solve the lab, buy a "Lightweight l33t leather jacket".
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

Our goal is to buy the `$1337 L33T jacket` while our store credit being significantly less at `$100`. 

The client side flow map when buying an item goes as follows: Add to cart -> Place Order(can apply coupon) if you have one.

On the proxy side we see that when you add to cart , this request is sent:

```http
POST /cart HTTP/2
Host: 0a7200f103dc2cb9846aa4940086007b.web-security-academy.net
Cookie: session=NhfP3GtRkCrauL4TcvNllxE86souojmk
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 49

productId=1&redir=PRODUCT&quantity=1&price=133700
```

The price is included in the request and can be tampered with  . On its own ., this isn't an issue as the price should be validated server side. But still we have to test it. So we intercept this request and change the price to `$1` and send it:

![](images/price_tamper.png)

As we can see there was no validation of the same and the price is reflected on our account. We can go ahead and place the order and solve the lab.

![](images/excessive_trust.png)

## Lab: High-level logic vulnerability

### Description

>This lab doesn't adequately validate user input. You can exploit a logic flaw in its purchasing workflow to buy items for an unintended price. To solve the lab, buy a "Lightweight l33t leather jacket".
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

Inspecting the flow when buying an item:

Add to cart -> then order .

### Inspecting the requests:

#### Add to Cart

```http
POST /cart HTTP/2
Host: 0ad200fe043e739481dabb880022003c.web-security-academy.net
Cookie: session=2hkmIj8VZ80ajR7OY4CoRogu0IyPp2NP
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 36

productId=1&redir=PRODUCT&quantity=1
```

Trying to change the quantity to a decimal returns an error `"Invalid parameter: quantity"` . A dead end for now.

#### Place the Order

```http
POST /cart/checkout HTTP/2
Host: 0ad200fe043e739481dabb880022003c.web-security-academy.net
Cookie: session=2hkmIj8VZ80ajR7OY4CoRogu0IyPp2NP
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 37

csrf=f956eKpT2cXk8WyDOis4DTPx0DMcZBYX
```

There is no value we can change here.

I tried to inspect other functionalities and find anything weird . I tried to inspect the `Remove item from cart` functionality out of curiosity.

```http
POST /cart HTTP/2
Host: 0ad200fe043e739481dabb880022003c.web-security-academy.net
Cookie: session=2hkmIj8VZ80ajR7OY4CoRogu0IyPp2NP
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 34

productId=1&quantity=-1&redir=CART
```

As we can see , it seems the site accepts negative quantity amount . Very interesting. This opens a new attack technique . Hypothesis is that we can add the item we need as a negative amount and the amount we need to pay would be negative. Lets test this.There's a validation frontend so we have to intercept this request:

![](images/minus_1.png)

As we can see , the quantity is `-1` and consequently the price is `-1337` . Lets try checking out:

![](images/less_0.png)

We get this error . Seems we can't checkout with a negative total price. Also since we need to buy the jacket to solve the lab, its quantity can't be zero . 

New plan: We need to add another item with a negative quantity such that when we add the price of the jacket(1337) and the total negative amount , the total price will be < 100(our store credit). 
This is what we end up with:

![](images/minus_price.png)

We can now check out:

![](images/High_level.png)

## Lab: Inconsistent security controls

### Description

>This lab's flawed logic allows arbitrary users to access administrative functionality that should only be available to company employees. To solve the lab, access the admin panel and delete the user `carlos`.

### Solve

The site allows us to register our own test accounts. During registration there is a message :

![](images/reg.png)

We can't use the address since we don't control it.

So we create a normal user and go through the whole process and login to our account.

Trying to access the admin panel at `/admin` we see a 401 Unauthorized message:

![](images/401admin.png)

`Admin interface only available if logged in as a DontWannaCry user`

Remember what we read at the registration page , the DontWannaCry users email scheme is `user@dontwannacry.com`

Now to find a way to update our email to the same scheme.

At our account page , there is an update email functionality. Lets try that:

To my surprise it works:

![](images/panel.png)

Accessing the panel , we can delete any user:

![](images/delete_carlos.png)

## Lab: Flawed enforcement of business rules

### Description

>This lab has a logic flaw in its purchasing workflow. To solve the lab, exploit this flaw to buy a "Lightweight l33t leather jacket".
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

Logging in , we notice a coupon `NEWCUST5` . Its  a $5 cut and can only be applied once.

![](images/16.png)

I also tried race condition on the coupon but it was a dead end . So we have to look for an alternate path:

There is a `Sign up for newsletter` functionality on the homepage  , let's try signing up:

![](images/15.png)

We get a second coupon `SIGNUP30`

![](images/14.png)

Now we can try and apply both of them and take note of the behavior.

![](images/13.png)
As it turns out , applying one coupon after another , allows you to use a coupon more than once(as it was intended).

![](images/12.png)

## Lab: Low-level logic flaw

### Description

>This lab doesn't adequately validate user input. You can exploit a logic flaw in its purchasing workflow to buy items for an unintended price. To solve the lab, buy a "Lightweight l33t leather jacket".
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

I don't Know how to explain it clearly . Refer [here](https://siunam321.github.io/ctf/portswigger-labs/Business-Logic-Vulnerabilities/blv-5/)


## Lab: Inconsistent handling of exceptional input

### Description

>This lab doesn't adequately validate user input. You can exploit a logic flaw in its account registration process to gain access to administrative functionality. To solve the lab, access the admin panel and delete the user `carlos`.

### Solve

In the description , we are told that the logic flow exists in the registration flow. So that's what we'll be focusing on primarily.

The flow goes as follows: 
1. You input a username,password and an email address you own.
2. A registration link with a temporary token is sent to your email address
3. The Account is registered upon clicking said link and you can login

Trying to access `/admin` with your created account gets you an error `Admin interface only available if logged in as a DontWannaCry user` . 

Back at the registration page , there was a similar message `If you work for DontWannaCry, please use your @dontwannacry.com email address` . So it looks like the site reads the email address and looks for `@dontwannacry.com` and decides if one is admin based on that or not.

Now comes the main issue , unlike a previous lab , there was no functionality to change our email address to `dontwannacry` email. We have to look for an alternative method.

I hit a dead end and had no sight of what to do. So i got a [nudge](https://siunam321.github.io/ctf/portswigger-labs/Business-Logic-Vulnerabilities/blv-6/)  . Turns out the exceptional input(from the lab title) means an abnormally long email address.

Another important thing is that the email client allows `Displaying all emails @exploit-0a0c00740377916584459987012b00f7.exploit-server.net and all subdomains` . That means we can append `@dontwannacry.com` and it will be treated as a subdomain of the email client address.

Finding the perfect length was trial and error and I ended up with this as a perfect match , such that the email address showcased under my account ended cleanly in `@dontwannacry.com` 

Email = `carlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlitocarlit@dontwannacry.com.exploit-0a6800ba046fe3f88007576b01e20030.exploit-server.net`

Now lets try registering.

![](images/33.png)

And we are Admin as well:

![](images/44.png)

Lets delete carlos:

![](images/55.png)