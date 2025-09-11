import json
from pathlib import Path
import uuid
import re
# ----------------- Load JSON -----------------
def load_json():
    BASE_DIR = Path(__file__).resolve().parent.parent
    DATA_FILE = BASE_DIR / "db" / "data" / "questions.json"
    OUTPUT_FILE = BASE_DIR / "db" / "data" / "test_export.json"

    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Không tìm thấy file: {DATA_FILE}")

    with open(DATA_FILE, encoding="utf-8") as f:
        data = json.load(f)

    # ----------------- Reshape thành cấu trúc chuẩn -----------------
    output = {
        "title": "TOEIC Practice Test 01",
        "audioUrl": "https://s4-media1.study4.com/media/tez_media/sound/eco_toeic_1000_test_1_eco_toeic_1000_test_1.mp3",
        "parts": []
    }

    # Map question_number -> question
    question_map = {q["question_number"]: q for q in data.get("questions", [])}

    parts_map = {}
    for g in data.get("groups", []):
        part_num = g["part_id"]

        if part_num not in parts_map:
            part_obj = {
                "partNumber": part_num,
                "directions": "",   # có thể bổ sung hướng dẫn riêng từng part
                "groups": []
            }
            parts_map[part_num] = part_obj
            output["parts"].append(part_obj)

        group_obj = {
            "orderIndex": len(parts_map[part_num]["groups"]) + 1,
            "paragraphEn": g.get("paragraph") or "",
            "paragraphVn": g.get("transcript") or "",
            "imageUrl": g.get("image_url") or "",
            "audioUrl": g.get("audio_url") or "",
            "questions": []
        }

        for qnum in g.get("questions", []):
            q = question_map.get(qnum)
            if not q:
                continue

            # Tạo object câu hỏi trước
            q_obj = {
                "numberLabel": q.get("question_number"),
                "content": "",  # sẽ set ngay dưới
                "explanation": q.get("explanation") or "",
                "answers": []
            }

            # Nếu là Part 2 thì lấy question từ transcript
            if part_num == 2 and not q.get("question"):
                q_content, _ = split_question_transcript(q.get("transcript", ""))
                q_obj["content"] = q_content
            else:
                q_obj["content"] = q.get("question") or ""

            # Thêm answers
            for ans in q.get("answers", []):
                q_obj["answers"].append({
                    "content": ans.get("text"),
                    "isCorrect": ans.get("is_answer", False),
                    "answerKey": ans.get("key"),
                })

            group_obj["questions"].append(q_obj)


        parts_map[part_num]["groups"].append(group_obj)


    # ----------------- Xuất JSON -----------------
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✅ Xuất thành công: {OUTPUT_FILE}")



def split_question_transcript(transcript: str):
    """
    Tách transcript Part 2 thành question + answers_text
    """
    # Regex: bắt đầu từ (A) hoặc A. trở đi
    match = re.search(r"(\(?A\)|A\.)", transcript)
    if not match:
        return transcript, None

    q_text = transcript[:match.start()].strip()
    ans_text = transcript[match.start():].strip()
    return q_text, ans_text

if __name__ == "__main__":
    load_json()