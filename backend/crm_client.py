import httpx
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("RETAIL_CRM_API_KEY")
API_URL = os.getenv("RETAIL_CRM_API_URL")


async def get_orders():
    page = 1
    all_orders = []

    while True:
        params = {
            "apiKey": API_KEY,
            "limit": 100,
            "page": page,
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(API_URL, params=params)
            response.raise_for_status()

        data = response.json()
        raw_orders = data.get("orders", [])

        if not raw_orders:
            break

        for order in raw_orders:
            number = order.get("number")
            status = order.get("status", "")
            items = order.get("items", [])

            total_items = len(items)
            items_without_delivery = [
                item for item in items
                if "доставка" not in item.get("offer", {}).get("name", "").lower()
            ]
            count_without_delivery = len(items_without_delivery)

            all_orders.append({
                "number": number,
                "status": status,
                "total_items": total_items,
                "items_without_delivery": count_without_delivery
            })

        page += 1

    return all_orders
