from groq import Groq
from rest_framework.decorators import api_view
from rest_framework.response import Response

groq_client = Groq(api_key="YOUR_GROQ_API_KEY")

@api_view(["POST"])
def ai_climate_forecast(request):
    location = request.data.get("location")
    weather = request.data.get("weather", {})

    prompt = f"""
    You are a climate forecaster. 
    Given IMD data for {location}, provide:
    - Rain probability
    - Mosquito risk
    - Heatwave risk
    - Crop disease risk
    - 3-day actionable advice

    IMD weather data:
    {weather}
    """

    completion = groq_client.chat.completions.create(
        model="qwen-32b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    result = completion.choices[0].message["content"]
    return Response({"forecast": result})
