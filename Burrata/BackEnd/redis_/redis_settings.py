import redis.asyncio as redis
from fastapi import Request

def create_redis(url: str):
    return redis.from_url(
        url,
        decode_responses=True,
        socket_connect_timeout=1
    )

def get_redis(request: Request):
    return request.app.state.redis