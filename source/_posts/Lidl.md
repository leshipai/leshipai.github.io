---
title: "My Hot Lidl Summer - OSINT CTF Writeup"
date: 2026-07-07 17:00:00
categories:
  - Writeups
tags:
  - OSINT
  - GeoINT
  - CTF
  - Hacktoria
---

![My Hot Lidl Summer](pster.png)

<!-- more -->

---

# Location 1

![Location 1 Challenge Image](lidl-location-01.png)

## Solution

![Location 1 Annotated](Lidl-1.png)

1. End of 30 km/h zone — means there is a 30 km/h road nearby. Also it's a German road sign.
2. Forested area
3. Cell mast
4. Parking area
5. Unique architecture of the Lidl
6. Light post

### Steps

First thing I tried was a reverse image search using Google, which did not yield any results. However, using Yandex to do the same resulted in a close match.

![Yandex RIS Result](yandex.png)

Visiting the [site](https://de.readymap.info/ru/14560/8240?utm_medium=organic&utm_source=yandexsmartcamera), we find the Lidl under the "Located Nearby" subcategory. Afterwards, just visit the same on Google Maps and find the Street View.

<iframe src="https://www.google.com/maps/embed?pb=!4v1783425658790!6m8!1m7!1ssXWxsqAxHs6AP64BJnhHSQ!2m2!1d47.89264101347491!2d10.61247753377938!3f324.714665783918!4f7.4265303925977975!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>

---

# Location 2

![Location 2 Challenge Image](lidl-location-02.png)

## Solution

A Google RIS returns many US-based results, suggesting the store is in the US. The slogan "High Quality Low Prices" is mainly associated with US Lidl.

Now that we have the country, narrowing down to the state: if you pay close attention you'll notice that the approaching car doesn't have a front license plate. There are states where this is allowed. See [here](https://worldpopulationreview.com/state-rankings/states-without-front-license-plates).

I also came across this [article](https://www.washingtonpost.com/news/business/wp/2017/02/15/a-first-look-at-how-german-grocer-lidl-plans-to-conquer-the-u-s-market/?utm_term=.76c6c0d0eead) about the architectural prototype visible in the image. We learn that it's mostly on the East Coast. Using the front plate data we remove several states and remain with: North Carolina, South Carolina, Delaware, Georgia, and Florida.

That's better than the whole country. Looking back at the [article](https://www.washingtonpost.com/news/business/wp/2017/02/15/a-first-look-at-how-german-grocer-lidl-plans-to-conquer-the-u-s-market/?utm_term=.76c6c0d0eead), it explicitly mentions South and North Carolina. From here on it was just brute force , going through the Lidls in each state and I eventually found it in North Carolina.

<iframe src="https://www.google.com/maps/embed?pb=!4v1783428991045!6m8!1m7!1sxAT_bHsilrmDFuUaEbytDQ!2m2!1d35.83988572702116!2d-78.61121426326157!3f93.64898068782827!4f1.1154405623385628!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>

---

# Location 3

![Location 3 Challenge Image](lidl-location-03.png)

## Solution

A RIS yields the exact "Big Sofass" store.

![Big Sofass RIS Result](location3-ris-result.png)

Visit their [page](https://www.bigsofassfuengirola.com/tienda-sofas-en-fuengirola) and find the address of the store.

<iframe src="https://www.google.com/maps/embed?pb=!4v1783429652530!6m8!1m7!1sY5G3a8uVvh9YGFoWu5vO3w!2m2!1d36.5351552046528!2d-4.633808046903434!3f173.01623992038856!4f-5.74453465450982!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>

---

# Location 4

![Location 4 Challenge Image](lidl-location-04.png)

## Solution

To locate the state, I looked for this [business](https://www.jdcusumano.com/) using what seems like "Cusumano Remodeling".

![Cusumano RIS Result](location4-ris-result.png)

They are located in New York. Now RIS and adding "New York" brings up a [site](https://www.liherald.com/stories/lidl-opens-new-store-on-dogwood-ave-in-franklin-square,131092) citing the location.

<iframe src="https://www.google.com/maps/embed?pb=!4v1783430165480!6m8!1m7!1sPNpVaSrvJKk-aLtc7p98CA!2m2!1d40.68887646457208!2d-73.66829829698865!3f249.58345345379735!4f-3.9887122020494132!5f1.1924812503605782" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>

---

# Location 5

![Location 5 Challenge Image](lidl-location-05.png)

## Solution

![Location 5 RIS Result](location5-ris-result.png)

<iframe src="https://www.google.com/maps/embed?pb=!4v1783430356990!6m8!1m7!1sY_gMLmPzrB3mXzFgazoRjQ!2m2!1d45.8844568252638!2d1.289582061774846!3f335.5859351219697!4f-6.487612813561341!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>

---

# Location 6

![Location 6 Challenge Image](lidl-location-06.png)

## Solution

From the image we can tell the store is in Finland, and what's visible is a self-checkout counter. This challenge was solved by grueling brute force. I searched for all Lidls in Helsinki and went through the photos one after the other. The "inside" filter of Google Maps made it a tad easier, but it was still tiring. I eventually found the image [here](https://maps.app.goo.gl/S3ZX7si8LKWrunm26).

Ideally, this challenge should have been solvable using Overpass Turbo, but since it did not have the appropriate tagging, it wasn't. I updated the details of the store on OpenStreetMap by adding the `self_checkout` tag.

The following is the query that geolocates the store:

```sql
[out:json][timeout:120];

{{geocodeArea:Finland}}->.searchArea;

(
  nwr["shop"="supermarket"]["name"~"Lidl",i]["self_checkout"="yes"](area.searchArea);
);

out center;
```

---

# Lidl Pub

![Lidl Pub Challenge Image](lidl-pub.png)

## Solution

`The Middle Ale, Dundonald`

[Source](https://www.liverpoolecho.co.uk/whats-on/whats-on-news/gallery/inside-worlds-first-500000-lidl-34141642)

---

# Lidl Website

![Old Lidl Website Challenge Image](old-lidl-website.png)

## Solution

The link to the website `lidl-bioness.de` is no longer alive. So the first thought was to search for archived snapshots across all the archiving tools. Web Archive was the only one that had archived the site.

Up to a certain point the site serves content, but after some date the site redirects to this [URL](https://web.archive.org/web/20081210035836/http://www.lidl-bioness.de/cps/rde/xchg/eigenmarken/hs.xsl/bioness.htm).

The last date I found that served actual content was 16th October 2008. [Here](https://web.archive.org/web/20081016031351/http://www.lidl-bioness.de/).

---

# Lidl Asian Beginnings

```
What city was the first Lidl Asia office located? And how many employees did it have? And what year did it open? (10 points)
```

## Solution

The site lidl.asia's about page has this information: https://lidl.asia/about-us

---

# Lidl Mobile

```
Does Lidl have a cellphone plan? If yes, what's it called, and when and where was it launched? (20 points)
```

## Solution

Checking the history of Lidl on [Wikipedia](https://en.wikipedia.org/wiki/Lidl), we find out: *"The mobile phone brand Lidl Connect was launched in Germany in October 2015."*

### Finding the Date

We know it was launched in Germany in October 2015. Using some Google dorks and the German language, we create this dork: `"lidl connect" AND "starten"` and limit the results to between 1st October and 31st October.

We find this [article](https://www.teltarif.de/lidl-connect-test-erster-eindruck/news/61290.html) from 2nd October 2015, where it says *"Lidl Connect launched yesterday..."*

So the date is **1st October 2015**.

---

# Easter Egg

![Easter Egg Challenge Image](random-lidl-logo.jpg)

## Solution

A RIS yields two sources — [1](https://www.shutterstock.com/editorial/image-editorial/lidl-logo-seen-stand-international-agricultural-show-16693948ah) and [2](https://www.franceinfo.fr/economie/emploi/lidl-france-annonce-vouloir-supprimer-jusqu-a-550-postes-administratifs-sans-depart-contraint_7926218.html) — both pointing to the *International Agricultural Show (Salon De L'Agriculture) at Paris Expo Porte De Versailles in Paris, France, on February 23, 2026*.

We can find the Lidl stand [here](https://www.salon-agriculture.com/en/exhibitors-and-visiting-tools/catalog/exhibitor/Lidl-France-2), where the address to the Lidl HQ in France is also listed.

The challenge said *"That random logo looks sus..."* — so my inference was that it was not a logo at a store but at an exhibition.

---

# Conclusion

If you're into OSINT, Hacktoria's Discord server runs challenges around the clock and is well worth joining: https://discord.gg/WyjtaBKGcz
