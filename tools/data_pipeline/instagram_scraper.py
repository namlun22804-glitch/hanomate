"""
HanoMate Data Pipeline — Instagram Scraper
==========================================
Cào posts Instagram liên quan đến ẩm thực Hà Nội.
Sử dụng Instagram Basic Display API + scraping công khai (không cần auth cho hashtags).

Strategy:
1. Scrape hashtag pages công khai (#hanoifood, #anuonghanoi, v.v.)
2. Extract: tên quán (từ caption), giá, địa chỉ, engagement
3. Fallback: dùng mock data phong phú khi bị rate-limit
"""

import re
import time
import json
import logging
from dataclasses import dataclass, field
from typing import Optional

import httpx

from config import get_random_ua, parse_prices_from_text, normalize_vendor_name, now_utc

log = logging.getLogger("hanomate.instagram")

INSTAGRAM_HASHTAGS = [
    "hanoifood", "anuonghanoi", "streetfoodhanoi",
    "hanoifoodies", "reviewanuonghanoi", "hanoidining",
]
INSTAGRAM_MAX_POSTS = 30


@dataclass
class InstagramPost:
    post_id: str = ""
    shortcode: str = ""
    caption: str = ""
    hashtags: list[str] = field(default_factory=list)
    likes: int = 0
    comments_count: int = 0
    timestamp: int = 0
    location_name: str = ""
    location_address: str = ""
    author: str = ""
    image_url: str = ""
    vendor_names: list[str] = field(default_factory=list)
    prices: list[float] = field(default_factory=list)


class InstagramScraper:
    """
    Scraper Instagram cho dữ liệu ẩm thực Hà Nội.

    Flow:
    1. Thử scrape hashtag pages công khai (Instagram web API)
    2. Nếu bị block → dùng mock data phong phú để vẫn có dữ liệu chạy pipeline
    """

    GRAPHQL_URL = "https://www.instagram.com/api/graphql"
    HASHTAG_URL = "https://www.instagram.com/explore/tags/{hashtag}/?__a=1&__d=dis"

    def __init__(self):
        self.client = httpx.Client(
            timeout=20.0,
            follow_redirects=True,
            headers={
                "User-Agent": get_random_ua(),
                "Accept": "*/*",
                "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
                "Referer": "https://www.instagram.com/",
                "X-IG-App-ID": "936619743392459",
            },
        )
        self._use_mock = False

    def _fetch_hashtag_posts(self, hashtag: str) -> list[dict]:
        """Lấy posts từ hashtag page công khai."""
        try:
            url = self.HASHTAG_URL.format(hashtag=hashtag)
            resp = self.client.get(url)

            if resp.status_code in (401, 403, 429):
                log.warning(f"Instagram rate-limited cho #{hashtag} ({resp.status_code}). Dùng mock data.")
                self._use_mock = True
                return []

            if resp.status_code != 200:
                log.debug(f"Instagram #{hashtag}: status {resp.status_code}")
                return []

            data = resp.json()
            # Try different JSON paths Instagram uses
            edges = (
                data.get("graphql", {}).get("hashtag", {}).get("edge_hashtag_to_media", {}).get("edges", [])
                or data.get("data", {}).get("recent", {}).get("sections", [])
            )

            posts = []
            for edge in edges[:INSTAGRAM_MAX_POSTS]:
                node = edge.get("node", edge)
                caption_edges = node.get("edge_media_to_caption", {}).get("edges", [])
                caption = caption_edges[0].get("node", {}).get("text", "") if caption_edges else ""

                posts.append({
                    "id": str(node.get("id", "")),
                    "shortcode": node.get("shortcode", ""),
                    "caption": caption,
                    "likes": node.get("edge_liked_by", {}).get("count", 0) or node.get("like_count", 0),
                    "comments": node.get("edge_media_to_comment", {}).get("count", 0) or node.get("comment_count", 0),
                    "timestamp": node.get("taken_at_timestamp", 0) or node.get("taken_at", 0),
                    "location": node.get("location") or {},
                })

            return posts

        except Exception as e:
            log.debug(f"Lỗi fetch Instagram #{hashtag}: {e}")
            self._use_mock = True
            return []

    def _extract_vendors_from_caption(self, caption: str) -> list[str]:
        """Trích xuất tên quán từ caption Instagram."""
        vendors = []
        # Pattern @mention (tên quán hay tag address)
        mentions = re.findall(r"@([\w.]{3,30})", caption)
        # Pattern "tại [Tên Quán]" / "ở [Tên Quán]"
        at_patterns = re.findall(r"(?:tại|ở|check.in|visit)\s+([A-ZÀ-Ỹ][^\n,\.!?]{2,40})", caption)
        # Emoji location + tên
        loc_patterns = re.findall(r"📍\s*([^\n,\.!?]{3,50})", caption)

        vendors.extend(mentions)
        vendors.extend(at_patterns)
        vendors.extend(loc_patterns)

        stop = {"hanoifood", "anuonghanoi", "food", "hanoi", "vietnam", "vietfood"}
        return [v.strip() for v in vendors if v.lower().strip() not in stop][:5]

    def _estimate_rating(self, likes: int, comments: int) -> float:
        total = likes + comments * 3
        if total > 5000: return 4.8
        if total > 1000: return 4.5
        if total > 300:  return 4.2
        return 3.8

    def _get_mock_data(self) -> list[dict]:
        """
        Mock data phong phú — dùng khi Instagram bị rate-limit.
        Dữ liệu được tổng hợp từ các nguồn công khai về ẩm thực Hà Nội.
        """
        return [
            {
                "id": "ig_mock_001", "shortcode": "mock001",
                "caption": "🍜 Bún chả Hương Liên - nơi Obama đã ăn! Giá 65k/suất. 📍 24 Lê Văn Hưu #hanoifood #bunchaobanama",
                "likes": 12500, "comments": 340, "timestamp": 1715000000,
                "location": {"name": "Bún chả Hương Liên", "address": "24 Lê Văn Hưu"},
            },
            {
                "id": "ig_mock_002", "shortcode": "mock002",
                "caption": "☕ Cà phê trứng Giảng siêu ngon! 35k/ly. Trải nghiệm must-try khi đến Hà Nội 📍 39 Nguyễn Hữu Huân #egocoffee #hanoicafe",
                "likes": 8900, "comments": 210, "timestamp": 1715100000,
                "location": {"name": "Cà phê Giảng", "address": "39 Nguyễn Hữu Huân"},
            },
            {
                "id": "ig_mock_003", "shortcode": "mock003",
                "caption": "🍵 Phở Thìn Lò Đúc - phở ngon nhất Hà Nội theo mình! 70k/bát, đến sớm kẻo hết 📍 13 Lò Đúc #pho #hanoifood",
                "likes": 15200, "comments": 480, "timestamp": 1715200000,
                "location": {"name": "Phở Thìn Lò Đúc", "address": "13 Lò Đúc"},
            },
            {
                "id": "ig_mock_004", "shortcode": "mock004",
                "caption": "🌅 Rooftop view đẹp mê hồn tại Cà phê Phố Cổ! 45k/ly cà phê. 📍 11 Hàng Gai #rooftopcafe #hanoiview",
                "likes": 22000, "comments": 620, "timestamp": 1715300000,
                "location": {"name": "Cà phê Phố Cổ", "address": "11 Hàng Gai, Hoàn Kiếm"},
            },
            {
                "id": "ig_mock_005", "shortcode": "mock005",
                "caption": "🥖 Bánh mì 25 Hàng Cá - giòn tan, nhân đầy! Chỉ 30k thôi 📍 25 Hàng Cá #banhmi #streetfoodhanoi",
                "likes": 9300, "comments": 180, "timestamp": 1715400000,
                "location": {"name": "Bánh mì 25", "address": "25 Hàng Cá"},
            },
            {
                "id": "ig_mock_006", "shortcode": "mock006",
                "caption": "🍺 Bia hơi Tạ Hiện về đêm! 8k/cốc bia hơi tươi, atmosphere siêu vui 📍 Tạ Hiện & Lương Ngọc Quyến #biahoi #hanoinight",
                "likes": 18500, "comments": 890, "timestamp": 1715500000,
                "location": {"name": "Bia Hơi Corner Tạ Hiện", "address": "Tạ Hiện, Hoàn Kiếm"},
            },
            {
                "id": "ig_mock_007", "shortcode": "mock007",
                "caption": "🐟 Chả cá Lã Vọng - món đặc sản Hà Nội phải thử! 350k/phần, ăn với thì là và bún 📍 14 Chả Cá #chaca #hanoifood",
                "likes": 7800, "comments": 290, "timestamp": 1715600000,
                "location": {"name": "Chả cá Lã Vọng", "address": "14 Chả Cá, Hoàn Kiếm"},
            },
            {
                "id": "ig_mock_008", "shortcode": "mock008",
                "caption": "🍱 Xôi Yến - xôi ngon nức tiếng 35 Nguyễn Hữu Huân, 25-55k tùy loại #xoi #breakfast #hanoifood",
                "likes": 5200, "comments": 140, "timestamp": 1715700000,
                "location": {"name": "Xôi Yến", "address": "35B Nguyễn Hữu Huân"},
            },
            {
                "id": "ig_mock_009", "shortcode": "mock009",
                "caption": "🏮 Hồ Gươm buổi sáng sớm, đi bộ miễn phí + mua bánh mì ăn sáng 25k 📍 Hồ Hoàn Kiếm #hoankiem #morningwalk",
                "likes": 31000, "comments": 750, "timestamp": 1715800000,
                "location": {"name": "Hồ Hoàn Kiếm", "address": "Đinh Tiên Hoàng, Hoàn Kiếm"},
            },
            {
                "id": "ig_mock_010", "shortcode": "mock010",
                "caption": "🍜 Bún bò Nam Bộ Lê Văn Hưu - bún trộn kiểu miền Nam ngon đến bất ngờ! 60k/tô 📍 67 Lê Văn Hưu #bunbo #noodles",
                "likes": 4600, "comments": 95, "timestamp": 1715900000,
                "location": {"name": "Bún bò Nam Bộ Lê Văn Hưu", "address": "67 Lê Văn Hưu"},
            },
        ]

    def scrape(self) -> list[dict]:
        """Chạy scraper Instagram: hashtags → extract → pipeline format."""
        log.info(f"📸 Bắt đầu cào Instagram — Hashtags: {INSTAGRAM_HASHTAGS}")
        all_posts: list[InstagramPost] = []

        # Thử scrape thật
        for tag in INSTAGRAM_HASHTAGS[:3]:
            log.info(f"  🔍 Đang scrape #{tag}")
            raw_posts = self._fetch_hashtag_posts(tag)

            if self._use_mock:
                log.info("  ⚡ Chuyển sang mock data (Instagram rate-limited)")
                break

            for raw in raw_posts:
                caption = raw.get("caption", "")
                location = raw.get("location", {})

                post = InstagramPost(
                    post_id=raw.get("id", ""),
                    shortcode=raw.get("shortcode", ""),
                    caption=caption,
                    hashtags=re.findall(r"#(\w+)", caption),
                    likes=raw.get("likes", 0),
                    comments_count=raw.get("comments", 0),
                    timestamp=raw.get("timestamp", 0),
                    location_name=location.get("name", "") if location else "",
                    location_address=location.get("address", "") if location else "",
                )
                post.vendor_names = self._extract_vendors_from_caption(caption)
                post.prices = parse_prices_from_text(caption)

                if location and location.get("name"):
                    post.vendor_names.insert(0, location["name"])

                if post.vendor_names or post.prices:
                    all_posts.append(post)

            time.sleep(2.0)

        # Dùng mock data nếu không crawl được
        if self._use_mock or not all_posts:
            log.info("  📦 Đang load mock Instagram data...")
            mock_raw = self._get_mock_data()
            for raw in mock_raw:
                caption = raw.get("caption", "")
                location = raw.get("location", {})
                post = InstagramPost(
                    post_id=raw.get("id", ""),
                    caption=caption,
                    likes=raw.get("likes", 0),
                    comments_count=raw.get("comments", 0),
                    location_name=location.get("name", "") if location else "",
                    location_address=location.get("address", "") if location else "",
                )
                post.vendor_names = self._extract_vendors_from_caption(caption)
                if location and location.get("name"):
                    post.vendor_names.insert(0, location["name"])
                post.prices = parse_prices_from_text(caption)
                all_posts.append(post)

        # Convert to pipeline format
        raw_results = []
        for post in all_posts:
            rating = self._estimate_rating(post.likes, post.comments_count)
            for vendor_name in (post.vendor_names or ["Unknown"]):
                for price in (post.prices or [None]):
                    raw_results.append({
                        "source": "instagram",
                        "vendor_name": vendor_name,
                        "vendor_name_normalized": normalize_vendor_name(vendor_name),
                        "item_name": "general",
                        "price": price,
                        "rating": rating,
                        "address": post.location_address or None,
                        "raw_text": post.caption[:500],
                        "metadata": {
                            "post_id": post.post_id,
                            "likes": post.likes,
                            "comments": post.comments_count,
                            "location_name": post.location_name,
                            "hashtags": post.hashtags[:10],
                            "is_mock": self._use_mock,
                        },
                        "scraped_at": now_utc().isoformat(),
                    })

        log.info(f"📸 Instagram hoàn tất: {len(all_posts)} posts → {len(raw_results)} entries (mock={self._use_mock})")
        return raw_results


# ── CLI ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="HanoMate Instagram Scraper")
    parser.add_argument("--output", type=str, default=None)
    args = parser.parse_args()

    scraper = InstagramScraper()
    results = scraper.scrape()

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        log.info(f"💾 Đã lưu {len(results)} entries → {args.output}")
    else:
        print(json.dumps(results[:3], ensure_ascii=False, indent=2))
        print(f"\n... Tổng cộng {len(results)} entries")
