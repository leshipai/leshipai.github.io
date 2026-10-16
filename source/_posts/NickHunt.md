---
title: "SOCMINT: Nickhunt Part1"
date: 2026-10-09 18:43
categories:
  - - Writeups
tags:
  - osint
  - CTF
cover: /images/five.jpeg
---

Hi , here I try to tackle Byte's challenge from Hackuten. A three-part SOCMINT challenge. This covers the first part. 
<!-- more -->

## Challenge Description

>The user **"Nick_Hunt"** tends to leave small details behind when sharing observations online. Your task is to follow his activity, connect the dots and recover the flag.

## Reconnaissance

We are provided with a username `Nick_Hunt` and now have to find an account associated with the username.

Using a username search tool such as [WhatsMyName](https://whatsmyname.me/) we find several results . Looking through each , we come across a Mastodon Account that's particularly interesting with bio "Threat Intel Analyst | OSINT enthusiast"

![MastodnAcc](MastodonAcc.png)

## Finding More Information

First thing I did was find archived snapshots of the account on web.archive.org and archive.is.
There were no snapshots on web archive but on archive.is we found a [snapshot](https://archive.is/zFFIs) with a now deleted post.

![snapshot](snapshot.png)

Just the words `///talent` . Nothing much . But from some speculations its quite clearly one of three parts of a what3words location reference.

Since we didn't gain enough information from the snapshot to attribute a secondary account , we go back to examining the Mastodon Account.

The Mastodon Account has two posts:

![FirstTweet](FirstTweet.png)


![](SecondTweet.png)

He claims `Will Share more where I usually post threads` and `The big corps are all noise and ads but I still keep accounts there.` . Both of these clearly point to Twitter(now X). And now forms the next part of our hunt - Checking for an account on twitter.

![](FakeNick_Hunt.png)

Its very clearly not the same account for several reasons : In account attribution , for the most part and also at least in challenges , the account needs to be fresh , a sock puppet and have a consistent attributable profile image. The main reason to discredit this account is what he says in one of his Mastodon posts `The big corps are all noise and ads, but I still keep accounts there. Too many in the community to learn from and engage with.` The above account doesn't follow or "engage" with said people.


So we go back to his Mastodon account and inspect his following:

![](following.png)

Next we have to check the followings of the above accounts . I chose `OSINT Tactical` since i knew of him . As of writing this post i don't know of a more reliable way to check/export all the following of an account on Twitter . I used a custom approach , using a particular Chrome extension that allows to change the X layout to the old `twitter ` layout . I don't know if this is against policies so use with caution. Here is the [extension](https://chromewebstore.google.com/detail/old-twitter-layout-2026/jgejdcdoeeabklepnkdbglgccjpdgpmf)

