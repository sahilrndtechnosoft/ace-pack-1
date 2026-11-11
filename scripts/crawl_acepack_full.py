#!/usr/bin/env python3
import urllib.request
import xml.etree.ElementTree as ET
import re
import os
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://www.acepack.co.in"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

IMG_DIR = os.path.join(os.getcwd(), "public", "admin", "images", "blog")
os.makedirs(IMG_DIR, exist_ok=True)

def fetch_url(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url}: {e}")
        return None

def fetch_image(img_url, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 100:
        return True
    req = urllib.request.Request(img_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            content = resp.read()
            with open(dest_path, "wb") as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"[WARN] Failed to download image {img_url}: {e}")
        return False

def get_sitemap_urls(sitemap_url):
    html = fetch_url(sitemap_url)
    if not html:
        return []
    root = ET.fromstring(html)
    return [loc.text.strip() for loc in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]

def parse_blog(slug, url):
    html = fetch_url(url)
    if not html:
        return None
    
    title_m = re.search(r"<title>(.*?)</title>", html, re.DOTALL | re.IGNORECASE)
    desc_m = re.search(r"<meta[^>]*name=[\"\']description[\"\'][^>]*content=[\"\'](.*?)[\"\']", html, re.DOTALL | re.IGNORECASE)
    canonical_m = re.search(r"<link[^>]*rel=[\"\']canonical[\"\'][^>]*href=[\"\'](.*?)[\"\']", html, re.DOTALL | re.IGNORECASE)
    h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.DOTALL | re.IGNORECASE)
    
    # OpenGraph tags
    og_title_m = re.search(r"<meta[^>]*property=[\"\']og:title[\"\'][^>]*content=[\"\'](.*?)[\"\']", html, re.DOTALL | re.IGNORECASE)
    og_desc_m = re.search(r"<meta[^>]*property=[\"\']og:description[\"\'][^>]*content=[\"\'](.*?)[\"\']", html, re.DOTALL | re.IGNORECASE)
    og_img_m = re.search(r"<meta[^>]*property=[\"\']og:image[\"\'][^>]*content=[\"\'](.*?)[\"\']", html, re.DOTALL | re.IGNORECASE)
    
    # Featured image from HTML
    img_m = re.search(r"<figure class=[\"\']image[\"\']>\s*<img[^>]*src=[\"\'](.*?)[\"\'][^>]*alt=[\"\'](.*?)[\"\']", html, re.DOTALL | re.IGNORECASE)
    raw_img_src = img_m.group(1).strip() if img_m else ""
    img_alt = img_m.group(2).strip() if img_m else ""
    
    # Resolve full image URL
    if raw_img_src.startswith("http"):
        full_img_url = raw_img_src
    elif raw_img_src.startswith("../"):
        full_img_url = f"{BASE_URL}/{raw_img_src.replace('../', '')}"
    elif raw_img_src.startswith("/"):
        full_img_url = f"{BASE_URL}{raw_img_src}"
    elif raw_img_src:
        full_img_url = f"{BASE_URL}/{raw_img_src}"
    else:
        full_img_url = og_img_m.group(1).strip() if og_img_m else ""
    
    # Local image filename
    local_img_rel = ""
    if full_img_url:
        img_filename = full_img_url.split("/")[-1].split("?")[0]
        if not img_filename or len(img_filename) < 3:
            img_filename = f"{slug}.jpg"
        dest_img_path = os.path.join(IMG_DIR, img_filename)
        fetch_image(full_img_url, dest_img_path)
        local_img_rel = f"/admin/images/blog/{img_filename}"
    
    # Meta date & views
    date_m = re.search(r"<i class=[\"\']fal fa-calendar-alt[\"\']></i>\s*([^<]+)", html)
    views_m = re.search(r"<i class=[\"\']fal fa-eye[\"\']></i>\s*([^<]+)", html)
    date_str = date_m.group(1).strip() if date_m else ""
    views_str = views_m.group(1).strip() if views_m else ""
    
    # Extract inner content
    content_html = ""
    inner_start = html.find('<div class="inner-column">')
    if inner_start != -1:
        inner_content_start = inner_start + len('<div class="inner-column">')
        col4_pos = html.find('<div class="col-lg-4', inner_content_start)
        if col4_pos != -1:
            raw_slice = html[inner_content_start:col4_pos]
            last_div = raw_slice.rfind("</div>")
            if last_div != -1:
                content_html = raw_slice[:last_div].strip()
                if content_html.endswith("</div>"):
                    content_html = content_html[:-6].strip()
        else:
            # fallback
            end_sec = html.find("</section>", inner_content_start)
            if end_sec != -1:
                content_html = html[inner_content_start:end_sec].strip()
    
    # Clean up empty paragraphs or weird artifacts from content_html
    content_html = re.sub(r"<p>&nbsp;</p>", "", content_html)
    
    # Extract plain text summary
    clean_text = re.sub(r"<[^>]+>", " ", content_html)
    clean_text = re.sub(r"\s+", " ", clean_text).strip()
    summary = desc_m.group(1).strip() if desc_m else clean_text[:220] + "..."
    
    title = h1_m.group(1).strip() if h1_m else (title_m.group(1).strip() if title_m else slug)
    # clean HTML entities if any
    title = re.sub(r"<[^>]+>", "", title).strip()
    
    return {
        "slug": slug,
        "url": url,
        "title": title,
        "meta_title": title_m.group(1).strip() if title_m else title,
        "meta_description": desc_m.group(1).strip() if desc_m else "",
        "canonical": canonical_m.group(1).strip() if canonical_m else url,
        "og_title": og_title_m.group(1).strip() if og_title_m else title,
        "og_description": og_desc_m.group(1).strip() if og_desc_m else "",
        "og_image": og_img_m.group(1).strip() if og_img_m else full_img_url,
        "image": local_img_rel or full_img_url,
        "image_remote": full_img_url,
        "image_alt": img_alt or title,
        "date": date_str,
        "views": views_str,
        "summary": summary,
        "content_html": content_html,
        "author": {
            "name": "Acepack",
            "role": "Packaging Team",
            "avatar": "/images/ace-logo.svg"
        }
    }

def main():
    print("=== STEP 1: Fetching all sitemaps ===")
    main_urls = get_sitemap_urls(f"{BASE_URL}/main-sitemap.xml")
    cat_urls = get_sitemap_urls(f"{BASE_URL}/category-sitemap.xml")
    prod_urls = get_sitemap_urls(f"{BASE_URL}/products-sitemap.xml")
    blog_sitemap_urls = get_sitemap_urls(f"{BASE_URL}/blogs-sitemap.xml")
    
    blog_urls = [u for u in blog_sitemap_urls if "/blog/" in u]
    print(f"Discovered: {len(main_urls)} main, {len(cat_urls)} categories, {len(prod_urls)} products, {len(blog_urls)} blogs")
    
    inventory = {
        "crawled_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "base_url": BASE_URL,
        "main_pages": main_urls,
        "categories": cat_urls,
        "products": prod_urls,
        "blog_urls": blog_urls,
    }
    
    with open("lib/data/acepack-live-inventory.json", "w", encoding="utf-8") as f:
        json.dump(inventory, f, indent=2)
    print("Saved inventory to lib/data/acepack-live-inventory.json")
    
    print(f"\n=== STEP 2: Crawling {len(blog_urls)} Blogs Concurrently ===")
    blogs = []
    
    def process_url(u):
        slug = u.rstrip("/").split("/")[-1]
        res = parse_blog(slug, u)
        return res
    
    start_t = time.time()
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(process_url, u): u for u in blog_urls}
        done_cnt = 0
        for f in as_completed(futures):
            u = futures[f]
            try:
                res = f.result()
                if res:
                    blogs.append(res)
                    done_cnt += 1
                    if done_cnt % 20 == 0 or done_cnt == len(blog_urls):
                        print(f"  [{done_cnt}/{len(blog_urls)}] Crawled {res['slug']} ({len(res['content_html'])} bytes)")
            except Exception as e:
                print(f"[ERROR] Exception processing {u}: {e}")
    
    # Sort blogs alphabetically by slug or original order
    slug_order = {u.rstrip("/").split("/")[-1]: i for i, u in enumerate(blog_urls)}
    blogs.sort(key=lambda b: slug_order.get(b["slug"], 999))
    
    print(f"Completed crawling {len(blogs)} blogs in {time.time() - start_t:.1f}s")
    
    with open("lib/data/acepack-all-blogs.json", "w", encoding="utf-8") as f:
        json.dump(blogs, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(blogs)} full blogs to lib/data/acepack-all-blogs.json")

if __name__ == "__main__":
    main()
