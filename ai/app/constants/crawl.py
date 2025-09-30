

PART_RANGES = [
  {"part_number":1, "start":1,   "end":7},
  {"part_number":2, "start":7,   "end":32},
  {"part_number":3, "start":32,  "end":71},
  {"part_number":4, "start":71,  "end":101},
  {"part_number":5, "start":101, "end":131},
  {"part_number":6, "start":131, "end":147},
  {"part_number":7, "start":147, "end":201},
]

TABLE = {
  "tests": "tests",
  "parts": "parts",
  "groups": "groups",
  "questions": "questions",
  "answers": "answers",
}

COL = {
  "tests":     ['test_id','title','audio_url'],
  "parts":     ['part_id','test_id','part_number','directions'],
  "groups":    ['group_id','part_id','order_index','paragraph_en','paragraph_vn','image_url','audio_url'],
  "questions": ['question_id','group_id','grammar_id','number_label','content','explanation','score'],
  "answers":   ['answer_id','question_id','content','is_correct','answer_key'],
}


DIFFICULTY_BY_PART = {
    1: 0.25,   # dễ
    2: 0.25,   # dễ
    3: 0.5,    # trung bình
    4: 0.5,    # trung bình
    5: 0.75,   # trung bình-khó
    6: 0.75,   # trung bình-khó
    7: 0.8,    # khó
}

DIFFICULTY_BY_SKILL = {
    # Part 1
    "[Part 1] Tranh tả cả người và vật": 0.25,
    "[Part 1] Tranh tả người": 0.25,

    # Grammar (default trung bình)
    "[Grammar] Đại từ": 0.5,
    "[Grammar] Danh động từ": 0.55,
    "[Grammar] Danh từ": 0.5,
    "[Grammar] Động từ nguyên mẫu": 0.55,
    "[Grammar] Động từ nguyên mẫu có to": 0.55,
    "[Grammar] Giới từ": 0.5,
    "[Grammar] Liên từ": 0.55,
    "[Grammar] Mệnh đề quan hệ": 0.6,
    "[Grammar] Phân từ và Cấu trúc phân từ": 0.6,
    "[Grammar] Thể": 0.55,
    "[Grammar] Thì": 0.55,
    "[Grammar] Tính từ": 0.5,
    "[Grammar] Trạng từ": 0.5,

    # Part 2
    "[Part 2] Câu hỏi đuôi": 0.3,
    "[Part 2] Câu hỏi HOW": 0.3,
    "[Part 2] Câu hỏi lựa chọn": 0.3,
    "[Part 2] Câu hỏi WHAT": 0.3,
    "[Part 2] Câu hỏi WHEN": 0.3,
    "[Part 2] Câu hỏi WHERE": 0.3,
    "[Part 2] Câu hỏi WHO": 0.3,
    "[Part 2] Câu hỏi WHY": 0.3,
    "[Part 2] Câu hỏi YES/NO": 0.3,
    "[Part 2] Câu trần thuật": 0.3,
    "[Part 2] Câu yêu cầu, đề nghị": 0.3,

    # Part 3
    "[Part 3] Câu hỏi kết hợp bảng biểu": 0.55,
    "[Part 3] Câu hỏi về chi tiết cuộc hội thoại": 0.55,
    "[Part 3] Câu hỏi về chủ đề, mục đích": 0.55,
    "[Part 3] Câu hỏi về danh tính người nói": 0.55,
    "[Part 3] Câu hỏi về hàm ý câu nói": 0.6,
    "[Part 3] Câu hỏi về hành động tương lai": 0.55,
    "[Part 3] Câu hỏi về yêu cầu, gợi ý": 0.55,
    "[Part 3] Chủ đề: Company - Event, Project": 0.55,
    "[Part 3] Chủ đề: Company - Facility": 0.55,
    "[Part 3] Chủ đề: Company - General Office Work": 0.55,
    "[Part 3] Chủ đề: Housing": 0.55,
    "[Part 3] Chủ đề: Order, delivery": 0.55,
    "[Part 3] Chủ đề: Shopping, Service": 0.55,

    # Part 4
    "[Part 4] Câu hỏi kết hợp bảng biểu": 0.55,
    "[Part 4] Câu hỏi về chi tiết": 0.55,
    "[Part 4] Câu hỏi về chủ đề, mục đích": 0.55,
    "[Part 4] Câu hỏi về danh tính, địa điểm": 0.55,
    "[Part 4] Câu hỏi về hàm ý câu nói": 0.6,
    "[Part 4] Câu hỏi về hành động tương lai": 0.55,
    "[Part 4] Câu hỏi yêu cầu, gợi ý": 0.55,
    "[Part 4] Dạng bài: Advertisement - Quảng cáo": 0.6,
    "[Part 4] Dạng bài: Announcement - Thông báo": 0.6,
    "[Part 4] Dạng bài: News report, Broadcast - Bản tin": 0.6,
    "[Part 4] Dạng bài: Talk - Bài phát biểu, diễn văn": 0.6,
    "[Part 4] Dạng bài: Telephone message - Tin nhắn thoại": 0.6,

    # Part 5
    "[Part 5] Câu hỏi ngữ pháp": 0.65,
    "[Part 5] Câu hỏi từ loại": 0.65,
    "[Part 5] Câu hỏi từ vựng": 0.65,

    # Part 6
    "[Part 6] Câu hỏi điền câu vào đoạn văn": 0.7,
    "[Part 6] Câu hỏi ngữ pháp": 0.65,
    "[Part 6] Câu hỏi từ vựng": 0.65,
    "[Part 6] Hình thức: Quảng cáo (Advertisement)": 0.65,
    "[Part 6] Hình thức: Thông báo nội bộ (Memo)": 0.65,
    "[Part 6] Hình thức: Thông báo/ văn bản hướng dẫn (Notice/ Announcement Information)": 0.65,
    "[Part 6] Hình thức: Thư điện tử/ thư tay (Email/ Letter)": 0.65,

    # Part 7
    "[Part 7] Câu hỏi điền câu": 0.75,
    "[Part 7] Câu hỏi suy luận": 0.8,
    "[Part 7] Câu hỏi tìm chi tiết sai": 0.8,
    "[Part 7] Câu hỏi tìm thông tin": 0.75,
    "[Part 7] Câu hỏi về chủ đề, mục đích": 0.8,
    "[Part 7] Câu hỏi về hàm ý câu nói": 0.85,
    "[Part 7] Cấu trúc: một đoạn": 0.75,
    "[Part 7] Cấu trúc: nhiều đoạn": 0.85,
    "[Part 7] Dạng bài: Advertisement - Quảng cáo": 0.8,
    "[Part 7] Dạng bài: Announcement/ Notice: Thông báo": 0.8,
    "[Part 7] Dạng bài: Article/ Review: Bài báo/ Bài đánh giá": 0.9,
    "[Part 7] Dạng bài: Email/ Letter: Thư điện tử/ Thư tay": 0.85,
    "[Part 7] Dạng bài: Form - Đơn từ, biểu mẫu": 0.85,
    "[Part 7] Dạng bài: Schedule - Lịch trình, thời gian biểu": 0.9,
    "[Part 7] Dạng bài: Text message chain - Chuỗi tin nhắn": 0.85,
}

