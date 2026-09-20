"""
Portfolio content — the backend's source of truth for profile data.

Mirrors the frontend data files. Only verified information is included; no
projects, certifications, or achievements are invented.
"""

from __future__ import annotations

from .schemas import (
    Certification,
    EducationItem,
    Profile,
    Project,
    Skill,
    SkillCategory,
    SocialLinks,
)

SOCIAL = SocialLinks(
    github="https://github.com/Sriram-ake",
    linkedin="https://www.linkedin.com/in/sriram-ake-23514633/",
    leetcode="https://leetcode.com/u/akesriram/",
    codechef="https://www.codechef.com/users/akesriram_2007",
    geeksforgeeks="https://www.geeksforgeeks.org/user/akesriram/",
    hackerrank="https://www.hackerrank.com/profile/akesurekha",
    codeforces="https://codeforces.com/profile/Sriram_2007",
    instagram=None,
)

PROFILE = Profile(
    name="Ake Sri Ram",
    role="Information Technology Student",
    taglines=["Building.", "Learning.", "Solving.", "Creating."],
    location="Surampalem, India",
    college="Aditya College of Engineering and Technology",
    branch="Information Technology",
    year="3rd Year",
    cgpa="8.36",
    interests=["Listening to music"],
    email="akesurekha@gmail.com",
    summary=(
        "Ake Sri Ram is a B.Tech third-year Information Technology student at Aditya "
        "College of Engineering and Technology, Surampalem. He focuses on software "
        "development, problem solving, and backend engineering, and enjoys turning "
        "ideas into practical, well-built technology projects."
    ),
    social=SOCIAL,
)

EDUCATION: list[EducationItem] = [
    EducationItem(
        id="btech",
        level="B.Tech — Information Technology",
        institution="Aditya College of Engineering and Technology",
        location="Surampalem",
        detail="3rd Year",
        score="CGPA 8.36",
    ),
    EducationItem(id="intermediate", level="Intermediate", institution="Gamyam Junior College"),
    EducationItem(
        id="ssc",
        level="SSC",
        institution="S P P P R Z P High School",
        location="Pandalapaka",
    ),
]

SKILLS: list[SkillCategory] = [
    SkillCategory(
        id="programming",
        title="Programming",
        skills=[
            Skill(name="Java", level="Working Knowledge"),
            Skill(name="Python", level="Working Knowledge"),
            Skill(name="C", level="Familiar"),
            Skill(name="C++", level="Familiar"),
        ],
    ),
    SkillCategory(
        id="frontend",
        title="Frontend",
        skills=[
            Skill(name="HTML", level="Working Knowledge"),
            Skill(name="CSS", level="Working Knowledge"),
            Skill(name="JavaScript", level="Familiar"),
            Skill(name="React", level="Learning"),
            Skill(name="TypeScript", level="Learning"),
        ],
    ),
    SkillCategory(
        id="backend",
        title="Backend",
        skills=[
            Skill(name="Python", level="Working Knowledge"),
            Skill(name="FastAPI", level="Learning"),
            Skill(name="Spring Boot", level="Learning"),
        ],
    ),
    SkillCategory(
        id="database",
        title="Database",
        skills=[
            Skill(name="SQL", level="Working Knowledge"),
            Skill(name="MySQL", level="Familiar"),
            Skill(name="PostgreSQL", level="Learning"),
        ],
    ),
    SkillCategory(
        id="tools",
        title="Tools",
        skills=[
            Skill(name="Git", level="Working Knowledge"),
            Skill(name="GitHub", level="Working Knowledge"),
            Skill(name="IntelliJ IDEA", level="Familiar"),
            Skill(name="VS Code", level="Working Knowledge"),
        ],
    ),
]

# No invented content. Populate with real data when available.
PROJECTS: list[Project] = []
CERTIFICATIONS: list[Certification] = []
