import os
import random
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# -------------------------------------------------------------
# 1. MAIN AI CHAT ENDPOINT
# -------------------------------------------------------------
@api_view(["POST"])
def ai_chat(request):
    user_msg = request.data.get("message", "")
    model = request.data.get("model", "qwen/qwen3-32b")

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": user_msg}],
            temperature=0.6,
            max_completion_tokens=2048,
            top_p=0.95,
        )
        reply = completion.choices[0].message.content
        return Response({"reply": reply})

    except Exception as e:
        return Response({"reply": f"⚠️ AI Error: {str(e)}"})


# -------------------------------------------------------------
# 2. RANDOM CLIMATE FORECAST ENGINE (NO IMD API)
# -------------------------------------------------------------
@api_view(["POST"])
def climate_forecast(request):
    location = request.data.get("location", "Unknown")

    # Randomized values
    rain = random.randint(10, 90)
    heat = random.randint(20, 46)
    mosquito = random.randint(10, 100)
    crop_risk = random.choice(["Low", "Moderate", "High"])

    day1 = random.choice(["Sunny", "Cloudy", "Light Rain", "Humid", "Partly Cloudy"])
    day2 = random.choice(["Clear Skies", "Heatwave Noon", "Scattered Showers", "Windy"])
    day3 = random.choice(["Possible Rain", "Cool Evening", "Foggy Morning", "Hot Afternoon"])

    forecast_text = f"""
🌦 Climate Forecast for {location}

• Rain Probability: {rain}%
• Heat Index: {heat}°C
• Mosquito/Dengue Risk: {mosquito}%
• Crop Disease Risk: {crop_risk}

📅 3-Day Outlook:
• Day 1: {day1}
• Day 2: {day2}
• Day 3: {day3}

🔍 Action Recommendations:
• Beware of peak heat between 1pm–4pm.
• Use mosquito nets & avoid stagnant water.
• Farmers: Apply mild fungicide if risk is High.
"""

    return Response({
        "ai_forecast": forecast_text,
        "mode": "RANDOM_GENERATOR",
        "imd_raw": None,
    })


# -------------------------------------------------------------
# 3. Dummy Endpoints (Do not remove)
# -------------------------------------------------------------
@api_view(["GET"])
def get_records(request):
    return Response({"status": "success", "records": []})

@api_view(["POST"])
def UploadMedicalRecord(request):
    return Response({"status": "uploaded"})
