from openai import OpenAI
from config.config import get_config
import json

global_config = get_config()

client = OpenAI(api_key=global_config.OPEN_AI_KEY)

def create_schedule(claims, demands, schedule_prompt):
    response = client.responses.create(
        model = 'gpt-5.5',
        reasoning = {
            "effort": "high"
        },
        input=[
            {
                "role": "system",
                "content": schedule_prompt
            },
            {
                "role": "user",
                "content": f"Worker schedule matrix: {claims}\nDaily demands: {demands}"
            }
        ]
    )

    content = response.output[1].content[0].text

    return json.loads(content)