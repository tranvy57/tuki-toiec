
import os
from dotenv import load_dotenv
load_dotenv()
from contextlib import ExitStack
from redis import from_url
from redis.exceptions import ResponseError
from langgraph.checkpoint.redis import RedisSaver

class RedisDatabase:
    def __init__(self):
        self._redis_url = os.getenv("REDIS_URL")
        self._stack = ExitStack()
        self._saver = None

    def connect(self):
        if not self._saver:
            # GIỮ context mở suốt vòng đời process
            self._saver = self._stack.enter_context(
                RedisSaver.from_conn_string(self._redis_url)
            )
            # tạo index nếu chưa có (idempotent)
            self._saver.setup()
        # bảo hiểm: ai đó vừa drop thì tạo lại ngay
        self.ensure_index_alive()
        return self._saver

    def ensure_index_alive(self):
        r = from_url(self._redis_url)  # ví dụ: redis://:pass@127.0.0.1:6379/0
        try:
            r.ft("checkpoints").info()
        except ResponseError as e:
            msg = str(e).lower()
            if "unknown index name" in msg or "no such index" in msg:
                try:
                    self._saver.setup()  # tạo lại; không xoá dữ liệu
                except ResponseError as ee:
                    # nếu race condition: "already exists" thì bỏ qua
                    if "already exists" not in str(ee).lower():
                        raise
            else:
                raise

    def close(self):
        self._stack.close()
        self._saver = None

if __name__ == "__main__":
    # test
    db = RedisDatabase()
    saver = db.connect()
    print("Connected to Redis checkpoint DB")
    db.close()
    print("Closed connection")