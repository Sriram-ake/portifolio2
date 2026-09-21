"""Static portfolio content endpoints (profile, education, skills, projects, certs)."""

from __future__ import annotations

import re

from fastapi import APIRouter, HTTPException, Query

from .. import data
from ..schemas import (
    Certification,
    EducationItem,
    GitHubActivityResponse,
    GitHubReposResponse,
    Profile,
    Project,
    RepoCommitsResponse,
    SkillCategory,
)
from ..services import coding_service

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


@router.get("/github/repos", response_model=GitHubReposResponse)
async def github_repos(force: bool = Query(False, description="Bypass cache")) -> GitHubReposResponse:
    return await coding_service.get_repos(force=force)


@router.get("/github/activity", response_model=GitHubActivityResponse)
async def github_activity(
    force: bool = Query(False, description="Bypass cache"),
) -> GitHubActivityResponse:
    return await coding_service.get_activity(force=force)


# GitHub owner/repo names: letters, digits, hyphen, underscore, dot only.
_GH_NAME_RE = re.compile(r"^[A-Za-z0-9._-]{1,100}$")


@router.get("/github/repos/{owner}/{repo}/commits", response_model=RepoCommitsResponse)
async def github_repo_commits(
    owner: str, repo: str, force: bool = Query(False, description="Bypass cache")
) -> RepoCommitsResponse:
    # Guard the proxied path segments so nothing but a plain owner/repo reaches GitHub.
    if not _GH_NAME_RE.match(owner) or not _GH_NAME_RE.match(repo):
        raise HTTPException(status_code=400, detail="Invalid repository identifier.")
    return await coding_service.get_commits(owner, repo, force=force)
