---
title: Portswigger BAC Labs 1
date: 2026-10-14
categories:
  - [Web, Access Control]
tags:
  - Web
  - Portswigger
cover: /images/russted.jpeg
---

Tackling the SQL Injection Labs from Portswigger

<!-- more -->

---
## Lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

### Description

>This lab contains a SQL injection vulnerability in the product category filter. When the user selects a category, the application carries out a SQL query like the following:
>`SELECT * FROM products WHERE category = 'Gifts' AND released = 1`
>To solve the lab, perform a SQL injection attack that causes the application to display one or more unreleased products

### Solve

We know the way the queries are constructed:

`SELECT * FROM products WHERE category = 'Gifts' AND released = 1`

Visiting the Homepage and choose any category then trigger the error by adding a `'` to the end of the category's name . We get an `Internal Server Error` error confirming the issue.

Now constructing a payload 

`' OR 1=1--`

The modified query returns all items where either the `category` is `Gifts`, or `1` is equal to `1`. As `1=1` is always true, the query returns all items.

The query becomes:

`SELECT * FROM products WHERE category = 'Gifts' OR 1=1--' AND released = 1`

This solves the lab

## Lab: SQL injection vulnerability allowing login bypass

### Description

>This lab contains a SQL injection vulnerability in the login function.
>To solve the lab, perform a SQL injection attack that logs in to the application as the >`administrator` user.

### Solve

On the login page , use the username `administrator'--`  and any password. This comments out the password and logs you in as administrator