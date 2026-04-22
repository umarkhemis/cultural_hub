
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    
    PLATFORM_BOOKING_FEE_PERCENT: float = 0.15
    BOOKING_RESERVATION_MINUTES: int = 15
    DEFAULT_CURRENCY: str = "UGX"

    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14



    REDIS_URL: str | None = None

    APP_NAME: str = "Cultural Hub API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    APP_ENV: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    BACKEND_CORS_ORIGINS: str = "https://cultural-hub-psi.vercel.app,http://localhost:3000,http://127.0.0.1:3000"

    CLOUDINARY_CLOUD_NAME: str | None = None
    CLOUDINARY_API_KEY: str | None = None
    CLOUDINARY_API_SECRET: str | None = None
    CLOUDINARY_UPLOAD_FOLDER: str = "cultural_hub"

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "GOOGLE_REDIRECT_URI=https://cultural-hub.onrender.com/api/v1/auth/google/callback"
    # GOOGLE_REDIRECT_URI: str = "GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback"

    GOOGLE_TRANSLATE_API_KEY: str = ""

    FRONTEND_URL: str = "https://cultural-hub-psi.vercel.app"
    # FRONTEND_URL: str = "http://localhost:3000"
    

    GOOGLE_OAUTH_STATE_TTL_SECONDS: int =600
    GOOGLE_OAUTH_EXCHANGE_CODE_TTL_SECONDS: int =120

    RATE_LIMIT_LOGIN_PER_MINUTE: int = 5
    RATE_LIMIT_REGISTER_PER_HOUR: int = 10

    FEED_CACHE_TTL_SECONDS: int = 60
    NOTIFICATIONS_CACHE_TTL_SECONDS: int = 30

    DEFAULT_CURRENCY: str = "UGX"

    FIRST_ADMIN_EMAIL: str | None = None
    FIRST_ADMIN_PASSWORD: str | None = None
    FIRST_ADMIN_NAME: str = "Platform Admin"

    MTN_MOMO_BASE_URL: str = "https://sandbox.momodeveloper.mtn.com"
    MTN_MOMO_SUBSCRIPTION_KEY: str = ""
    MTN_MOMO_API_USER: str = ""
    MTN_MOMO_API_KEY: str = ""
    MTN_MOMO_ENVIRONMENT: str = "sandbox"

    # Flutterwave
    FLUTTERWAVE_SECRET_KEY: str = ""
    FLUTTERWAVE_PUBLIC_KEY: str = ""
    FLUTTERWAVE_WEBHOOK_SECRET: str = ""

    PAYMENT_CALLBACK_URL: str = ""



    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]
    



settings = Settings()





