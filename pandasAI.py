from pandasai import SmartDataframe
from pandasai.llm import OpenAI
from pandasai.helpers.openai_info import get_openai_callback
import pandas as pd

llm = OpenAI(
    api_token='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',
    temperature = 0.7
)

# conversational=False is supposed to display lower usage and cost
df = SmartDataframe("data.csv", config={"llm": llm, "conversational": False})

response = df.chat("Give me the different types of sectors in the dataset")
print(response)