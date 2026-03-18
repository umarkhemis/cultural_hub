
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14

    REDIS_URL: str

    APP_NAME: str = "Cultural Hub API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    APP_ENV: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    CLOUDINARY_CLOUD_NAME: str | None = None
    CLOUDINARY_API_KEY: str | None = None
    CLOUDINARY_API_SECRET: str | None = None
    CLOUDINARY_UPLOAD_FOLDER: str = "cultural_hub"

    RATE_LIMIT_LOGIN_PER_MINUTE: int = 5
    RATE_LIMIT_REGISTER_PER_HOUR: int = 10

    FEED_CACHE_TTL_SECONDS: int = 60
    NOTIFICATIONS_CACHE_TTL_SECONDS: int = 30

    DEFAULT_CURRENCY: str = "UGX"

    FIRST_ADMIN_EMAIL: str | None = None
    FIRST_ADMIN_PASSWORD: str | None = None
    FIRST_ADMIN_NAME: str = "Platform Admin"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()












# from pydantic_settings import BaseSettings, SettingsConfigDict


# class Settings(BaseSettings):
#     DATABASE_URL: str
#     JWT_SECRET_KEY: str
#     JWT_ALGORITHM: str = "HS256"
#     ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
#     REFRESH_TOKEN_EXPIRE_DAYS: int = 14
#     REDIS_URL: str

#     APP_NAME: str = "Cultural Hub API"
#     APP_VERSION: str = "1.0.0"
#     API_V1_PREFIX: str = "/api/v1"
#     APP_ENV: str = "development"
#     DEBUG: bool = True

#     BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

#     LOG_LEVEL: str = "INFO"

#     RATE_LIMIT_LOGIN_PER_MINUTE: int = 5
#     RATE_LIMIT_REGISTER_PER_HOUR: int = 10

#     model_config = SettingsConfigDict(env_file=".env", extra="ignore")

#     @property
#     def cors_origins_list(self) -> list[str]:
#         return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]


# settings = Settings()

