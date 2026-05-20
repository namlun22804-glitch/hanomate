"""
HanoMate Data Pipeline — ShopeeFood Scraper
=============================================
Cào thực đơn chi tiết từ ShopeeFood (Now.vn) — khu vực Hà Nội.
Đây là nguồn dữ liệu có cấu trúc nhất, đóng vai trò anchor price cho cross-verification.

Sử dụng ShopeeFood public API v6.
"""

import time
import json
import logging
from typing import Optional
from dataclasses import dataclass, field

import httpx

from config import (
    SHOPEEFOOD_CITY_ID,
    SHOPEEFOOD_MAX_RESTAURANTS,
    SHOPEEFOOD_CATEGORY_IDS,
    get_random_ua,
    normalize_vendor_name,
    now_utc,
)

log = logging.getLogger("hanomate.shopeefood")

# ── Data Structures ───────────────────────────────────────────────────────────


@dataclass
class ShopeeRestaurant:
    """Một nhà hàng / quán ăn trên ShopeeFood."""

    restaurant_id: int = 0
    name: str = ""
    address: str = ""
    latitude: float = 0.0
    longitude: float = 0.0
    rating: float = 0.0
    total_reviews: int = 0
    price_range: dict = field(default_factory=dict)
    categories: list[str] = field(default_factory=list)
    is_open: bool = True
    photo_url: str = ""
    menu_items: list[dict] = field(default_factory=list)


# ── ShopeeFood API Client ─────────────────────────────────────────────────────


class ShopeeFoodScraper:
    """
    Scraper cho ShopeeFood sử dụng public API v6.

    Flow:
    1. Lấy danh sách nhà hàng theo city_id + category
    2. Với mỗi nhà hàng → lấy chi tiết menu
    3. Extract: tên quán, địa chỉ, tọa độ GPS, menu (tên món + giá)
    """

    API_BASE = "https://gappapi.deliverynow.vn/api"

    # Headers mặc định cho ShopeeFood API
    DEFAULT_HEADERS = {
        "x-foody-client-id": "",
        "x-foody-client-type": "1",
        "x-foody-app-type": "1004",
        "x-foody-client-version": "3.0.0",
        "x-foody-api-version": "1",
        "x-foody-client-language": "vi",
    }

    def __init__(self, max_restaurants: int = None):
        self.max_restaurants = max_restaurants or SHOPEEFOOD_MAX_RESTAURANTS
        self.client = httpx.Client(
            timeout=30.0,
            follow_redirects=True,
            headers={
                **self.DEFAULT_HEADERS,
                "User-Agent": get_random_ua(),
                "Accept": "application/json",
            },
        )
        self._api_blocked = False

    MOCK_DATA = [
        {"name": "Bun cha Huong Lien", "address": "24 Le Van Huu, Hai Ba Trung", "lat": 21.0218, "lng": 105.8524, "rating": 4.9, "reviews": 2840,
         "menu": [{"name": "Bun cha thuong", "price": 65000}, {"name": "Bun cha dac biet", "price": 80000}, {"name": "Nem ran", "price": 15000}]},
        {"name": "Pho Thin Lo Duc", "address": "13 Lo Duc, Hai Ba Trung", "lat": 21.0245, "lng": 105.8512, "rating": 4.8, "reviews": 3120,
         "menu": [{"name": "Pho bo tai", "price": 65000}, {"name": "Pho bo chin", "price": 65000}, {"name": "Pho dac biet", "price": 80000}]},
        {"name": "Ca phe Giang", "address": "39 Nguyen Huu Huan, Hoan Kiem", "lat": 21.0341, "lng": 105.8521, "rating": 4.8, "reviews": 5230,
         "menu": [{"name": "Ca phe trung nong", "price": 35000}, {"name": "Ca phe trung da", "price": 40000}, {"name": "Ca phe den", "price": 25000}]},
        {"name": "Banh mi 25", "address": "25 Hang Ca, Hoan Kiem", "lat": 21.0353, "lng": 105.8484, "rating": 4.8, "reviews": 1890,
         "menu": [{"name": "Banh mi thit nguoi", "price": 25000}, {"name": "Banh mi pate", "price": 28000}, {"name": "Banh mi cha ca", "price": 35000}]},
        {"name": "Cha ca La Vong", "address": "14 Cha Ca, Hoan Kiem", "lat": 21.0349, "lng": 105.8483, "rating": 4.7, "reviews": 1560,
         "menu": [{"name": "Cha ca 1 nguoi", "price": 350000}, {"name": "Cha ca 2 nguoi", "price": 650000}]},
        {"name": "Xoi Yen", "address": "35B Nguyen Huu Huan, Hoan Kiem", "lat": 21.0337, "lng": 105.8519, "rating": 4.6, "reviews": 980,
         "menu": [{"name": "Xoi xeo", "price": 25000}, {"name": "Xoi ga", "price": 45000}, {"name": "Xoi thit kho", "price": 40000}]},
        {"name": "Bun bo Nam Bo Le Van Huu", "address": "67 Le Van Huu, Hai Ba Trung", "lat": 21.0214, "lng": 105.8520, "rating": 4.6, "reviews": 720,
         "menu": [{"name": "Bun bo Nam Bo", "price": 60000}, {"name": "Bun bo dac biet", "price": 75000}]},
        {"name": "Pho Bat Dan", "address": "49 Bat Dan, Hoan Kiem", "lat": 21.0346, "lng": 105.8489, "rating": 4.7, "reviews": 2100,
         "menu": [{"name": "Pho ga", "price": 55000}, {"name": "Pho bo", "price": 60000}, {"name": "Pho dac biet", "price": 75000}]},
        {"name": "Quan an Ngon", "address": "18 Phan Boi Chau, Hoan Kiem", "lat": 21.0270, "lng": 105.8450, "rating": 4.5, "reviews": 3400,
         "menu": [{"name": "Pho bo", "price": 80000}, {"name": "Bun cha", "price": 75000}, {"name": "Com rang", "price": 65000}]},
        {"name": "Ca phe Pho Co", "address": "11 Hang Gai, Hoan Kiem", "lat": 21.0340, "lng": 105.8498, "rating": 4.7, "reviews": 4500,
         "menu": [{"name": "Ca phe den da", "price": 35000}, {"name": "Ca phe sua da", "price": 40000}, {"name": "Sinh to xoai", "price": 55000}]},
    ]
    def _get_restaurants_by_category(
        self,
        category_id: int,
        page: int = 1,
        limit: int = 48,
    ) -> list[dict]:
        """
        Lấy danh sách nhà hàng theo category trong thành phố.
        Endpoint: GET /delivery/get_delivery_dishes
        """
        url = f"{self.API_BASE}/delivery/get_delivery_dishes"
        params = {
            "city_id": SHOPEEFOOD_CITY_ID,
            "category_group": category_id,
            "page": page,
            "limit": limit,
            "sort_type": 2,  # Sort by popularity
            "request_id": int(time.time() * 1000),
        }

        try:
            resp = self.client.get(url, params=params)
            if resp.status_code != 200:
                log.warning(
                    f"ShopeeFood API trả về {resp.status_code} cho category {category_id}"
                )
                return []

            data = resp.json()
            if data.get("result") != "success":
                log.warning(f"ShopeeFood API error: {data.get('result')}")
                return []

            infos = data.get("reply", {}).get("delivery_infos", [])
            return [info.get("delivery", {}) for info in infos if info.get("delivery")]

        except Exception as e:
            log.error(f"Lỗi lấy restaurants category {category_id}: {e}")
            return []

    def _get_restaurant_detail(self, restaurant_id: int) -> Optional[dict]:
        """
        Lấy thông tin chi tiết nhà hàng.
        Endpoint: GET /delivery/get_detail
        """
        url = f"{self.API_BASE}/delivery/get_detail"
        params = {
            "id_type": 2,
            "request_id": int(time.time() * 1000),
        }

        try:
            resp = self.client.get(
                url,
                params={**params, "id": restaurant_id},
            )
            if resp.status_code != 200:
                return None

            data = resp.json()
            if data.get("result") == "success":
                return data.get("reply", {}).get("delivery_detail", {})
            return None

        except Exception as e:
            log.debug(f"Lỗi lấy detail restaurant {restaurant_id}: {e}")
            return None

    def _get_menu(self, restaurant_id: int) -> list[dict]:
        """
        Lấy toàn bộ menu của nhà hàng.
        Endpoint: GET /dish/get_delivery_dishes
        """
        url = f"{self.API_BASE}/dish/get_delivery_dishes"
        params = {
            "id_type": 2,
            "request_id": int(time.time() * 1000),
        }

        try:
            resp = self.client.get(
                url,
                params={**params, "id": restaurant_id},
            )
            if resp.status_code != 200:
                return []

            data = resp.json()
            if data.get("result") != "success":
                return []

            menu_infos = data.get("reply", {}).get("menu_infos", [])
            dishes = []

            for category in menu_infos:
                category_name = category.get("dish_type_name", "")
                for dish in category.get("dishes", []):
                    # Safely extract price — API có thể trả về int hoặc dict
                    raw_price = dish.get("price", 0)
                    if isinstance(raw_price, dict):
                        price_val = raw_price.get("value", 0)
                    else:
                        price_val = raw_price

                    raw_discount = dish.get("discount_price")
                    if isinstance(raw_discount, dict):
                        discount_val = raw_discount.get("value")
                    else:
                        discount_val = raw_discount

                    dish_info = {
                        "dish_id": dish.get("id", 0),
                        "name": dish.get("name", ""),
                        "description": dish.get("description", ""),
                        "price": price_val,
                        "discount_price": discount_val,
                        "is_available": dish.get("is_available", True),
                        "category": category_name,
                        "photo": dish.get("photos", [{}])[0].get("value", "")
                        if dish.get("photos")
                        else "",
                        # Các options / toppings
                        "options": [],
                    }

                    # Parse options
                    for option_group in dish.get("options", []):
                        option_items = option_group.get("option_items", {})
                        if isinstance(option_items, dict):
                            items_list = option_items.get("items", [])
                        elif isinstance(option_items, list):
                            items_list = option_items
                        else:
                            items_list = []
                        for option in items_list:
                            opt_price = option.get("price", 0)
                            if isinstance(opt_price, dict):
                                opt_price = opt_price.get("value", 0)
                            dish_info["options"].append(
                                {
                                    "name": option.get("name", ""),
                                    "price": opt_price,
                                }
                            )

                    # Chỉ lấy món có giá > 0 và đang available
                    if dish_info["price"] > 0 and dish_info["is_available"]:
                        dishes.append(dish_info)

            return dishes

        except Exception as e:
            log.error(f"Lỗi lấy menu restaurant {restaurant_id}: {e}")
            return []

    def _parse_restaurant(self, raw: dict) -> ShopeeRestaurant:
        """Parse raw API data thành ShopeeRestaurant."""
        return ShopeeRestaurant(
            restaurant_id=raw.get("id", 0),
            name=raw.get("name", ""),
            address=raw.get("address", ""),
            latitude=raw.get("position", {}).get("latitude", 0.0),
            longitude=raw.get("position", {}).get("longitude", 0.0),
            rating=raw.get("rating", {}).get("avg", 0.0),
            total_reviews=raw.get("rating", {}).get("total_review", 0),
            price_range={
                "min": raw.get("price_range", {}).get("min_price", 0),
                "max": raw.get("price_range", {}).get("max_price", 0),
            },
            categories=[
                cat.get("name", "")
                for cat in raw.get("categories", [])
                if cat.get("name")
            ],
            is_open=raw.get("is_open", True),
            photo_url=(
                raw.get("photos", [{}])[0].get("value", "")
                if raw.get("photos")
                else ""
            ),
        )

    def scrape(self) -> list[dict]:
        """
        Chạy scraper: lấy danh sách nhà hàng → lấy menu → output entries.

        Returns:
            list[dict]: Danh sách raw price entries theo format chuẩn pipeline.
        """
        log.info(
            f"🍜 Bắt đầu cào ShopeeFood — City: {SHOPEEFOOD_CITY_ID}, "
            f"Categories: {SHOPEEFOOD_CATEGORY_IDS}"
        )

        all_restaurants: list[ShopeeRestaurant] = []
        seen_ids: set[int] = set()

        # Bước 1: Lấy danh sách nhà hàng theo từng category
        for cat_id in SHOPEEFOOD_CATEGORY_IDS:
            log.info(f"  📂 Đang lấy category {cat_id}")
            page = 1

            while len(all_restaurants) < self.max_restaurants:
                raw_list = self._get_restaurants_by_category(cat_id, page=page)
                if not raw_list:
                    break

                for raw in raw_list:
                    rid = raw.get("id", 0)
                    if rid and rid not in seen_ids:
                        seen_ids.add(rid)
                        restaurant = self._parse_restaurant(raw)
                        all_restaurants.append(restaurant)

                page += 1
                time.sleep(1.0)

                if len(all_restaurants) >= self.max_restaurants:
                    break

        log.info(f"  📊 Tổng {len(all_restaurants)} nhà hàng duy nhất")

        # Fallback: nếu API bị block, dùng mock data
        if not all_restaurants:
            log.warning("  ⚡ ShopeeFood API bị block (403). Dùng mock data...")
            raw_results = []
            for r in self.MOCK_DATA:
                for dish in r.get("menu", []):
                    raw_results.append({
                        "source": "shopeefood",
                        "vendor_name": r["name"],
                        "vendor_name_normalized": normalize_vendor_name(r["name"]),
                        "item_name": dish["name"],
                        "price": dish["price"],
                        "rating": r["rating"],
                        "address": r["address"],
                        "coordinates": {"lat": r["lat"], "lng": r["lng"]},
                        "raw_text": "",
                        "metadata": {"total_reviews": r["reviews"], "is_mock": True},
                        "scraped_at": now_utc().isoformat(),
                    })
            log.info(f"  ShopeeFood mock: {len(raw_results)} entries")
            return raw_results

        # Bước 2: Lấy menu cho mỗi nhà hàng
        raw_results = []

        for i, restaurant in enumerate(all_restaurants):
            log.info(
                f"  🍽️  [{i+1}/{len(all_restaurants)}] "
                f"Đang lấy menu: {restaurant.name}"
            )

            menu = self._get_menu(restaurant.restaurant_id)
            restaurant.menu_items = menu

            if not menu:
                log.debug(f"     Không có menu cho {restaurant.name}")
                # Vẫn tạo entry cho restaurant (không có menu cụ thể)
                raw_results.append(
                    {
                        "source": "shopeefood",
                        "vendor_name": restaurant.name,
                        "vendor_name_normalized": normalize_vendor_name(restaurant.name),
                        "item_name": "general",
                        "price": (
                            (restaurant.price_range.get("min", 0) + restaurant.price_range.get("max", 0)) / 2
                            if restaurant.price_range.get("max", 0) > 0
                            else None
                        ),
                        "rating": restaurant.rating,
                        "address": restaurant.address,
                        "coordinates": {
                            "lat": restaurant.latitude,
                            "lng": restaurant.longitude,
                        },
                        "raw_text": "",
                        "metadata": {
                            "restaurant_id": restaurant.restaurant_id,
                            "total_reviews": restaurant.total_reviews,
                            "categories": restaurant.categories,
                            "is_open": restaurant.is_open,
                            "photo": restaurant.photo_url,
                        },
                        "scraped_at": now_utc().isoformat(),
                    }
                )
            else:
                # Tạo entry cho mỗi món trong menu
                for dish in menu:
                    raw_results.append(
                        {
                            "source": "shopeefood",
                            "vendor_name": restaurant.name,
                            "vendor_name_normalized": normalize_vendor_name(
                                restaurant.name
                            ),
                            "item_name": dish["name"],
                            "price": dish["price"],
                            "discount_price": dish.get("discount_price"),
                            "rating": restaurant.rating,
                            "address": restaurant.address,
                            "coordinates": {
                                "lat": restaurant.latitude,
                                "lng": restaurant.longitude,
                            },
                            "raw_text": dish.get("description", ""),
                            "metadata": {
                                "restaurant_id": restaurant.restaurant_id,
                                "dish_id": dish["dish_id"],
                                "dish_category": dish.get("category", ""),
                                "total_reviews": restaurant.total_reviews,
                                "categories": restaurant.categories,
                                "photo": dish.get("photo", ""),
                                "options": dish.get("options", []),
                            },
                            "scraped_at": now_utc().isoformat(),
                        }
                    )

            time.sleep(0.5)  # Rate limiting giữa các restaurant

        log.info(
            f"🍜 ShopeeFood hoàn tất: "
            f"{len(all_restaurants)} nhà hàng → {len(raw_results)} menu items"
        )
        return raw_results


# ── CLI Entry Point ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="HanoMate ShopeeFood Scraper")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Chỉ log kết quả, không ghi DB",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Lưu kết quả ra file JSON",
    )
    parser.add_argument(
        "--max",
        type=int,
        default=None,
        help="Số nhà hàng tối đa (override config)",
    )
    args = parser.parse_args()

    if args.max:
        scraper = ShopeeFoodScraper(max_restaurants=args.max)
    else:
        scraper = ShopeeFoodScraper()
    results = scraper.scrape()

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        log.info(f"💾 Đã lưu {len(results)} entries → {args.output}")
    else:
        # In mẫu 5 entries đầu tiên
        print(json.dumps(results[:5], ensure_ascii=False, indent=2))
        print(f"\n... Tổng cộng {len(results)} entries")
