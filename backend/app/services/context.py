"""Builds the grounded portfolio context for the AI assistant.

The context is assembled strictly from verified portfolio data so the model
cannot invent facts. A deterministic, rule-based fallback responder is also
provided for when NVIDIA NIM is not configured — it answers common questions
directly from the same data (and says so when it lacks information).
"""

from __future__ import annotations

from .. import data


def _skills_text() -> str:
    lines = []
    for cat in data.SKILLS:
        skills = ", ".join(f"{s.name} ({s.level})" for s in cat.skills)
        lines.append(f"- {cat.title}: {skills}")
    return "\n".join(lines)


def _education_text() -> str:
    lines = []
    for e in data.EDUCATION:
        bits = [e.level, e.institution]
        if e.location:
            bits.append(e.location)
        if e.detail:
            bits.append(e.detail)
        if e.score:
            bits.append(e.score)
        lines.append("- " + " · ".join(bits))
    return "\n".join(lines)


def _social_text() -> str:
    s = data.SOCIAL
    entries = {
        "GitHub": s.github,
        "LinkedIn": s.linkedin,
        "LeetCode": s.leetcode,
        "CodeChef": s.codechef,
        "GeeksforGeeks": s.geeksforgeeks,
        "HackerRank": s.hackerrank,
        "Codeforces": s.codeforces,
    }
    return "\n".join(f"- {k}: {v}" for k, v in entries.items())


def build_context() -> str:
    p = data.PROFILE
    projects = (
        "\n".join(f"- {pr.title}: {pr.description}" for pr in data.PROJECTS)
        if data.PROJECTS
        else "No projects have been published on the portfolio yet."
    )
    certs = (
        "\n".join(f"- {c.title} — {c.issuer}" for c in data.CERTIFICATIONS)
        if data.CERTIFICATIONS
        else "No certifications have been published on the portfolio yet."
    )
    return f"""PROFILE
Name: {p.name}
Role: {p.role}
Education: {p.branch}, {p.year} at {p.college}, {p.location}
CGPA: {p.cgpa}
Interests: {", ".join(p.interests)}
Email: {p.email}
Summary: {p.summary}

EDUCATION
{_education_text()}

SKILLS
{_skills_text()}

PROJECTS
{projects}

CERTIFICATIONS
{certs}

CODING PLATFORMS & SOCIAL LINKS
{_social_text()}
"""


SYSTEM_PROMPT = (
    "You are the portfolio assistant for Ake Sri Ram (also called Sri Ram). "
    "Answer questions about him using ONLY the portfolio context provided below. "
    "Be concise, friendly, and professional. "
    "If the information needed is not in the context, say: "
    "\"I don't have that information in Sri Ram's portfolio yet.\" "
    "Never invent projects, certifications, statistics, achievements, or personal details. "
    "You may format answers with simple markdown.\n\n"
    "PORTFOLIO CONTEXT:\n" + build_context()
)


# --- Rule-based fallback (used when NVIDIA NIM is not configured) ---
def fallback_answer(question: str) -> str:
    q = question.lower()
    p = data.PROFILE

    def has(*words: str) -> bool:
        return any(w in q for w in words)

    if has("hello", "hi ", "hey", "how are you") and len(q) < 20:
        return (
            f"Hi! I'm {p.name}'s portfolio assistant. Ask me about his education, skills, "
            "coding profiles, or how to reach him."
        )
    if has("who", "about", "yourself", "introduce"):
        return p.summary
    if has("study", "college", "education", "branch", "cgpa", "degree", "university"):
        return (
            f"{p.name} is pursuing a {p.branch} B.Tech ({p.year}) at {p.college}, {p.location}, "
            f"with a current CGPA of {p.cgpa}."
        )
    if has("learning", "currently learn", "improving", "getting better"):
        learning = [
            s.name for cat in data.SKILLS for s in cat.skills if s.level == "Learning"
        ]
        if learning:
            return "He's currently learning: " + ", ".join(dict.fromkeys(learning)) + "."
    if has("skill", "technolog", "tech stack", "language", "know", "programming", "stack"):
        return "Here are the technologies he works with:\n\n" + _skills_text()
    if has("where", "location", "based", "from", "live"):
        return f"{p.name} is based in {p.location}, studying at {p.college}."
    if has("project"):
        if data.PROJECTS:
            return "Here are his projects:\n\n" + "\n".join(
                f"- **{pr.title}** — {pr.description}" for pr in data.PROJECTS
            )
        return "There are no projects published on the portfolio yet — they'll appear here as they're completed."
    if has("certificat", "credential"):
        if data.CERTIFICATIONS:
            return "Certifications:\n\n" + "\n".join(
                f"- {c.title} — {c.issuer}" for c in data.CERTIFICATIONS
            )
        return "No certifications have been published on the portfolio yet."
    if has("contact", "email", "reach", "hire", "connect"):
        return f"You can reach {p.name} by email at **{p.email}**, or via the contact form on this site."
    if has("github"):
        return f"His GitHub profile: {p.social.github}"
    if has("leetcode"):
        return f"His LeetCode profile: {p.social.leetcode}"
    if has("codechef"):
        return f"His CodeChef profile: {p.social.codechef}"
    if has("codeforces"):
        return f"His Codeforces profile: {p.social.codeforces}"
    if has("hackerrank"):
        return f"His HackerRank profile: {p.social.hackerrank}"
    if has("geeksforgeeks", "gfg"):
        return f"His GeeksforGeeks profile: {p.social.geeksforgeeks}"
    if has("linkedin"):
        return f"His LinkedIn profile: {p.social.linkedin}"
    if has("coding", "platform", "competitive"):
        return "He's active on these coding platforms:\n\n" + _social_text()
    if has("interest", "hobby", "music"):
        return f"Outside of coding, {p.name} enjoys {', '.join(p.interests).lower()}."

    return (
        "I don't have that information in Sri Ram's portfolio yet. "
        "Try asking about his education, skills, coding platforms, or how to contact him."
    )
