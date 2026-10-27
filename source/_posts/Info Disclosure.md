---
title: Portswigger Info Disclosure Labs
date: 2026-10-27
categories:
  - - Writeups
tags:
  - Web
  - Portswigger
cover: /images/lain6.jpeg
---

Tackling more  Information Disclosure Labs from Portswigger

<!-- more -->

---

## Lab: Information disclosure in error messages

### Description

>This lab's verbose error messages reveal that it is using a vulnerable version of a third-party framework. To solve the lab, obtain and submit the version number of this framework.

### Solve

Trying to trigger an error `https://0a1e0056038d47e0800d30fc00a90093.web-security-academy.net/product?productId=1'`  by adding an apostrophe to the query param

Get the verbose error and submit the version to solve the lab.

## Lab: Information disclosure on debug page

### Description

>This lab contains a debug page that discloses sensitive information about the application. To solve the lab, obtain and submit the `SECRET_KEY` environment variable.

### Solve

Trying to find the debug page by viewing the pages source:

![](images/223234.png)

Its at `/cgi-bin/phpinfo.php`

Visit the page , look for the Secret_Key and submit to solve the lab.

## Lab: Source code disclosure via backup files

### Description

>This lab leaks its source code via backup files in a hidden directory. To solve the lab, identify and submit the database password, which is hard-coded in the leaked source code.

### Solve

Trying to find the backup page by checking if its in `/robots.txt`:

![](images/111111233s.png)

And we find its at `/backup`

![](images/ghbgh.png)

![](images/ferggf.png)

Submit and solve the lab

## Lab: Authentication bypass via information disclosure

### Description

>This lab's administration interface has an authentication bypass vulnerability, but it is impractical to exploit without knowledge of a custom HTTP header used by the front-end.
>To solve the lab, obtain the header name then use it to bypass the lab's authentication. Access the admin interface and delete the user `carlos`.
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

Log in as wiener and try to visit `/admin` :

![](images/hhgrfhfn.png)

We know the flaw has something to do with the headers , so lets see which headers are allowed using `TRACE` request verb.

![](images/trey5345.png)

There is an interesting header being sent `X-Custom-IP-Authorization` . Knowledge of this header and that the admin needs to be local , provides an attack avenue.

![](images/gfhnb33.png)

We need to send the header with every subsequent request and delete carlos to solve the lab.

![](images/fdffdsfg.png)


## Lab: Information disclosure in version control history

### Description

>This lab discloses sensitive information via its version control history. To solve the lab, obtain the password for the `administrator` user then log in and delete the user `carlos`.

### Solve

Visiting `/.git` we can see that the site exposes its git config page.

![](images/34534f.png)

We need to download this .git and open it with a Git client . I used `gitg`
To download -> `wget -r -np -nH --cut-dirs=0 https://0a96008804c762808282ddd5009d0086.web-security-academy.net/.git`

And then open the git folder in your git GUI client and look for the admin password in the history.

![](images/bgfdsbd.png)

Login as `administrator` and solve the lab.
