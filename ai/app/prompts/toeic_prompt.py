class TOEICPrompt:
    def __init__(self):
        # Basic TOEIC tutor prompt - short and friendly English responses
        self.basic_toeic_prompt = """
You are a friendly TOEIC tutor who gives short, encouraging responses in English.

User Question: {user_input}

Context Information:
{context}

Instructions:
- Respond in 2-3 sentences maximum
- Be friendly and encouraging
- Use simple, clear English
- Focus on helping with TOEIC preparation
- If no context is available, give general TOEIC advice
"""

        # Personalized TOEIC prompt with user profile
        self.personalized_toeic_prompt = """
You are a friendly TOEIC tutor who adapts to each student's learning style.

Student Information:
- Name: {user_name}
- Learning Style: {learning_style}
- Level: {difficulty_level}
- Personality: {personality_type}
{skill_focus}
{learning_adaptation}

User Question: {user_input}

Context Information:
{context}

Instructions:
- Respond in 2-3 sentences maximum in English
- Be {personality_style}
- Adapt to their {learning_style} learning style
- Keep it simple and encouraging
- Address them by name when appropriate
"""

        # Style mappings for personality types
        self.personality_styles = {
            "encouraging": "positive and supportive",
            "direct": "clear and straightforward", 
            "analytical": "detailed and thorough",
            "creative": "engaging and imaginative"
        }
        
        # Learning style adaptations
        self.learning_adaptations = {
            "visual": "Suggest using charts, diagrams, or visual aids when helpful.",
            "auditory": "Mention listening practice or pronunciation tips when relevant.",
            "reading": "Focus on reading strategies and text analysis techniques.",
            "kinesthetic": "Recommend hands-on practice activities when possible."
        }
    
    def get_basic_prompt(self, user_input: str, context: str) -> str:
        """Get basic TOEIC prompt without personalization"""
        return self.basic_toeic_prompt.format(
            user_input=user_input,
            context=context
        )
    
    def get_personalized_prompt(self, user_input: str, context: str, user_profile: any, personalization_ctx: dict) -> str:
        """Get personalized TOEIC prompt with user profile"""
        print("Personalization context:", user_profile)
        user_name = user_profile.display_name if user_profile and hasattr(user_profile, 'display_name') else "Student"
        learning_style = personalization_ctx.get("learning_style", "balanced")
        difficulty_level = personalization_ctx.get("difficulty_level", "intermediate")
        personality_type = personalization_ctx.get("personality", "encouraging")
        skill_focus = personalization_ctx.get("skill_focus", [])
        
        # Get personality style
        personality_style = self.personality_styles.get(personality_type, "friendly and helpful")
        
        # Get learning adaptation
        learning_adaptation = self.learning_adaptations.get(learning_style, "Use appropriate teaching methods.")
        
        # Format skill focus
        skill_focus_text = ""
        if skill_focus:
            skill_focus_text = f"\n- Areas to focus on: {', '.join(skill_focus)}"
        
        return self.personalized_toeic_prompt.format(
            user_name=user_name,
            learning_style=learning_style,
            difficulty_level=difficulty_level,
            personality_type=personality_type,
            skill_focus=skill_focus_text,
            learning_adaptation=learning_adaptation,
            user_input=user_input,
            context=context,
            personality_style=personality_style
        )
