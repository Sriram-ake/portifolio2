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
    languages=["English", "Telugu", "Hindi (Basic)"],
    email="akesurekha@gmail.com",
    summary=(
        "Ake Sri Ram builds ideas into working software. He is an Information Technology "
        "student at Aditya College of Engineering and Technology, focused on Java, "
        "Spring Boot, full-stack development, DSA, and AI. He learns by building real "
        "projects, solving problems, and turning concepts into usable products."
    ),
    social=SOCIAL,
)

EDUCATION: list[EducationItem] = [
    EducationItem(
        id="btech",
        level="B.Tech — Information Technology",
        institution="Aditya College of Engineering and Technology",
        location="Surampalem",
        detail="3rd Year · 2024 – Present",
        score="CGPA 8.36",
    ),
    EducationItem(
        id="intermediate",
        level="Intermediate — MPC",
        institution="Gamyam Junior College",
        detail="2022 – 2024",
        score="93.8%",
    ),
    EducationItem(
        id="ssc",
        level="SSC — High School",
        institution="S P P P R Z P High School",
        location="Pandalapaka",
        detail="2017 – 2022",
        score="78.7%",
    ),
]

SKILLS: list[SkillCategory] = [
    SkillCategory(
        id="programming",
        title="Programming Languages",
        skills=[
            Skill(name="C", level="Working Knowledge"),
            Skill(name="Python", level="Working Knowledge"),
            Skill(name="Java", level="Working Knowledge"),
            Skill(name="C++", level="Familiar"),
        ],
    ),
    SkillCategory(
        id="frontend",
        title="Frontend",
        skills=[
            Skill(name="HTML", level="Working Knowledge"),
            Skill(name="CSS", level="Working Knowledge"),
            Skill(name="JavaScript", level="Working Knowledge"),
        ],
    ),
    SkillCategory(
        id="backend",
        title="Backend",
        skills=[
            Skill(name="Spring Boot", level="Working Knowledge"),
            Skill(name="REST APIs", level="Working Knowledge"),
            Skill(name="Django", level="Familiar"),
        ],
    ),
    SkillCategory(
        id="database",
        title="Databases",
        skills=[
            Skill(name="MySQL", level="Working Knowledge"),
            Skill(name="Google Sheets", level="Familiar"),
        ],
    ),
    SkillCategory(
        id="tools",
        title="Tools",
        skills=[
            Skill(name="Git", level="Working Knowledge"),
            Skill(name="GitHub", level="Working Knowledge"),
            Skill(name="IntelliJ IDEA", level="Working Knowledge"),
            Skill(name="VS Code", level="Working Knowledge"),
        ],
    ),
]

# Real projects (github.com/Sriram-ake). Links are null where no public repo
# or live demo exists yet — never fabricated.
PROJECTS: list[Project] = [
    Project(
        id="calculator",
        title="Calculator",
        description="A responsive calculator web app with a clean, minimal UI.",
        technologies=["JavaScript", "HTML", "CSS"],
        featured=True,
        category="Web",
        year="2025",
        github_url="https://github.com/Sriram-ake/Calculator",
        live_url="https://sriram-ake.github.io/Calculator/",
    ),
    Project(
        id="snake-game",
        title="Snake Game",
        description="The classic Snake game built in Java with a Swing GUI.",
        technologies=["Java", "Swing"],
        featured=True,
        category="Game",
        year="2025",
        github_url="https://github.com/Sriram-ake/projects/tree/main/snake_game",
        live_url=None,
    ),
    Project(
        id="neural-flight-fly",
        title="Neural Flight Fly",
        description="A Flappy Bird-inspired game exploring neural-network-driven flight (in progress).",
        technologies=["Python"],
        featured=False,
        category="AI / Game",
        year="2026",
        github_url="https://github.com/Sriram-ake/flappy-neural-flight",
    ),
]

# Certifications from the resume (verified titles/issuers).
CERTIFICATIONS: list[Certification] = [
    Certification(
        id="cisco-c",
        title="C Programming",
        issuer="Cisco",
        issue_date="",
        category="Programming",
    ),
    Certification(
        id="oracle-ai",
        title="Artificial Intelligence Certification",
        issuer="Oracle",
        issue_date="",
        category="AI",
    ),
    Certification(
        id="html-css",
        title="HTML and CSS",
        issuer="",
        issue_date="",
        category="Web",
    ),
]

# Achievements from the resume (verified). Used to ground the AI assistant.
ACHIEVEMENTS: list[str] = [
    "4-star rating in C on HackerRank",
    "3-star rating in Python on HackerRank",
    "3-star rating in Java on HackerRank",
    "93.8% aggregate in Intermediate (MPC)",
    "78.7% aggregate in SSC (10th grade)",
    "Regularly practices data structures and algorithmic problem solving",
]
