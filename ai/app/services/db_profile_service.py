"""
Database service để lấy user profile từ existing models
"""

from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from app.db.models.models import Users, UserProgress, Skills
from app.models.user_profile import SimpleUserProfile, get_user_profile_from_db


class DatabaseProfileService:
    """Service để lấy user data từ database hiện có"""
    
    def __init__(self, db_session=None):
        if db_session is None:
            try:
                from app.db.session import get_db_session
                self.db = get_db_session()
            except Exception as e:
                print(f"Warning: Could not create database session: {e}")
                self.db = None
        else:
            self.db = db_session
            
        # Validate database session
        if self.db and (isinstance(self.db, dict) or not hasattr(self.db, 'query')):
            print(f"Warning: Invalid database session type: {type(self.db)}")
            self.db = None
    
    def get_user_with_progress(self, user_id: str) -> Optional[SimpleUserProfile]:
        """Lấy user và progress từ database hiện có"""
        try:
            if not self.db:
                print("No database session available")
                return None
                
            # Check if db has query method
            if not hasattr(self.db, 'query'):
                print(f"Database object does not have query method. Type: {type(self.db)}")
                return None
                
            # Get user data
            user = self.db.query(Users).filter(Users.id == user_id).first()
            if not user:
                return None
            
            # Get user progress with skills
            progress_data = (
                self.db.query(UserProgress, Skills)
                .join(Skills, UserProgress.skill_id == Skills.id)
                .filter(UserProgress.user_id == user_id)
                .all()
            )
            
            # Convert to SimpleUserProfile directly
            skill_levels = {}
            for progress, skill in progress_data:
                if skill and skill.name:
                    # Convert score to 0-1 scale (assuming progress.proficiency is 0-100)
                    skill_levels[skill.name] = min(progress.proficiency / 100.0, 1.0)
            
            # Create SimpleUserProfile from data
            from app.models.user_profile import SimpleUserProfile, LearningStyle, PersonalityType, LearningGoal
            
            # Infer learning style and personality from skill patterns
            learning_style = self._infer_learning_style(skill_levels)
            personality_type = self._infer_personality_type(skill_levels)
            
            profile = SimpleUserProfile(
                user_id=str(user.id),
                display_name=user.display_name,
                learning_style=learning_style,
                personality_type=personality_type,
                skill_levels=skill_levels,
                total_conversations=len(progress_data)  # Use progress count as conversation proxy
            )
            
            return profile
            
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return None
    
    def _infer_learning_style(self, skill_levels: Dict[str, float]):
        """Infer learning style from skill patterns"""
        from app.models.user_profile import LearningStyle
        
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
    
    def _infer_personality_type(self, skill_levels: Dict[str, float]):
        """Infer personality type from skill patterns"""
        from app.models.user_profile import PersonalityType
        
        if not skill_levels:
            return PersonalityType.ANALYTICAL
        
        # Simple heuristic
        grammar_score = skill_levels.get("grammar", 0)
        speaking_score = skill_levels.get("speaking", 0)
        
        if grammar_score > speaking_score:
            return PersonalityType.ANALYTICAL
        else:
            return PersonalityType.CREATIVE
            
    def update_user_progress(self, user_id: str, skill_updates: Dict[str, float]) -> bool:
        """Update user progress cho skills"""
        try:
            for skill_name, new_proficiency in skill_updates.items():
                # Find skill by name
                skill = self.db.query(Skills).filter(Skills.name == skill_name).first()
                if not skill:
                    continue
                
                # Update or create progress
                progress = (
                    self.db.query(UserProgress)
                    .filter(
                        UserProgress.user_id == user_id,
                        UserProgress.skill_id == skill.id
                    )
                    .first()
                )
                
                if progress:
                    progress.proficiency = new_proficiency
                else:
                    new_progress = UserProgress(
                        user_id=user_id,
                        skill_id=skill.id,
                        proficiency=new_proficiency
                    )
                    self.db.add(new_progress)
            
            self.db.commit()
            return True
            
        except Exception as e:
            self.db.rollback()
            print(f"Error updating progress: {e}")
            return False