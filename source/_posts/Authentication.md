

---
title: "Portswigger Auth Labs"
date: 2026-09-24
categories:
  - Writeups
tags:
  - Web
---

This post kicks off a series documenting my walkthroughs of the PortSwigger Web Security Academy labs. Herein, I’m revisiting the Authentication module.
The goal of these write-ups isn't to provide exhaustive guides, but concise, practical snapshots focused strictly on methodology and exploitation steps.

<!-- more -->

---

Rest of your post content...

### Lab: Username enumeration via different responses

Trying to enumerate the username -> Sent the candidate usernames with an irregularly long password and observed the response length . Spot the one with a different length

Password Bruteforce -> With the enumerated username , bruteforce with the candidate password list and spot the one with a different status code(302 in this case).

##### Lab: Username enumeration via subtly different responses
Trying to enumerate the username -> Observing the message that pops up on an invalid attempt to login `Invalid username or password` , you notice one of the usernames generate a different message `Invalid username or password` . It's missing a period(.). 


