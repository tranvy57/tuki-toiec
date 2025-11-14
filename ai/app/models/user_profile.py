"""
Simple user profile model using existing database structure
"""
from typing import Dict, Optional, List
from enum import Enum
from dataclasses import dataclass
from app.db.models.models import Users, UserProgress, Skills
from sqlalchemy.orm import Session


class LearningStyle(Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    READING = "reading"
    KINESTHETIC = "kinesthetic"


class LearningGoal(Enum):
    IMPROVE_SCORE = "improve_score"
    BASIC_COMMUNICATION = "basic_communication"
    BUSINESS_ENGLISH = "business_english"
    EXAM_PREPARATION = "exam_preparation"


class PersonalityType(Enum):
    INTROVERT = "introvert"
    EXTROVERT = "extrovert"
    ANALYTICAL = "analytical"
    CREATIVE = "creative"


@dataclass
class SimpleUserProfile:
    """Simple user profile using existing database data"""
    user_id: str
    display_name: str
    learning_style: LearningStyle = LearningStyle.VISUAL
    learning_goal: LearningGoal = LearningGoal.IMPROVE_SCORE
    personality_type: PersonalityType = PersonalityType.ANALYTICAL
    skill_levels: Dict[str, float] = None
    total_conversations: int = 0
    
    def __post_init__(self):
        if self.skill_levels is None:
            self.skill_levels = {}


def get_user_profile_from_db(db: Session, user_id: str) -> Optional[SimpleUserProfile]:
    """Get user profile from existing database"""
    try:
        # Get user basic info
        user = db.query(Users).filter(Users.id == user_id).first()
        if not user:
            return None
        
        # Get user progress for skills
        user_progress = db.query(UserProgress).filter(
            UserProgress.user_id == user_id
        ).all()
        
        skill_levels = {}
        for progress in user_progress:
            if progress.skill and progress.skill.name:
                # Convert progress score to 0-1 scale
                skill_levels[progress.skill.name] = min(progress.score / 100.0, 1.0)
        
        # Determine learning style based on existing data
        learning_style = _infer_learning_style(skill_levels)
        
        # Determine personality type 
        personality_type = _infer_personality_type(skill_levels)
        
        return SimpleUserProfile(
            user_id=str(user.id),
            display_name=user.display_name,
            learning_style=learning_style,
            personality_type=personality_type,
            skill_levels=skill_levels,
            total_conversations=len(user_progress)  # Use progress count as conversation proxy
        )
        
    except Exception as e:
        print(f"Error getting user profile: {e}")
        return None


def _infer_learning_style(skill_levels: Dict[str, float]) -> LearningStyle:
    """Infer learning style from skill patterns"""
    if not skill_levels:
        return LearningStyle.VISUAL
    
    # Simple heuristic based on skill strengths
    reading_skills = ["reading", "vocabulary", "grammar"]
    listening_skills = ["listening", "pronunciation"]
    
    reading_avg = sum(skill_levels.get(skill, 0) for skill in reading_skills) / len(reading_skills)
    listening_avg = sum(skill_levels.get(skill, 0) for skill in listening_skills) / len(listening_skills)
    
    if listening_avg > reading_avg:
        return LearningStyle.AUDITORY
    else:
        return LearningStyle.READING


def _infer_personality_type(skill_levels: Dict[str, float]) -> PersonalityType:
    """Infer personality type from skill patterns"""
    if not skill_levels:
        return PersonalityType.ANALYTICAL
    
    # Simple heuristic
    grammar_score = skill_levels.get("grammar", 0)
    speaking_score = skill_levels.get("speaking", 0)
    
    if grammar_score > speaking_score:
        return PersonalityType.ANALYTICAL
    else:
        return PersonalityType.CREATIVE


def get_personalization_context(profile: SimpleUserProfile) -> Dict[str, str]:
    """Get personalization context for chat"""
    return {
        "learning_style": profile.learning_style.value,
        "personality_type": profile.personality_type.value,
        "skill_focus": _get_skill_focus(profile.skill_levels),
        "learning_level": _get_learning_level(profile.skill_levels)
    }


def _get_skill_focus(skill_levels: Dict[str, float]) -> str:
    """Get skill that needs most focus"""
    if not skill_levels:
        return "general"
    
    # Find lowest scoring skill
    min_skill = min(skill_levels.items(), key=lambda x: x[1])
    return min_skill[0]


def _get_learning_level(skill_levels: Dict[str, float]) -> str:
    """Get overall learning level"""
    if not skill_levels:
        return "beginner"
    
    avg_score = sum(skill_levels.values()) / len(skill_levels)
    
    if avg_score < 0.3:
        return "beginner"
    elif avg_score < 0.7:
        return "intermediate"
    else:
        return "advanced"