---
title: BugForge Galaxy Dash 006
date: 2026-09-28
categories:
  - Writeups
tags:
  - Web
---

In the following writeup , I try to tackle and document the Broken Access Control tagged labs from BugForge.io named Galaxy-Dash-006

<!-- more -->

---
### Galaxydash-006

On loading the challenge site we get a signup/login form where we are able to create an account and an organization/team.

![](Pasted_image_20260928220906.png)

We register two accounts `victim1` and `victim2` for test purposes. 

Off the rip , the most interesting functionality is the team and add team functionality

![](Pasted_image_20260928221245.png)

![](Pasted_image_20260928221346.png)

This is very interesting since it essentially lets you register accounts through a different avenue. The question is what happens when you provide it with a legit username and a different password, how will it react? Let's test that

So we add `victim2` to our organization and use a different password `123` from his actual password `victim2`.

![](Pasted_image_20260928221827.png)

Now let's see if it worked by trying to login as `victim2` using his password from before

![](Pasted_image_20260928221925.png)

Lets try the new password `123`:

![](Pasted_image_20260928222004.png)

We manage to login as victim 2 and successfully identify the vulnerability: `Allows changing user credentials and data by add member to team functionality`

Now to solve the lab's challenge `Galaxy Dash have pushed some new updates. For testing you can target user walt`

Doing the same to the account `walt` and logging in we get the flag present in the response

![](Pasted_image_20260928222452.png)

Flag :`bug{8PSJ7rIRaPga12lj8u38iFzq8p2kuebC}`

Find the lab here ---> https://app.bugforge.io

