import requests
from bs4 import BeautifulSoup
import json
from typing import Tuple, List, Optional
from sqlalchemy.orm import Session
from app.utils.crawls import txt, normalize_url, uid, try_int
from app.constants.crawl import PART_RANGES, DIFFICULTY_BY_PART, DIFFICULTY_BY_SKILL
from app.db.models.models import Tests, Parts, Groups, Questions, Answers, Skills, QuestionTags
import re
import os
from dotenv import load_dotenv
load_dotenv()

COOKIES = {
    "_tt_enable_cookie": os.environ.get("STUDY4_COOKIE__TT_ENABLE_COOKIE"),
    "_ttp": os.environ.get("STUDY4_COOKIE__TTP"),
    "_ym_d": os.environ.get("STUDY4_COOKIE__YM_D"),
    "_ym_isad": os.environ.get("STUDY4_COOKIE__YM_ISAD"),
    "_ym_uid": os.environ.get("STUDY4_COOKIE__YM_UID"),
    "bh": os.environ.get("STUDY4_COOKIE_BH"),
    "cf_clearance": os.environ.get("STUDY4_COOKIE_CF_CLEARANCE"),
    "csrftoken": os.environ.get("STUDY4_COOKIE_CSRFTOKEN"),
    "sessionid": os.environ.get("STUDY4_COOKIE_SESSIONID"),
    "ttcsid": os.environ.get("STUDY4_COOKIE_TTCSID"),
    "ttcsid_COLIHEBC77U9C4QOD78G": os.environ.get("STUDY4_COOKIE_TTCSID_COLIHEBC77U9C4QOD78G"),
    "ttcsid_CORPTQRC77UD072DBJ40": os.environ.get("STUDY4_COOKIE_TTCSID_CORPTQRC77UD072DBJ40")
}

HEADERS = {
    "User-Agent": os.environ.get("STUDY4_HEADER_USER_AGENT"),
    "Referer": os.environ.get("STUDY4_HEADER_REFERER"),
    "Accept-Language": os.environ.get("STUDY4_HEADER_ACCEPT_LANGUAGE"),
}

def fetch_test_page(url, cookies=None, headers=None):
    resp = requests.get(url, headers=headers, cookies=cookies)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")

def fetch_skill_page(url, cookies=None, headers=None):
    skill_url = url.rstrip("/").removesuffix("details")
    resp = requests.get(skill_url, headers=headers, cookies=cookies)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")

def fetch_audio_pages(url, cookies=None, headers=None):
    from urllib.parse import urlparse
    parsed = urlparse(url)
    parts = parsed.path.strip("/").split("/")
    base_path = "/".join(parts[:2])
    base_url = f"{parsed.scheme}://{parsed.netloc}/{base_path}"
    name_test = url.split("/")[5]

    resp_part = requests.get(f"{base_url}/{name_test}/", headers=headers, cookies=cookies)
    soup_part = BeautifulSoup(resp_part.text, "html.parser")

    part_audio = soup_part.find_all(class_="form-check-input")
    audio_url = base_url + "/practice/?" + "&".join([f"part={a['value']}" for a in part_audio])
    resp_audio = requests.get(audio_url, headers=headers, cookies=cookies)
    return BeautifulSoup(resp_audio.text, "html.parser"), audio_url

def parse_question(wrapper, q_order: int, group: Groups, content_listening=None, part_number=None) -> Tuple[Questions, List[Answers]]:
    # transcript ở câu (nếu có) — bạn muốn lưu vào content hay bỏ, tuỳ chỉnh
    q_trans_div = wrapper.find(class_="context-content context-transcript text-highlightable")
    q_trans = None
    if q_trans_div:
        collapse = q_trans_div.find(class_="collapse")
        q_trans = txt(collapse) or txt(q_trans_div)


    number_label = txt(wrapper.find(class_="question-number"))
    content      = txt(wrapper.find(class_="question-text")) or None

    if part_number == 2 and content_listening:
        idx = content_listening.find("?")
        content = content_listening[:idx+1] if idx != -1 else None

    # Đáp án đúng (A-D)
    correct_key = None
    ok_tag = wrapper.find("div", class_="mt-2 text-success")
    if ok_tag:
        t = ok_tag.get_text(" ", strip=True)
        m = re.search(r"Đáp án đúng\s*[:\-]?\s*([A-D])", t, re.I)
        correct_key = m.group(1).strip().upper() if m else None

    # Answers
    ans_rows = []
    for fc in wrapper.find_all(class_="form-check"):
        label = fc.find("label")
        inp   = fc.find("input")
        if not (label and inp): continue
        key = (inp.get("value") or "").strip().upper()  # A/B/C/D
        ans_rows.append({
            'content': label.get_text(" ", strip=True),
            'is_correct': (correct_key is not None and key == correct_key),
            'answer_key': key or None,
        })

    # Explanation
    explanation = None
    expl_div = wrapper.find(class_="question-explanation-wrapper")
    if expl_div:
        collapse_e = expl_div.find(class_="collapse")
        explanation = txt(collapse_e) or txt(expl_div)

    # Tạo Question ORM instance
    question = Questions(
        number_label=try_int(number_label) or 0,
        content=content or '',
        explanation=explanation or '',
        score=5  # default score
    )
    
    # Set relationship với group
    question.groups = group
    
    # Tạo Answer ORM instances
    answer_instances = []
    for ans_data in ans_rows:
        answer = Answers(
            content=ans_data['content'],
            is_correct=ans_data['is_correct'],
            answer_key=ans_data['answer_key'] or ''
        )
        answer.questions = question
        answer_instances.append(answer)
    
    return question, answer_instances


def parse_skills(soup_skill):
    from collections import defaultdict
    import re

    overview_block = soup_skill.select("div.tab-pane")[-1]
    rows = overview_block.select("tbody tr")
    parts_map = defaultdict(list)

    for tr in rows:
        tds = tr.find_all("td")
        if not tds: continue

        skill_name = tds[0].get_text(strip=True)
        m = re.search(r"Part\s*(\d+)", skill_name)
        part_no = int(m.group(1)) if m else None

        last_td = tds[-1]
        q_links = last_td.select("a.result-question-item")
        orders = [int(a.get_text(strip=True)) for a in q_links if a.get_text(strip=True).isdigit()]

        parts_map[part_no].append({
            "skill": skill_name,
            "questions": orders
        })

    return [{"part": p, "skills": s} for p, s in parts_map.items()]

# Deprecated: Use crawl_to_entities instead
# def build_parts_rows():

def part_number_by_qindex(q_idx:int):
    for pr in PART_RANGES:
        if pr["start"] <= q_idx < pr["end"]:
            return pr["part_number"]
    raise ValueError(f"Question index {q_idx} out of range")


def crawl_to_entities(soup, audio_main, title=None, soup_audio=None) -> Tuple[Tests, List[Parts], List[Groups], List[Questions], List[Answers]]:
    # Tạo Test instance
    test = Tests(
        title=title or "Untitled Test",
        audio_url=audio_main
    )

    # Tạo Parts instances
    parts_instances = []
    part_map = {}  # part_number -> Part instance
    
    for pr in PART_RANGES:
        part = Parts(
            part_number=pr['part_number'],
            direction=''  # có thể set sau
        )
        part.tests = test
        parts_instances.append(part)
        part_map[pr['part_number']] = part

    groups_instances = []
    questions_instances = []
    answers_instances = []
    processed = set()
    q_order = 1
    group_order = 1

    # duyệt đúng thứ tự DOM
    for elm in soup.select(".question-group-wrapper, .question-item-wrapper"):
        classes = elm.get("class", [])
        if "question-group-wrapper" in classes:
            node = elm.find(class_="context-content context-transcript text-highlightable")
            collapse = node.select_one(".collapse") if node else None
            para_en = txt(collapse) if collapse else txt(node)
            node_trans = elm.find(class_="question-explanation-wrapper")
            para_trans = txt(node_trans.select_one(".collapse")) if node_trans else None
            img_urls = [normalize_url(img.get("src")) for img in elm.find_all("img") if img and img.get("src")]
            img_url = img_urls[0] if img_urls else None

            # part lấy theo câu đầu tiên trong group (q_order hiện tại)
            pn = part_number_by_qindex(q_order)
            part_instance = part_map[pn]
            
            # Tạo Group instance
            group = Groups(
                order_index=group_order,
                parageraph_en=para_en or '',
                paragraph_vn=para_trans or '',
                image_url=img_url,
                audio_url=None  # set sau nếu có soup_audio
            )
            group.parts = part_instance
            groups_instances.append(group)
            group_order += 1

            for q in elm.find_all(class_="question-item-wrapper"):
                if id(q) in processed: continue
                question, answers = parse_question(q, q_order, group, content_listening=para_en)
                questions_instances.append(question)
                answers_instances.extend(answers)
                processed.add(id(q))
                q_order += 1

        elif "question-item-wrapper" in classes:
            if id(elm) in processed: continue
            node = elm.find(class_="context-content context-transcript text-highlightable")
            collapse = node.select_one(".collapse") if node else None
            para_en = txt(collapse) if collapse else txt(node)
            node_trans = elm.find(class_="question-explanation-wrapper")
            para_trans = txt(node_trans.select_one(".collapse")) if node_trans else None
            img_tag = elm.find("img")
            img_url = normalize_url(img_tag.get("src")) if img_tag and img_tag.get("src") else None

            pn = part_number_by_qindex(q_order)
            part_instance = part_map[pn]
            
            # Tạo Group instance
            group = Groups(
                order_index=group_order,
                parageraph_en=para_en or '',
                paragraph_vn=para_trans or '',
                image_url=img_url,
                audio_url=None
            )
            group.parts = part_instance
            groups_instances.append(group)
            group_order += 1

            question, answers = parse_question(elm, q_order, group, content_listening=para_en, part_number=pn)
            questions_instances.append(question)
            answers_instances.extend(answers)
            processed.add(id(elm))
            q_order += 1

    # map audio theo thứ tự group nếu vùng audio tách riêng
    if soup_audio:
        audio_sources = soup_audio.find_all("source")
        for idx, src in enumerate(audio_sources):
            if idx >= len(groups_instances): break
            groups_instances[idx].audio_url = normalize_url(src.get('src'))

    return test, parts_instances, groups_instances, questions_instances, answers_instances

# ====== DEPRECATED FUNCTIONS =====================================================
# Deprecated: Use ORM instances directly instead of JSON
# def build_json(test_row, part_rows, group_rows, question_rows, answer_rows):


def create_or_get_skills(db: Session, skills_by_part) -> dict:
    """
    Tạo hoặc lấy skills từ database
    skills_by_part: list[dict], mỗi dict {part: int, skills: [...]}
    returns: dict[skill_name, Skills] - mapping skill name to ORM instance
    """
    skill_map = {}
    
    # Collect all unique skill names
    skill_names = set()
    for part_block in skills_by_part:
        for skill_block in part_block.get("skills", []):
            skill_names.add(skill_block["skill"])
    
    # Check existing skills
    existing_skills = db.query(Skills).filter(Skills.name.in_(skill_names)).all()
    for skill in existing_skills:
        skill_map[skill.name] = skill
    
    # Create new skills
    for skill_name in skill_names:
        if skill_name not in skill_map:
            # Generate skill code from name
            
            skill = Skills(
                name=skill_name,
                description=f"Auto-generated skill for {skill_name}"
            )
            db.add(skill)
            skill_map[skill_name] = skill
    
    db.flush()  # Ensure IDs are generated
    return skill_map

def create_skill_parts(
    skills_by_part: list[dict],
    parts_instances: list[Parts],
    skill_map: dict[str, Skills],
):
    """
    Gắn quan hệ n-n giữa Skills và Parts thông qua association table skill_parts.
    Không return SkillParts vì bảng chỉ là secondary table.
    """
    # Map part_number -> Part instance
    part_map = {p.part_number: p for p in parts_instances}
    result = []

    for part_block in skills_by_part:
        part_num = part_block.get("part")
        part_instance = part_map.get(part_num)
        if not part_instance:
            continue

        for skill_block in part_block.get("skills", []):
            skill_name = skill_block.get("skill")
            skill_instance = skill_map.get(skill_name)
            if not skill_instance:
                continue

            # Gắn quan hệ qua relationship
            if part_instance not in skill_instance.parts:
                skill_instance.parts.append(part_instance)
                result.append((skill_instance, part_instance))
    return result


def create_question_tags(skills_by_part, questions_instances: List[Questions], skill_map: dict) -> List[QuestionTags]:
    """
    Tạo QuestionTags instances
    skills_by_part: list[dict], mỗi dict {part: int, skills: [...]}
    questions_instances: List[Questions] - danh sách question instances
    skill_map: dict[skill_name, Skills] - mapping skill name to ORM instance
    """
    # Map number_label -> Question instance
    q_map = {q.number_label: q for q in questions_instances}

    tag_instances = []
    for part_block in skills_by_part:  
        part_num = part_block["part"]
        for skill_block in part_block.get("skills", []):
            skill_name = skill_block["skill"]
            skill_instance = skill_map.get(skill_name)
            if not skill_instance:
                continue

            # lấy difficulty: ưu tiên skill_name, fallback theo part
            difficulty = DIFFICULTY_BY_SKILL.get(
                skill_name, 
                DIFFICULTY_BY_PART.get(part_num, 0)
            )

            for qnum in skill_block["questions"]:
                question_instance = q_map.get(qnum)
                if not question_instance:
                    continue
                
                question_tag = QuestionTags(
                    difficulty=difficulty,
                    confidence=1.0
                )
                question_tag.question = question_instance
                question_tag.skill = skill_instance
                tag_instances.append(question_tag)
    
    return tag_instances


def import_test(url: str, db: Session) -> Tests:
    """
    Import một test từ URL vào database
    
    Args:
        url: URL của test cần crawl
        db: SQLAlchemy session
        
    Returns:
        Tests: Test instance đã được import
    """
    try:
        # Extract title from URL
        title = url.split("/")[-5] if url.endswith("/") else url.split("/")[-4]
        title = title.replace("-", " ").title()
        
        # Fetch main test page
        soup = fetch_test_page(url, COOKIES, HEADERS)
        # print(soup)
        
        # Fetch audio page if needed
        soup_audio = None
        audio_main = None
        try:
            soup_audio, audio_url = fetch_audio_pages(url, COOKIES, HEADERS)
            temp = soup.find_all("audio")
            temp = temp[0] if temp else None
            temp = temp.find_all('source')[0]
            audio_main = temp.get('src')
        except Exception as e:
            print(f"Warning: Could not fetch audio for {url}: {e}")
        
        # Crawl to ORM entities
        test, parts_instances, groups_instances, questions_instances, answers_instances = crawl_to_entities(
            soup, audio_main, title, soup_audio
        )

        
        db.add(test)
        for part in parts_instances:
            db.add(part)
        for group in groups_instances:
            db.add(group)
        for question in questions_instances:
            db.add(question)
        for answer in answers_instances:
            db.add(answer)
        
        # Flush to get IDs
        db.flush()
        
        # Fetch skills page để lấy skills information
        skills_by_part = []
        try:
            soup_skill = fetch_skill_page(url, COOKIES, HEADERS)
            skills_by_part = parse_skills(soup_skill)
        except Exception as e:
            print(f"Warning: Could not fetch skills for {url}: {e}")
        
        if skills_by_part:
            # Create or get skills
            skill_map = create_or_get_skills(db, skills_by_part)
            
            # Create skill parts
            create_skill_parts(skills_by_part, parts_instances, skill_map)
            # for skill_part in skill_part_instances:
            #     db.add(skill_part)
            
            # Create question tags
            question_tag_instances = create_question_tags(skills_by_part, questions_instances, skill_map)
            for question_tag in question_tag_instances:
                db.add(question_tag)
        
        # Commit transaction
        db.commit()
        
        print(f"Successfully imported test: {title}")
        print(f"  - {len(parts_instances)} parts")
        print(f"  - {len(groups_instances)} groups")
        print(f"  - {len(questions_instances)} questions")
        print(f"  - {len(answers_instances)} answers")
        if skills_by_part:
            print(f"  - {len(set(s['skill'] for p in skills_by_part for s in p.get('skills', [])))} skills")
        
        return test
        
    except Exception as e:
        db.rollback()
        print(f"Error importing test from {url}: {e}")
        raise

if __name__ == "__main__":
    from app.db.session import SessionLocal
    db = SessionLocal()
    test_url = "https://study4.com/tests/226/new-economy-toeic-test-3/results/29527020/details/"
    import_test(test_url, db)