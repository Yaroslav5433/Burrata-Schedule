import redis.asyncio as redis
from fastapi import Request

redis_client = None

def create_redis(url: str):
    return redis.from_url(
        url,
        decode_responses=True
    )

def get_redis(request: Request):
    return request.app.state.redis