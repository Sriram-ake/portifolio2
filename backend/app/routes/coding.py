"""Coding statistics endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from ..schemas import CodingPlatformStats, CodingSummary
from ..services import coding_service

router = APIRouter(prefix="/coding", tags=["coding"])

_VALID = {"github", "leetcode", "codechef", "hackerrank", "geeksforgeeks", "codeforces"}


@router.get("", response_model=CodingSummary)
async def coding_summary(force: bool = Query(False, description="Bypass cache")) -> CodingSummary:
    return await coding_service.get_summary(force=force)


@router.get("/{platform}", response_model=CodingPlatformStats)
async def coding_platform(
    platform: str, force: bool = Query(False, description="Bypass cache")
) -> CodingPlatformStats:
    if platform not in _VALID:
        raise HTTPException(status_code=404, detail=f"Unknown platform '{platform}'.")
    return await coding_service.get_platform(platform, force=force)
