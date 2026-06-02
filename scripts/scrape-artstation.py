import requests, json, xml.etree.ElementTree as ET, re, time, sys
from bs4 import BeautifulSoup

USERNAME = "juliogr94"
RSS_URL = f"https://www.artstation.com/{USERNAME}/rss"
OUTPUT = "projects.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
DELAY = 1.5

def fetch(url):
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    return resp

def parse_rss(xml_text):
    root = ET.fromstring(xml_text)
    items = []
    for item in root.findall(".//item"):
        title = item.findtext("title", "").strip()
        link = item.findtext("link", "").strip()
        enclosure = item.find("enclosure")
        thumb = enclosure.get("url", "") if enclosure is not None else ""
        if title and link:
            items.append({"title": title, "link": link, "thumbnail": thumb})
    return items

def extract_project(link):
    hash_id = link.rstrip("/").split("/")[-1]
    api_url = f"https://www.artstation.com/projects/{hash_id}.json"
    try:
        resp = fetch(api_url)
        data = resp.json()
        assets = data.get("assets", [])
        images = []
        for a in assets:
            if a.get("has_image") and a.get("image_url"):
                images.append(a["image_url"])
        desc_html = data.get("description", "") or ""
        desc = BeautifulSoup(desc_html, "html.parser").get_text(strip=True)[:200]
        tags = data.get("tags", [])
        tag_names = [t.get("name", "") for t in tags if isinstance(t, dict)]
        category = "3D"
        for t in tag_names:
            tl = t.lower()
            if any(k in tl for k in ["2d", "illustration", "concept art", "drawing"]):
                category = "2D"
                break
        return {
            "title": data.get("title", ""),
            "category": category,
            "description": desc,
            "thumbnail": images[0] if images else "",
            "images": images
        }
    except Exception as e:
        print(f"  API failed ({e}), scraping HTML...")
    try:
        resp = fetch(link)
        soup = BeautifulSoup(resp.text, "html.parser")
        og_title = soup.find("meta", property="og:title")
        title = og_title.get("content", "").strip() if og_title else ""
        images = []
        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src") or ""
            if "/large/" in src and src not in images:
                images.append(src.split("?")[0])
        return {
            "title": title,
            "category": "3D",
            "description": "",
            "thumbnail": images[0] if images else "",
            "images": images
        }
    except Exception as e:
        print(f"  HTML fallback failed: {e}")
        return None

def main():
    print(f"Fetching RSS feed from {RSS_URL}...")
    try:
        rss_text = fetch(RSS_URL).text
    except Exception as e:
        print(f"Failed to fetch RSS: {e}")
        sys.exit(1)
    items = parse_rss(rss_text)
    print(f"Found {len(items)} projects")
    projects = []
    for i, item in enumerate(items):
        print(f"[{i+1}/{len(items)}] {item['title']}...", end=" ", flush=True)
        try:
            proj = extract_project(item["link"])
            if proj:
                if not proj["thumbnail"]:
                    proj["thumbnail"] = item["thumbnail"]
                projects.append(proj)
                print("ok")
            else:
                print("skipped")
        except Exception as e:
            print(f"error: {e}")
        if i < len(items) - 1:
            time.sleep(DELAY)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)
    print(f"Written {len(projects)} projects to {OUTPUT}")

if __name__ == "__main__":
    main()
