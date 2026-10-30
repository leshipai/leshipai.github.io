---
title: Portswigger path traversal
date: 2026-10-27
categories:
  - - Web
    - Path Traversal
tags:
  - Web
  - Portswigger
cover: /images/russted.jpeg
---

Tackling the Path Traversal Labs from Portswigger

<!-- more -->

---

## Lab: File path traversal, simple case

### Description

>This lab contains a path traversal vulnerability in the display of product images.
>To solve the lab, retrieve the contents of the `/etc/passwd` file.

### Solve

Open the image of a product in a new tab and take a look at the url

![](images/2dewfw.png)

Trying to change the query parameter to `../../../etc/passwd` and viewing we get an error:

![](images/wefwf.png)

This is because the contents of `/etc/passwd` is text and the page expects an image type . Reload this page and intercept using your proxy , send it and view the response:

![](images/wete5yt5.png)

## Lab: File path traversal, traversal sequences blocked with absolute path bypass

### Description

>This lab contains a path traversal vulnerability in the display of product images.
>The application blocks traversal sequences but treats the supplied filename as being relative to a default working directory.
>To solve the lab, retrieve the contents of the `/etc/passwd` file.

### Solve

Opening the image of a product in a new tab and looking at the url we see `filename=` . A perfect avenue to test path traversal.

Try to traverse up from the `images` folder using `../../../` we get the error `"No such file"`. 

Trying to provide the absolute path to `etc/passwd` using `/etc/passwd` as the value of `filename=` we get the passwd back . Its essential to check using proxy as the frontend js is programmed to expect an image and since the file isn't an image it won't be displayed

## Lab: File path traversal, traversal sequences stripped non-recursively

### Description

>This lab contains a path traversal vulnerability in the display of product images.
>The application strips path traversal sequences from the user-supplied filename before using it.
>To solve the lab, retrieve the contents of the `/etc/passwd` file.

### Solve

Opening the image of a product in a new tab and looking at the url we see `filename=` . A perfect avenue to test path traversal.

Try to traverse up from the `images` folder using `../../../` we get the error `"No such file"`. Trying to use the absolute path also returns the same error.

According to Portswigger Web Security Academy:

>You might be able to use nested traversal sequences, such as `....//` or `....\/`. These revert to simple traversal sequences when the inner sequence is stripped.

Trying it :

![](images/sdvdfbgv.png)

## Lab: File path traversal, traversal sequences stripped with superfluous URL-decode

### Description

>This lab contains a path traversal vulnerability in the display of product images.
>The application blocks input containing path traversal sequences. It then performs a URL-decode of the input before using it.
>To solve the lab, retrieve the contents of the `/etc/passwd` file.

### Solve

According to Portswigger Web Security Academy:

>web servers may strip any directory traversal sequences before passing your input to the application. You can sometimes bypass this kind of sanitization by URL encoding, or even double URL encoding, the `../` characters.

I tried all the sequences i had used in the previous labs but all returned the same error. Then i tried url encoding the `../` sequence which gave `%2e%2e%2f` . This didn't work as well. I knew of double url encoding but was unable to use burp to do so , so i used this [repo's](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Directory%20Traversal) payload:
`%252e%252e%252f`  and it worked:

![](images/gdfgfdgdf.png)

Seems the application looked for the sequences `../` in the url and stripped it . It does a single url decode and check and thats why the payload worked

## Lab: File path traversal, validation of start of path

### Description

>This lab contains a path traversal vulnerability in the display of product images.
>The application transmits the full file path via a request parameter, and validates that the supplied path starts with the expected folder.
>To solve the lab, retrieve the contents of the `/etc/passwd` file.

### Solve

>An application may require the user-supplied filename to start with the expected base folder, such as /var/www/images. In this case, it might be possible to include the required base folder followed by suitable traversal sequences. For example: filename=/var/www/images/../../../etc/passwd.

Visiting the image page of a product and looking at the url , we observer that the filename parameter includes the full path to the image. If unprotected , we can traverse up the folders to read the `/etc/passwd` file.

![](images/fdhghgd.png)

## Lab: File path traversal, validation of file extension with null byte bypass

### Description

> This lab contains a path traversal vulnerability in the display of product images.
>The application validates that the supplied filename ends with the expected file extension.
>To solve the lab, retrieve the contents of the /etc/passwd file. 

### Solve

>An application may require the user-supplied filename to end with an expected file extension, such as .png. In this case, it might be possible to use a null byte to effectively terminate the file path before the required extension. For example: filename=../../../etc/passwd%00.png.

Opening the image of a product in a new tab , and looking at the url , we see that the filename= takes the name of the image(which has a jpg) and fetches it. 

Trying to traverse using `../` returns the error `"No such file"` . However adding the null byte `%00` and appending the extension `.jpg` we are served the `passwd` file.

![](images/dghgh.png)