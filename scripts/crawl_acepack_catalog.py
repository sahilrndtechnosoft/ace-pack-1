#!/usr/bin/env python3
"""Snapshot SEO + product data of every live page so our matching URLs keep the same signals.

Run: python3 scripts/crawl_acepack_catalog.py
Writes lib/data/acepack-live-catalog.json and downloads product images for lines we don't have
locally (public/images/products/<category>/).
"""
import html
import json
import os
import re
import xml.etree.ElementTree as ET

from crawl_acepack_full import BASE_URL, fetch_image, fetch_url

# Lines that exist only on the live site; their product photos are mirrored locally.
MIRROR_IMAGES_FOR = {"elite-containers"}
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


def text(fragment):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fragment or ""))).strip()


def first(pattern, source):
    m = re.search(pattern, source, re.DOTALL | re.IGNORECASE)
    return m.group(1) if m else ""


def seo(page):
    return {
        "title": text(first(r"<title>(.*?)</title>", page)),
        "description": html.unescape(first(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', page)).strip(),
        "canonical": first(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', page).strip(),
        "h1": text(first(r"<h1[^>]*>(.*?)</h1>", page)),
    }


def sitemap_paths(name):
    xml = fetch_url(f"{BASE_URL}/{name}") or ""
    return [loc.text.strip().replace(BASE_URL, "").rstrip("/") or "/" for loc in ET.fromstring(xml).iter(f"{NS}loc")]


def product_details(page, category):
    labels = [text(x) for x in re.findall(r'<p class="icon-label">(.*?)</p>', page, re.S)]
    values = [text(x) for x in re.findall(r'<p class="icon-value">(.*?)</p>', page, re.S)]
    specs = [{"label": l, "value": v} for l, v in zip(labels, values) if l and v]
    # Dimensions and packing are two-cell table rows: <tr><td>Top Diameter</td><td>172MM*119MM</td></tr>
    for l, v in re.findall(r"<tr>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*</tr>", page, re.S):
        l, v = text(l), text(v)
        if l and v and all(s["label"] != l for s in specs):
            specs.append({"label": l, "value": v})
    images = []
    for src in re.findall(r'class="xzoom-gallery3"[^>]*src="([^"]+)"', page) or re.findall(r'class="xzoom3"[^>]*src="([^"]+)"', page):
        src = html.unescape(src)
        if src in images:
            continue
        images.append(src)
    local = []
    if category in MIRROR_IMAGES_FOR:
        folder = os.path.join("public", "images", "products", category)
        os.makedirs(folder, exist_ok=True)
        for src in images:
            name = re.sub(r"[^A-Za-z0-9._-]+", "-", src.split("/")[-1])
            if fetch_image(src, os.path.join(folder, name)):
                local.append(f"/images/products/{category}/{name}")
    return {"specs": specs, "images": local or images}


def main():
    pages = {}
    for sitemap in ["main-sitemap.xml", "category-sitemap.xml", "products-sitemap.xml"]:
        for path in sitemap_paths(sitemap):
            page = fetch_url(BASE_URL + ("" if path == "/" else path), allow_redirect=False)
            if not page:
                continue
            entry = seo(page)
            parts = path.strip("/").split("/")
            if len(parts) == 3 and parts[0] == "plastic-food-containers":
                entry.update(product_details(page, parts[1]))
            pages[path] = entry
            print(f"{path}  |  {entry['title'][:70]}")
    with open("lib/data/acepack-live-catalog.json", "w", encoding="utf-8") as f:
        json.dump(pages, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(pages)} pages to lib/data/acepack-live-catalog.json")


if __name__ == "__main__":
    main()
