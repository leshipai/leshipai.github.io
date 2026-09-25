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

### Lab: Username enumeration via different responses

Trying to enumerate the username -> Sent the candidate usernames with an irregularly long password and observed the response length . Spot the one with a different length

Password Bruteforce -> With the enumerated username , bruteforce with the candidate password list and spot the one with a different status code(302 in this case).

### Lab: Username enumeration via subtly different responses
Trying to enumerate the username -> Observing the message that pops up on an invalid attempt to login `Invalid username or password` , you notice one of the usernames generate a different message `Invalid username or password` . It's missing a period(.). 

### Lab: Username enumeration via response timing
We have valid creds `wiener:peter` which we can use to check the behavior of the site on correct creds. With a wrong username the response time is fast(~191ms). Hypothesis: The app might be checking if the username is correct before validating the password. 
To test this , we send the correct username and a very long password. We find that the response time is longer(~1,134ms). With the candidate usernames list and this obscenely long password , we can enumerate the username.
Caveat: There is rate limiting in place. Fix: Use `X-Forwarded-For` header to bypass.

### Lab: Broken brute-force protection, IP block

We are provided with valid credentials `wiener:peter` and a target account username:`carlos`. I noticed that the was a rate limit, such that after every 3 unsuccessful login attempts , you have to wait for 1 minute to continue. I tried bypassing using headers such as `X-Forwarded-For , X-Originating-IP` etc but had no luck. 
Based on what i read on the module earlier(and a nudge from siunam's [blog](https://siunam321.github.io/ctf/portswigger-labs/Authentication/auth-6/)) , I realised that since the timeout is executed after the 3rd attempt(on the 4th attempt that is) , logging in with the correct on the 3rd attempt would reset the failure count.
Next is crafting the payloads to match this format. One important thing to note is that the number of concurrent request should be 1 during the brute-force attack.(and not the default 10 on burp)


