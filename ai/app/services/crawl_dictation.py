import requests, io, json, time
import numpy as np
import soundfile as sf
from bs4 import BeautifulSoup
from app.db.session import session_scope
from app.db.models.models import Items
import uuid
from datetime import datetime

# === Danh sách URL muốn cào ===
URLS = [
  "https://dailydictation.com/exercises/short-stories/81-the-lie.111/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/82-hobbies.112/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/83-christmas.113/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/84-pretending.114/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/85-a-baby.115/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/86-a-wedding.116/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/87-a-surprise.117/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/88-rhyming-words.118/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/89-opposites.119/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/90-the-smart-paperboy.120/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/91-niagara-falls.121/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/92-the-library.122/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/93-when-i-grow-up.123/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/94-favorite-colors.124/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/95-making-friends.125/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/96-getting-old.126/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/97-time.127/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/98-memories.128/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/99-places-to-live.129/listen-and-type",
  "https://dailydictation.com/exercises/short-stories/100-bathroom.130/listen-and-type"
]




def convert_level_to_toeic_band(level: str) -> int:
    """
    Quy đổi mức CEFR (A1–C2) sang TOEIC band_hint tương ứng.
    - A1 ~ 450
    - A2 ~ 450
    - B1 ~ 550
    - B2 ~ 650
    - C1 ~ 750
    - C2 ~ 850
    """
    mapping = {
        "A1": 450,
        "A2": 450,
        "B1": 550,
        "B2": 650,
        "C1": 750,
        "C2": 850,
    }
    # lấy 2 ký tự đầu (phòng khi có “Level A2”, “Vocab level: B1”, …)
    level_key = level.strip().upper()[:2]
    return mapping.get(level_key, 450)  # mặc định 450 nếu không khớp


def parse_title_and_level(soup):
    """
    Trích tiêu đề bài và level (nếu có).
    """
    title_tag = soup.select_one("div.mb-3 h1")
    level_tag = soup.select_one("div.mb-3 small")

    title = title_tag.get_text(strip=True) if title_tag else None
    level_text = level_tag.get_text(strip=True) if level_tag else ""

    # Lấy chữ cái cấp độ CEFR (A1, A2, B1, ...)
    import re
    match = re.search(r"(A1|A2|B1|B2|C1|C2)", level_text)
    level = match.group(1) if match else "A2"
    band_hint = convert_level_to_toeic_band(level)

    return title, level, band_hint

# -------------------------------
# 1. Parse trang: lấy audio + transcript
# -------------------------------
def parse_page(url: str):
    print(f"🔍 Fetching {url}")
    html = requests.get(url, timeout=20).text
    soup = BeautifulSoup(html, "html.parser")

    # Lấy title + level
    title, level, band_hint = parse_title_and_level(soup)

    # Lấy audio
    audio_tag = soup.find("audio")
    if not audio_tag:
        raise ValueError("Không tìm thấy thẻ <audio>")
    src_tag = audio_tag.find("source")
    audio_url = src_tag["src"] if src_tag else audio_tag["src"]
    if not audio_url.startswith("http"):
        audio_url = "https://dailydictation.com" + audio_url

    # Lấy transcript
    sentences = [
        div.get_text(strip=True)
        for div in soup.select('div[title^="Challenge"]')
        if div.get_text(strip=True)
    ]
    if not sentences:
        raise ValueError("Không có transcript")

    return audio_url, sentences, title, band_hint



# -------------------------------
# 2. Voice Activity Detection (VAD)
# -------------------------------
def vad_segments(data, sr, frame_ms=40, hop_ms=20, thr_factor=6):
    frame = int(sr * frame_ms / 1000)
    hop = int(sr * hop_ms / 1000)
    energies = [np.mean(data[i:i+frame]**2) for i in range(0, len(data)-frame, hop)]
    thr = np.median(energies) * thr_factor

    segs = []
    start = None
    for i, e in enumerate(energies):
        if e > thr and start is None:
            start = i
        if e <= thr and start is not None:
            end = i
            segs.append((start*hop/sr, (end*hop+frame)/sr))
            start = None
    if start is not None:
        segs.append((start*hop/sr, len(data)/sr))

    # Gộp các segment gần nhau (<0.5s)
    merged = []
    for s in segs:
        if not merged or s[0] - merged[-1][1] > 0.5:
            merged.append(list(s))
        else:
            merged[-1][1] = s[1]
    return merged


# -------------------------------
# 3. Cân bằng số segment với số câu
# -------------------------------
def balance_segments(segments, n_sentences, total_duration):
    """
    Nếu quá ít đoạn: chia đều các đoạn dài.
    Nếu quá nhiều: gộp các đoạn ngắn.
    Nếu vẫn lệch: nội suy theo thời gian.
    """
    # Nếu không có segment => chia đều toàn bộ audio
    if not segments:
        step = total_duration / n_sentences
        return [(i*step, (i+1)*step) for i in range(n_sentences)]

    # Gộp / chia lại cho đủ số câu
    if len(segments) < n_sentences:
        # Chia đều các segment dài hơn 3s
        new_segments = []
        deficit = n_sentences - len(segments)
        for s, e in segments:
            dur = e - s
            if dur > 3 and deficit > 0:
                n_split = min(deficit + 1, int(dur // 1.5))
                step = dur / n_split
                for i in range(n_split):
                    new_segments.append((s + i*step, s + (i+1)*step))
                deficit -= (n_split - 1)
            else:
                new_segments.append((s, e))
        segments = new_segments
    elif len(segments) > n_sentences:
        # Gộp các đoạn ngắn (<0.8s)
        merged = []
        for s, e in segments:
            if not merged:
                merged.append([s, e])
                continue
            if (e - s) < 0.8 and len(merged) < n_sentences:
                merged[-1][1] = e
            else:
                merged.append([s, e])
        segments = merged

    # Nếu vẫn chưa khớp số câu, nội suy đều toàn file
    if len(segments) != n_sentences:
        step = total_duration / n_sentences
        segments = [(i*step, (i+1)*step) for i in range(n_sentences)]

    # Cắt thời gian vượt quá audio
    segments = [(max(0, s), min(total_duration, e)) for s, e in segments]
    return segments


# -------------------------------
# 4. Tạo segment cho từng câu
# -------------------------------
def get_segments(audio_url, sentences):
    print(f"🎧 {audio_url}")
    audio_bytes = requests.get(audio_url, timeout=40).content
    data, sr = sf.read(io.BytesIO(audio_bytes))
    if len(data.shape) > 1:
        data = np.mean(data, axis=1)
    total_dur = len(data) / sr
    segs = vad_segments(data, sr)
    segs = balance_segments(segs, len(sentences), total_dur)

    out = []
    for i, text in enumerate(sentences):
        s, e = segs[i] if i < len(segs) else segs[-1]
        out.append({"start": round(float(s), 2),
                    "end": round(float(e), 2),
                    "text": text})
    return out


# -------------------------------
# 5. Lưu vào database thay vì JSON
# -------------------------------
def save_to_database(url, audio_url, sentences, segments, title=None, band_hint=550):
    """Lưu dữ liệu vào bảng items với modality='dictation'"""
    try:
        # Tạo prompt_jsonb chứa thông tin audio và segments
        prompt_data = {
            "audio_url": audio_url,
            "segments": segments,
            "source_url": url,
            "instructions": "Listen to the audio and type what you hear",
            "title": title or "Dictation Exercise"
        }
        
        # Tạo solution_jsonb chứa transcript đầy đủ
        solution_data = {
            "full_transcript": " ".join(sentences),
            "sentences": sentences,
            "correct_answers": [{"segment_id": i, "text": text} for i, text in enumerate(sentences)]
        }
        
        # Tạo rubric_jsonb cho việc chấm điểm
        rubric_data = {
            "scoring_method": "word_accuracy",
            "max_score": 100,
            "partial_credit": True,
            "criteria": [
                {"type": "spelling", "weight": 0.4},
                {"type": "punctuation", "weight": 0.2},
                {"type": "word_order", "weight": 0.4}
            ]
        }
        
        with session_scope() as session:
            # Tạo item mới
            new_item = Items(
                id=str(uuid.uuid4()),
                modality='dictation',
                status='active',
                prompt_jsonb=prompt_data,
                solution_jsonb=solution_data,
                rubric_jsonb=rubric_data,
                explanation=f"Dictation exercise: {title or 'Daily Dictation'}",
                band_hint=str(band_hint),  # Sử dụng band_hint từ parsing
                difficulty='medium',
                skill_type='listening',
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                is_active=True
            )
            
            session.add(new_item)
            session.commit()
            print(f"✅ Saved item {new_item.id} to database (Band: {band_hint})")
            return new_item.id
            
    except Exception as e:
        print(f"❌ Error saving to database: {e}")
        return None


# -------------------------------
# 6. Crawl toàn bộ danh sách URL và lưu vào DB
# -------------------------------
def crawl_urls_to_db(urls):
    """Crawl URLs và lưu trực tiếp vào database"""
    success_count = 0
    for url in urls:
        try:
            audio_url, sents, title, band_hint = parse_page(url)
            segs = get_segments(audio_url, sents)
            
            item_id = save_to_database(url, audio_url, sents, segs, title, band_hint)
            if item_id:
                success_count += 1
                print(f"✅ Successfully processed: {url} (Title: {title}, Band: {band_hint})")
            else:
                print(f"⚠️  Failed to save: {url}")
                
        except Exception as e:
            print(f"⚠️  Skip {url}: {e}")
        time.sleep(1)

    print(f"🎉 Successfully imported {success_count}/{len(urls)} items to database")


if __name__ == "__main__":
    crawl_urls_to_db(URLS)
