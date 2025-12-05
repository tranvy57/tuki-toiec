from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from enum import Enum


class CrawlStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"


class PipelineStep(BaseModel):
    key: str
    title: str
    description: str
    duration_ms: int = Field(default=0, alias="durationMs")
    status: CrawlStatus
    entities: Optional[Dict[str, int]] = None

    class Config:
        populate_by_name = True


class PartStat(BaseModel):
    part: int
    questions: int
    groups: int
    difficulty: str


class SkillStat(BaseModel):
    name: str
    questions: int
    confidence: float


class CrawlMetadata(BaseModel):
    parts: int
    groups: int
    audio_tracks: int = Field(alias="audioTracks")
    vocabulary_tags: int = Field(alias="vocabularyTags")
    skills_detected: int = Field(alias="skillsDetected")
    total_answers: int = Field(alias="totalAnswers")
    avg_difficulty: str = Field(alias="avgDifficulty")
    part_stats: List[PartStat] = Field(alias="partStats")
    skill_stats: List[SkillStat] = Field(alias="skillStats")

    class Config:
        populate_by_name = True


class ResourceUsage(BaseModel):
    requests: int
    bandwidth_mb: float = Field(alias="bandwidthMb")
    cloudinary_uploads: int = Field(alias="cloudinaryUploads")
    cookies_valid_until: Optional[str] = Field(None, alias="cookiesValidUntil")

    class Config:
        populate_by_name = True


class CrawlTestRequest(BaseModel):
    url: str
    title: Optional[str] = None
    cookies: Optional[Dict[str, str]] = None
    headers: Optional[Dict[str, str]] = None


class CrawlTestResponse(BaseModel):
    id: str
    url: str
    title: str
    status: CrawlStatus
    progress: int
    questions_found: int = Field(alias="questionsFound")
    error: Optional[str] = None
    created_at: str = Field(alias="createdAt")
    metadata: Optional[CrawlMetadata] = None
    pipeline: Optional[List[PipelineStep]] = None
    resources: Optional[ResourceUsage] = None
    logs: Optional[List[str]] = None

    class Config:
        populate_by_name = True
