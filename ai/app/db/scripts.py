import json
from pathlib import Path
import uuid

from app.db.session import session_scope
from app.db.models.models import Tests, Parts, Groups, Questions, Answers

# ----------------- Load JSON -----------------
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "questions.json"

if not DATA_FILE.exists():
    raise FileNotFoundError(f"Không tìm thấy file: {DATA_FILE}")

with open(DATA_FILE, encoding="utf-8") as f:
    data = json.load(f)

# ----------------- Insert ORM -----------------
with session_scope() as session:
    # Test
    test = Tests(
        id=uuid.uuid4(),
        title=data.get("title"),
        audio_url=data.get("audio_url")
    )
    # session.add(test)

    # 7 Parts
    parts_map = {}
    for i in range(1, 8):
        part = Parts(
            id=uuid.uuid4(),
            testId=test.id,
            part_number=i,
            directions=f"Directions for Part {i}"
        )
        # session.add(part)
        parts_map[i] = part.id

    # Groups + Questions + Answers
    for g in data.get("groups", []):
        part_id = parts_map.get(g.get("part_id"))
        if not part_id:
            raise ValueError(f"part_id {g.get('part_id')} không hợp lệ")

        group = Groups(
            id=uuid.uuid4(),
            partId=part_id,
            paragraph=g.get("paragraph"),
            transcript=g.get("transcript"),
            image_url=g.get("image_url"),
            audio_url=g.get("audio_url")
        )
        # session.add(group)

        for q in g.get("questions", []):
            question = Questions(
                id=uuid.uuid4(),
                groupId=group.id,
                number_label=q.get("number"),
                content=q.get("text"),
                explanation=q.get("explanation", ""),
                score=q.get("score", 5)
            )
            # session.add(question)

            for ans in q.get("answers", []):
                answer = Answers(
                    id=uuid.uuid4(),
                    questionId=question.id,
                    content=ans.get("content"),
                    is_correct=ans.get("is_correct", False),
                    answer_key=ans.get("answer_key")
                )
                # session.add(answer)

    # session.commit()
    print(f"✅ Insert thành công test {test.id}")
