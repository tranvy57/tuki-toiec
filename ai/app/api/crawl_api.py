from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.crawl_models import (
    CrawlTestRequest,
    CrawlTestResponse,
    CrawlStatus,
    PipelineStep,
    CrawlMetadata,
    ResourceUsage,
    PartStat,
    SkillStat
)
from app.services.crawl_service import import_test
from app.db.session import get_db
from datetime import datetime
import time
import traceback
from typing import Dict

crawl_router = APIRouter()


def calculate_metadata(test, parts_instances, groups_instances, questions_instances, answers_instances, skills_by_part) -> CrawlMetadata:
    """Calculate metadata from crawled entities"""
    
    # Calculate part stats
    part_stats = []
    for part in parts_instances:
        part_groups = [g for g in groups_instances if g.parts == part]
        part_questions = []
        for group in part_groups:
            part_questions.extend([q for q in questions_instances if q.groups == group])
        
        # Determine difficulty based on part number
        difficulty_map = {
            1: "medium", 2: "medium", 3: "hard", 
            4: "hard", 5: "medium", 6: "medium", 7: "hard"
        }
        
        part_stats.append(PartStat(
            part=part.part_number,
            questions=len(part_questions),
            groups=len(part_groups),
            difficulty=difficulty_map.get(part.part_number, "medium")
        ))
    
    # Calculate skill stats
    skill_stats = []
    if skills_by_part:
        skill_question_map: Dict[str, int] = {}
        for part_block in skills_by_part:
            for skill_block in part_block.get("skills", []):
                skill_name = skill_block["skill"]
                question_count = len(skill_block.get("questions", []))
                skill_question_map[skill_name] = skill_question_map.get(skill_name, 0) + question_count
        
        for skill_name, question_count in skill_question_map.items():
            skill_stats.append(SkillStat(
                name=skill_name,
                questions=question_count,
                confidence=0.85  # Default confidence
            ))
    
    # Count audio tracks (groups with audio)
    audio_tracks = sum(1 for g in groups_instances if g.audio_url)
    
    return CrawlMetadata(
        parts=len(parts_instances),
        groups=len(groups_instances),
        audio_tracks=audio_tracks,
        vocabulary_tags=0,  # Not tracked in current implementation
        skills_detected=len(skill_stats),
        total_answers=len(answers_instances),
        avg_difficulty="B1-B2",  # Default
        part_stats=part_stats,
        skill_stats=skill_stats
    )


@crawl_router.post("/test", response_model=CrawlTestResponse)
async def crawl_test(request: CrawlTestRequest, db: Session = Depends(get_db)):
    """
    Crawl a TOEIC test from Study4.com and import it into the database.
    
    This endpoint wraps the existing import_test() function from crawl_service.py
    and provides detailed progress tracking and metadata.
    """
    
    start_time = time.time()
    job_id = f"crawl_{int(start_time * 1000)}"
    logs = []
    pipeline_steps = []
    
    try:
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Starting crawl for {request.url}")
        
        # Override cookies and headers if provided
        from app.services import crawl_service
        if request.cookies:
            crawl_service.COOKIES.update(request.cookies)
            logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Updated {len(request.cookies)} cookies")
        
        if request.headers:
            crawl_service.HEADERS.update(request.headers)
            logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Updated {len(request.headers)} headers")
        
        # Extract title from URL if not provided
        title = request.title
        if not title:
            title = request.url.split("/")[-5] if request.url.endswith("/") else request.url.split("/")[-4]
            title = title.replace("-", " ").title()
        
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Fetching test page...")
        step_start = time.time()
        
        # Fetch main test page
        soup = crawl_service.fetch_test_page(request.url, crawl_service.COOKIES, crawl_service.HEADERS)
        
        pipeline_steps.append(PipelineStep(
            key="fetch_test",
            title="Fetch test page",
            description="GET HTML & parse DOM using BeautifulSoup",
            duration_ms=int((time.time() - step_start) * 1000),
            status=CrawlStatus.COMPLETED,
            entities={"tests": 1}
        ))
        
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Fetching audio & assets...")
        step_start = time.time()
        
        # Fetch audio page
        soup_audio = None
        audio_main = None
        try:
            soup_audio, audio_url = crawl_service.fetch_audio_pages(request.url, crawl_service.COOKIES, crawl_service.HEADERS)
            temp = soup.find_all("audio")
            temp = temp[0] if temp else None
            if temp:
                temp = temp.find_all('source')[0]
                audio_main = temp.get('src')
        except Exception as e:
            logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Warning: Could not fetch audio: {str(e)}")
        
        pipeline_steps.append(PipelineStep(
            key="fetch_audio",
            title="Fetch audio & assets",
            description="Call fetch_audio_pages + load main audio",
            duration_ms=int((time.time() - step_start) * 1000),
            status=CrawlStatus.COMPLETED
        ))
        
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Crawling DOM to entities...")
        step_start = time.time()
        
        # Crawl to ORM entities
        test, parts_instances, groups_instances, questions_instances, answers_instances = crawl_service.crawl_to_entities(
            soup, audio_main, title, soup_audio
        )
        
        pipeline_steps.append(PipelineStep(
            key="crawl_dom",
            title="Crawl DOM → Entities",
            description="crawl_to_entities: Tests → Parts → Groups → Questions → Answers",
            duration_ms=int((time.time() - step_start) * 1000),
            status=CrawlStatus.COMPLETED,
            entities={
                "parts": len(parts_instances),
                "groups": len(groups_instances),
                "questions": len(questions_instances),
                "answers": len(answers_instances)
            }
        ))
        
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Found {len(questions_instances)} questions")
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Parsing skills...")
        step_start = time.time()
        
        # Fetch skills
        skills_by_part = []
        try:
            soup_skill = crawl_service.fetch_skill_page(request.url, crawl_service.COOKIES, crawl_service.HEADERS)
            skills_by_part = crawl_service.parse_skills(soup_skill)
        except Exception as e:
            logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Warning: Could not fetch skills: {str(e)}")
        
        pipeline_steps.append(PipelineStep(
            key="parse_skills",
            title="Parse skills",
            description="parse_skills + create_skill_parts",
            duration_ms=int((time.time() - step_start) * 1000),
            status=CrawlStatus.COMPLETED,
            entities={"skills": len(set(s['skill'] for p in skills_by_part for s in p.get('skills', [])))} if skills_by_part else {}
        ))
        
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Uploading assets to Cloudinary...")
        step_start = time.time()
        
        # Note: Images are already uploaded during crawl_to_entities
        pipeline_steps.append(PipelineStep(
            key="cloudinary",
            title="Upload assets",
            description="upload_image_to_cloudinary",
            duration_ms=int((time.time() - step_start) * 1000),
            status=CrawlStatus.COMPLETED
        ))
        
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Persisting to database...")
        step_start = time.time()
        
        # Add entities to database
        db.add(test)
        for part in parts_instances:
            db.add(part)
        for group in groups_instances:
            db.add(group)
        for question in questions_instances:
            db.add(question)
        for answer in answers_instances:
            db.add(answer)
        
        db.flush()
        
        # Create skills and question tags
        question_tag_count = 0
        if skills_by_part:
            skill_map = crawl_service.create_or_get_skills(db, skills_by_part)
            crawl_service.create_skill_parts(skills_by_part, parts_instances, skill_map)
            question_tag_instances = crawl_service.create_question_tags(skills_by_part, questions_instances, skill_map)
            for question_tag in question_tag_instances:
                db.add(question_tag)
            question_tag_count = len(question_tag_instances)
        
        db.commit()
        
        pipeline_steps.append(PipelineStep(
            key="persist_entities",
            title="Persist to DB",
            description="import_test + commit transaction",
            duration_ms=int((time.time() - step_start) * 1000),
            status=CrawlStatus.COMPLETED,
            entities={"questionTags": question_tag_count}
        ))
        
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Successfully imported test!")
        
        # Calculate metadata
        metadata = calculate_metadata(
            test, parts_instances, groups_instances, 
            questions_instances, answers_instances, skills_by_part
        )
        
        # Calculate resources
        resources = ResourceUsage(
            requests=5 + len(groups_instances),  # Approximate
            bandwidth_mb=round(len(questions_instances) * 0.1, 1),  # Approximate
            cloudinary_uploads=sum(1 for g in groups_instances if g.image_url)
        )
        
        return CrawlTestResponse(
            id=job_id,
            url=request.url,
            title=title,
            status=CrawlStatus.COMPLETED,
            progress=100,
            questions_found=len(questions_instances),
            created_at=datetime.now().isoformat(),
            metadata=metadata,
            pipeline=pipeline_steps,
            resources=resources,
            logs=logs
        )
        
    except Exception as e:
        db.rollback()
        error_msg = str(e)
        logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Error: {error_msg}")
        logs.append(traceback.format_exc())
        
        return CrawlTestResponse(
            id=job_id,
            url=request.url,
            title=request.title or "Failed crawl",
            status=CrawlStatus.ERROR,
            progress=0,
            questions_found=0,
            error=error_msg,
            created_at=datetime.now().isoformat(),
            pipeline=pipeline_steps,
            logs=logs
        )
