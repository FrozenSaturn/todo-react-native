from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "GrowEasy"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/groweasy"
    SECRET_KEY: str = "dev_secret_key_change_this_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
