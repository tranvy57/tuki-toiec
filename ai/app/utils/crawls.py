
import uuid
import re
from urllib.parse import urljoin

def uid():
    return str(uuid.uuid4())

def normalize_url(url, base_url="https://study4.com"):
    if not url:
        return None
    return urljoin(base_url, url) if url.startswith("/") else url

def txt(elem, join_char=" ", strip=True):
    if not elem:
        return None
    return elem.get_text(join_char, strip=strip).replace("\xa0", " ")

def try_int(s):
    if s is None:
        return None
    m = re.search(r"\d+", str(s))
    return int(m.group(0)) if m else None