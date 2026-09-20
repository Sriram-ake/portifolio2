"""Pydantic schemas for API requests and responses."""

from __future__ import annotations

from typing import Literal

import re

from pydantic import BaseModel, Field, field_validator

_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


# --- Content ---
class SocialLinks(BaseModel):
    github: str
    linkedin: str
    leetcode: str
    codechef: str
    geeksforgeeks: str
    hackerrank: str
    codeforces: str
    codolio: str | None = None
    instagram: str | None = None


class Profile(BaseModel):
    name: str
    role: str
    taglines: list[str]
    location: str
    college: str
    branch: str
    year: str
    cgpa: str
    interests: list[str]
    languages: list[str] = []
    email: str
    summary: str
    social: SocialLinks


class EducationItem(BaseModel):
    id: str
    level: str
    institution: str
    location: str | None = None
    detail: str | None = None
    score: str | None = None


class Skill(BaseModel):
    name: str
    level: Literal["Learning", "Familiar", "Working Knowledge"]


class SkillCategory(BaseModel):
    id: str
    title: str
    skills: list[Skill]


class Project(BaseModel):
    id: str
    title: str
    description: str
    technologies: list[str]
    featured: bool = False
    category: str | None = None
    year: str | None = None
    github_url: str | None = None
    live_url: str | None = None


class Certification(BaseModel):
    id: str
    title: str
    issuer: str
    issue_date: str
    category: str
    credential_url: str | None = None


# --- Coding ---
class CodingStatItem(BaseModel):
    label: str
    value: str | int


class CodingBreakdownItem(BaseModel):
    name: str
    value: int


class CodingPlatformStats(BaseModel):
    platform: str
    display_name: str = Field(serialization_alias="displayName")
    profile_url: str = Field(serialization_alias="profileUrl")
    username: str
    status: Literal["ok", "unavailable", "error"]
    updated_at: str | None = Field(default=None, serialization_alias="updatedAt")
    stats: list[CodingStatItem] = []
    breakdown: list[CodingBreakdownItem] | None = None
    message: str | None = None

    model_config = {"populate_by_name": True}


class CodingSummary(BaseModel):
    platforms: list[CodingPlatformStats]
    updated_at: str | None = Field(default=None, serialization_alias="updatedAt")

    model_config = {"populate_by_name": True}


class GitHubRepo(BaseModel):
    name: str
    description: str | None = None
    language: str | None = None
    url: str
    homepage: str | None = None
    stars: int = 0
    forks: int = 0
    updated_at: str | None = Field(default=None, serialization_alias="updatedAt")

    model_config = {"populate_by_name": True}


class GitHubReposResponse(BaseModel):
    status: Literal["ok", "unavailable", "error"]
    repos: list[GitHubRepo] = []
    updated_at: str | None = Field(default=None, serialization_alias="updatedAt")
    message: str | None = None

    model_config = {"populate_by_name": True}


class HeatmapDay(BaseModel):
    date: str  # YYYY-MM-DD
    count: int
    level: int  # 0-4 intensity bucket


class Heatmap(BaseModel):
    platform: str
    display_name: str = Field(serialization_alias="displayName")
    profile_url: str = Field(serialization_alias="profileUrl")
    status: Literal["ok", "unavailable", "error"]
    total: int = 0
    days: list[HeatmapDay] = []
    updated_at: str | None = Field(default=None, serialization_alias="updatedAt")
    message: str | None = None

    model_config = {"populate_by_name": True}


# --- Chat ---
class ChatMessageIn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: list[ChatMessageIn] = Field(min_length=1, max_length=40)


# --- Contact ---
class ContactRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=254)
    subject: str = Field(min_length=1, max_length=150)
    message: str = Field(min_length=10, max_length=2000)
    website: str | None = Field(default=None, max_length=0)  # honeypot: must be empty

    @field_validator("name", "subject", "message")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be blank")
        return v.strip()

    @field_validator("email")
    @classmethod
    def valid_email(cls, v: str) -> str:
        v = v.strip()
        if not _EMAIL_RE.match(v):
            raise ValueError("Invalid email address")
        return v


class ContactResponse(BaseModel):
    ok: bool
    message: str
