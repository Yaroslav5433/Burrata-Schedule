from loguru import logger
from utils.utils import get_seconds_to_next_monday

async def insert_claims_in_redis(username, claims, redis_client):
    logger.info('setting a claims in redis')

    await redis_client.hset(username, mapping = claims)
    await redis_client.expire(username, get_seconds_to_next_monday())

    await redis_client.hgetall(username)
    

async def get_claims_from_redis(username, redis_client):
    logger.info('getting a claims from redis')

    return await redis_client.hgetall(username)
