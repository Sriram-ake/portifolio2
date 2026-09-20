"""Static portfolio content endpoints (profile, education, skills, projects, certs)."""

from __future__ import annotations

from fastapi import APIRouter

from .. import data
from ..schemas import (
    Certification,
    EducationItem,
    Profile,
    Project,
    SkillCategory,
)

router = APIRouter(tags=["content"])


@router.get("/profile", response_model=Profile)
async def get_profile() -> Profile:
    return data.PROFILE


@router.get("/education", response_model=list[EducationItem])
async def get_education() -> list[EducationItem]:
    return data.EDUCATION


@router.get("/skills", response_model=list[SkillCategory])
async def get_skills() -> list[SkillCategory]:
    return data.SKILLS


@router.get("/projects", response_model=list[Project])
async def get_projects() -> list[Project]:
    return data.PROJECTS


@router.get("/certifications", response_model=list[Certification])
async def get_certifications() -> list[Certification]:
    return data.CERTIFICATIONS
