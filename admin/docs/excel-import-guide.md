# Hướng dẫn Import Excel cho Đề thi TOEIC

## Tổng quan

Chức năng Import Excel cho phép bạn tạo đề thi TOEIC nhanh chóng từ file Excel có cấu trúc dữ liệu chuẩn. Thay vì nhập từng câu hỏi thủ công, bạn có thể chuẩn bị dữ liệu trong Excel và import toàn bộ vào hệ thống.

## Cách sử dụng

### 1. Tải mẫu Excel
- Vào trang **Tạo đề thi** (`/exams/create`)
- Nhấn nút **Import Excel** 
- Trong modal xuất hiện, nhấn **Tải mẫu** để download file Excel mẫu
- Sử dụng file mẫu này làm cơ sở để tạo đề thi của bạn

### 2. Chuẩn bị file Excel

#### Cấu trúc cột bắt buộc:
| Cột | Mô tả | Bắt buộc | Ví dụ |
|-----|-------|----------|-------|
| Part | Phần thi TOEIC (1-7) | ✅ | 1, 2, 3... |
| Group | Nhóm câu hỏi trong phần | ❌ | 1, 2, 3... |
| Question | Số thứ tự câu hỏi | ✅ | 1, 2, 3... |
| Content | Nội dung câu hỏi | ✅ | "What is the man doing?" |
| Answer A | Đáp án A | ✅ | "Reading a book" |
| Answer B | Đáp án B | ✅ | "Writing a letter" |
| Answer C | Đáp án C | ✅ | "Eating" |
| Answer D | Đáp án D | ✅ | "Sleeping" |
| Correct Answer | Đáp án đúng (A/B/C/D) | ✅ | "A" |

#### Cột tùy chọn:
| Cột | Mô tả | Ví dụ |
|-----|-------|-------|
| Explanation | Giải thích đáp án | "The man is reading a book." |
| Audio URL | Link file audio | "https://example.com/audio1.mp3" |
| Image URL | Link hình ảnh | "https://example.com/image1.jpg" |
| Paragraph EN | Đoạn văn tiếng Anh | "Look at the picture..." |
| Paragraph VN | Đoạn văn tiếng Việt | "Nhìn vào bức tranh..." |
| Directions | Hướng dẫn phần thi | "Listen and choose..." |

### 3. Quy tắc nhập dữ liệu

#### Phần thi (Part):
- **Part 1**: Photographs (Mô tả hình ảnh)
- **Part 2**: Question-Response (Hỏi đáp) 
- **Part 3**: Conversations (Hội thoại)
- **Part 4**: Short Talks (Bài nói ngắn)
- **Part 5**: Incomplete Sentences (Hoàn thành câu)
- **Part 6**: Text Completion (Hoàn thành đoạn văn)
- **Part 7**: Reading Comprehension (Đọc hiểu)

#### Nhóm câu hỏi (Group):
- Dùng để nhóm các câu hỏi liên quan trong cùng một phần
- Ví dụ: Part 3 có thể có nhiều đoạn hội thoại, mỗi đoạn là 1 group
- Nếu để trống sẽ tự động gán group = 1

#### Đáp án đúng:
- Chỉ nhập **A**, **B**, **C**, hoặc **D** (viết hoa)
- Mỗi câu hỏi chỉ có 1 đáp án đúng

### 4. Import vào hệ thống

1. **Mở modal Import**: Nhấn nút "Import Excel" trong trang tạo đề thi
2. **Chọn file**: Kéo thả file Excel vào vùng upload hoặc nhấn để chọn file
3. **Chờ xử lý**: Hệ thống sẽ đọc và phân tích dữ liệu
4. **Xem kết quả**: 
   - ✅ **Thành công**: Dữ liệu sẽ tự động điền vào form
   - ❌ **Lỗi**: Hiển thị thông báo lỗi cụ thể
   - ⚠️ **Cảnh báo**: Hiển thị các dòng có vấn đề (nhưng vẫn import được)

### 5. Sau khi import

- Kiểm tra lại dữ liệu đã được điền vào form
- Điều chỉnh thông tin cơ bản (tên đề thi, link audio chung)
- Chỉnh sửa từng phần/câu hỏi nếu cần
- Nhấn "Lưu đề thi" để hoàn tất

## Ví dụ file Excel

### Mẫu dữ liệu:

| Part | Group | Question | Content | Answer A | Answer B | Answer C | Answer D | Correct Answer | Explanation |
|------|-------|----------|---------|----------|----------|----------|----------|----------------|-------------|
| 1 | 1 | 1 | What is the man doing? | Reading | Writing | Eating | Sleeping | A | The man is reading |
| 1 | 1 | 2 | What is the woman holding? | A cup | A book | A phone | A bag | A | She holds a cup |
| 2 | 1 | 1 | Where is the bank? | Main Street | Next week | 5 minutes | On the left | A | Location question |

### Kết quả sau import:
- **Part 1**: 2 câu hỏi trong group 1
- **Part 2**: 1 câu hỏi trong group 1  
- **Part 3-7**: Tự động tạo với cấu trúc trống

## Lỗi thường gặp

### Lỗi file format:
❌ **"Vui lòng chọn file Excel (.xlsx hoặc .xls)"**
- Giải pháp: Đảm bảo file có đúng extension .xlsx hoặc .xls

### Lỗi dữ liệu:
❌ **"Thiếu nội dung câu hỏi"**
- Giải pháp: Cột "Content" không được để trống

❌ **"Thiếu đáp án"** 
- Giải pháp: Các cột Answer A, B, C, D không được để trống

❌ **"Thiếu đáp án đúng"**
- Giải pháp: Cột "Correct Answer" phải có giá trị A, B, C hoặc D

### Cảnh báo:
⚠️ **"Dòng X: Thiếu giải thích"**
- Không ảnh hưởng đến import, có thể bổ sung sau

## Tips và lưu ý

### 1. Chuẩn bị dữ liệu hiệu quả:
- Sử dụng copy/paste từ nguồn khác vào Excel
- Dùng formula Excel để tạo số thứ tự tự động
- Sắp xếp theo Part > Group > Question để dễ quản lý

### 2. Kiểm tra trước khi import:
- Đảm bảo không có dòng trống giữa dữ liệu
- Kiểm tra Correct Answer chỉ có A/B/C/D
- Xem preview vài dòng để đảm bảo format đúng

### 3. Xử lý file lớn:
- Nên chia nhỏ file nếu quá 1000 câu hỏi
- Import từng phần một cho dễ kiểm soát
- Backup file gốc trước khi chỉnh sửa

### 4. Sau import:
- Luôn xem lại form đã được điền
- Kiểm tra random vài câu hỏi
- Test audio/image URL nếu có

## Liên hệ hỗ trợ

Nếu gặp vấn đề với import Excel:
1. Kiểm tra lại format file theo hướng dẫn
2. Thử với file mẫu trước
3. Liên hệ admin qua email: admin@example.com
