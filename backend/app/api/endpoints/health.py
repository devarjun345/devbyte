from fastapi import APIRouter

router = APIRouter()


@router.get("", status_code=200)
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "DEV BYTE API"}

