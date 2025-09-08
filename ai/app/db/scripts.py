# import json
# from pathlib import Path
# import uuid

# from app.db.session import session_scope
# from app.db.models.models import Tests, Parts, Groups, Questions, Answers

# # ----------------- Load JSON -----------------
# BASE_DIR = Path(__file__).resolve().parent.parent
# DATA_FILE = BASE_DIR / "db" / "data" / "questions.json"

# if not DATA_FILE.exists():
#     raise FileNotFoundError(f"Không tìm thấy file: {DATA_FILE}")

# with open(DATA_FILE, encoding="utf-8") as f:
#     data = json.load(f)

# # ----------------- Insert ORM -----------------
# with session_scope() as session:
#     # Test
#     test = Tests(
#         id=uuid.uuid4(),
#         title="test 1",
#         audio_url="https://s4-media1.study4.com/media/tez_media/sound/eco_toeic_1000_test_1_eco_toeic_1000_test_1.mp3"
#     )
#     session.add(test)

#     # 7 Parts
#     parts_map = {}
#     for i in range(1, 8):
#         part = Parts(
#             id=uuid.uuid4(),
#             testId=test.id,
#             part_number=i,
#         )
#         session.add(part)
#         parts_map[i] = part.id

#     # Groups + Questions + Answers
#     for index, g in enumerate(data.get("groups", []), start=1):
#         part_id = parts_map.get(g.get("part_id"))
#         if not part_id:
#             raise ValueError(f"part_id {g.get('part_id')} không hợp lệ")

#         group = Groups(
#             id=uuid.uuid4(),
#             partId=part_id,
#             order_index=index,
#             parageraph_en=g.get("paragraph") or "",
#             paragraph_vn=g.get("transcript") or "",
#             image_url=g.get("image_url") or "",
#             audio_url=g.get("audio_url") or "",
#         )
#         session.add(group)

#         index_questions = g.get("questions", [])

#         for q in data.get("questions", []):
#             if q.get("question_number") in index_questions:
#                 question = Questions(
#                     id=uuid.uuid4(),
#                     groupId=group.id,
#                     number_label=q.get("question_number"),
#                     content=q.get("question") or "",
#                     explanation=q.get("explanation") or "",
#                     score=q.get("score", 5)
#                 )
#                 session.add(question)

#                 for ans in q.get("answers", []):
#                     answer = Answers(
#                         id=uuid.uuid4(),
#                         questionId=question.id,
#                         content=ans.get("text"),
#                         is_correct=ans.get("is_answer", False),
#                         answer_key=ans.get("key")
#                     )
#                     print("Answer:", answer)
#                 session.add(answer)
#     print("New objects:", session.new)        # Những object vừa add nhưng chưa flush

#     session.commit()
#     print(f"✅ Insert thành công test {test.id}")

# # import os

# # def main():
# #     """Run script"""
    
# #     print("Running script...")
# #     print("Current working directory:", os.getenv("POSTGRES_SERVER", "localhost"))

# # if __name__ == "__main__":
# #     main()