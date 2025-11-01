FROM python:3.10-slim

# Ngăn Python tạo file .pyc và buffer log
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Tạo thư mục làm việc
WORKDIR /app

# Copy file requirements và cài đặt
COPY requirements ./requirements
RUN pip install --no-cache-dir -r requirements/base.txt
RUN pip install --no-cache-dir -r requirements/dev.txt

# Copy toàn bộ source code
COPY app ./app
COPY .env ./ 

# Expose port cho FastAPI (hoặc app khác)
EXPOSE 8000

# Chạy ứng dụng
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
