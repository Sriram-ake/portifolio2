"""Application configuration loaded from environment variables."""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central settings. All secrets come from the environment / .env file."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- General ---
    app_name: str = "Ake Sri Ram Portfolio API"
    frontend_url: str = "http://localhost:5173"

    # --- Coding platform usernames (verified) ---
    github_username: str = "Sriram-ake"
    leetcode_username: str = "akesriram"
    codechef_username: str = "akesriram_2007"
    hackerrank_username: str = "akesurekha"
    geeksforgeeks_username: str = "akesriram"
    codeforces_username: str = "Sriram_2007"

    # Optional GitHub token for higher rate limits (read-only, public data).
    github_token: str | None = None

    # Cache TTL for coding statistics, in seconds.
    coding_cache_ttl: int = 60 * 60  # 1 hour

    # --- NVIDIA NIM (chat) ---
    nvidia_nim_api_key: str | None = None
    nvidia_nim_model: str = "meta/llama-3.1-8b-instruct"
    nvidia_nim_base_url: str = "https://integrate.api.nvidia.com/v1"

    # --- Brevo (contact email) ---
    brevo_api_key: str | None = None
    brevo_sender_email: str | None = None
    brevo_sender_name: str = "Portfolio Contact Form"
    contact_receiver_email: str | None = None

    # --- Contact rate limiting ---
    contact_rate_limit: int = 5  # max submissions
    contact_rate_window: int = 60 * 60  # per hour, per IP

    @property
    def cors_origins(self) -> list[str]:
        origins = {self.frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"}
        return [o for o in origins if o]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
