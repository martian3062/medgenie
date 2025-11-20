from django.urls import path

from .views import (
    ai_chat,
    get_records,
    UploadMedicalRecord,
    climate_forecast,
)

from .views_signal import signal_handler
from .views_translate import translate_handler
from .views_forecast import forecast_engine, crop_recommendation

urlpatterns = [
    path("chat/", ai_chat),
    path("records/", get_records),
    path("upload-record/", UploadMedicalRecord),

    path("signal/", signal_handler),
    path("translate/", translate_handler),

    # NEW RANDOM CLIMATE ENGINE
    path("climate/", climate_forecast),

    # ML Climate / Crop Engines
    path("forecast/", forecast_engine),
    path("crop/", crop_recommendation),
    path("crop/", crop_recommendation, name="crop_recommendation"),

]

