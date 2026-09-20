"""Coding statistics endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from ..schemas import CodingPlatformStats, CodingSummary, Heatmap
from ..services import coding_service

router = APIRouter(prefix="/coding", tags=["coding"])

_VALID = {"github", "leetcode", "codechef", "hackerrank", "geeksforgeeks", "codeforces"}
_HEATMAP_VALID = {"github", "leetcode"}


@router.get("", response_model=CodingSummary)
async def coding_summary(force: bool = Query(False, description="Bypass cache")) -> CodingSummary:
    return await coding_service.get_summary(force=force)


@router.get("/{platform}/heatmap", response_model=Heatmap)
async def coding_heatmap(
    platform: str, force: bool = Query(False, description="Bypass cache")
) -> Heatmap:
    if platform not in _HEATMAP_VALID:
        raise HTTPException(
            status_code=404, detail=f"No activity heatmap for platform '{platform}'."
        )
    return await coding_service.get_heatmap(platform, force=force)


@router.get("/{platform}", response_model=CodingPlatformStats)
async def coding_platform(
    platform: str, force: bool = Query(False, description="Bypass cache")
) -> CodingPlatformStats:
    if platform not in _VALID:
        raise HTTPException(status_code=404, detail=f"Unknown platform '{platform}'.")
    return await coding_service.get_platform(platform, force=force)
