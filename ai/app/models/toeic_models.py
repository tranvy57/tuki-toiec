"""
Pydantic models for test analysis and writing evaluation requests/responses.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


# ===== Test Analysis Models =====

class AnalyzeTestRequest(BaseModel):
    """Request model for test analysis."""
    test_data: Dict[str, Any] = Field(..., description="Test results data including scores, answers, questions")
    user_id: Optional[str] = Field(None, description="Optional user ID for personalization")


class TestSummary(BaseModel):
    """Test summary with scores and comment."""
    totalScore: int = Field(..., description="Total score (0-990)")
    listeningScore: int = Field(..., description="Listening score (0-495)")
    readingScore: int = Field(..., description="Reading score (0-495)")
    accuracy: str = Field(..., description="Overall accuracy percentage")
    comment: str = Field(..., description="General comment about the test")


class AnalyzeTestResponse(BaseModel):
    """Response model for test analysis."""
    summary: TestSummary
    weakSkills: List[str] = Field(default_factory=list, description="List of weak skills")
    mistakePatterns: List[str] = Field(default_factory=list, description="Common mistake patterns")
    recommendations: List[str] = Field(default_factory=list, description="Specific learning recommendations")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadata about personalization and context")


# ===== Writing Evaluation Models =====

class EvaluateWritingRequest(BaseModel):
    """Request model for writing evaluation."""
    type: str = Field(..., description="Writing type: email-response, opinion-essay, or describe-picture")
    content: str = Field(..., description="The writing content to evaluate")
    title: Optional[str] = Field(None, description="Title or subject of the writing")
    sampleAnswer: Optional[str] = Field(None, description="Sample answer for reference")
    topic: Optional[str] = Field(None, description="Topic or purpose of the writing")
    context: Optional[str] = Field(None, description="Context or situation")
    requiredLength: Optional[int] = Field(None, description="Required word count")
    timeLimit: Optional[int] = Field(None, description="Time limit in minutes")
    user_id: Optional[str] = Field(None, description="Optional user ID for personalization")


class ScoreBreakdown(BaseModel):
    """Breakdown of scores by criteria."""
    content: int = Field(..., description="Content score (0-100)")
    structure: int = Field(..., description="Structure score (0-100)")
    vocabulary: int = Field(..., description="Vocabulary score (0-100)")
    grammar: int = Field(..., description="Grammar score (0-100)")
    style: int = Field(..., description="Style score (0-100)")
    effectiveness: int = Field(..., description="Effectiveness score (0-100)")


class GrammarError(BaseModel):
    """Grammar error with correction."""
    type: str = Field(..., description="Type of grammar error")
    error: str = Field(..., description="The error text")
    correction: str = Field(..., description="Corrected version")
    explanation: str = Field(..., description="Explanation of the error")


class VocabularyImprovement(BaseModel):
    """Vocabulary improvement suggestion."""
    original: str = Field(..., description="Original word/phrase")
    suggested: str = Field(..., description="Suggested replacement")
    reason: str = Field(..., description="Reason for suggestion")


class VocabularyFeedback(BaseModel):
    """Vocabulary feedback with scores and improvements."""
    range: int = Field(..., description="Vocabulary range score (0-100)")
    accuracy: int = Field(..., description="Vocabulary accuracy score (0-100)")
    appropriateness: int = Field(..., description="Vocabulary appropriateness score (0-100)")
    improvements: List[VocabularyImprovement] = Field(default_factory=list)


class StructureAnalysis(BaseModel):
    """Structure analysis with scores and feedback."""
    organization: int = Field(..., description="Organization score (0-100)")
    flow: int = Field(..., description="Flow score (0-100)")
    transitions: int = Field(..., description="Transitions score (0-100)")
    feedback: str = Field(..., description="Detailed feedback on structure")


class EvaluateWritingResponse(BaseModel):
    """Response model for writing evaluation."""
    type: str = Field(..., description="Writing type")
    overallScore: int = Field(..., description="Overall score (0-100)")
    breakdown: ScoreBreakdown
    strengths: List[str] = Field(default_factory=list, description="Strengths of the writing")
    weaknesses: List[str] = Field(default_factory=list, description="Weaknesses of the writing")
    grammarErrors: List[GrammarError] = Field(default_factory=list)
    vocabularyFeedback: VocabularyFeedback
    structureAnalysis: StructureAnalysis
    improvementSuggestions: List[str] = Field(default_factory=list)
    rewrittenVersion: Optional[str] = Field(None, description="Optional rewritten version")
    estimatedTOEICScore: int = Field(..., description="Estimated TOEIC Writing score (0-200)")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadata about personalization and context")
