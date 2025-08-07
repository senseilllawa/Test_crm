from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from crm_client import get_orders

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/orders")
async def orders():
    try:
        result = await get_orders()
        return {"orders": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/summary")
async def summary():
    try:
        orders = await get_orders()

        approved_statuses = ["payoff", "assembling", "delivery", "complete", "return"]
        delivered_statuses = ["complete", "return"]

        total = len(orders)
        approved = sum(1 for o in orders if o["status"] in approved_statuses)
        delivered = sum(1 for o in orders if o["status"] in delivered_statuses)

        approval_rate = round((approved / total) * 100, 2) if total > 0 else 0
        delivery_rate = round((delivered / approved) * 100, 2) if approved > 0 else 0

        return {
            "total_orders": total,
            "approved_orders": approved,
            "delivered_orders": delivered,
            "approval_rate": approval_rate,
            "delivery_rate": delivery_rate
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
