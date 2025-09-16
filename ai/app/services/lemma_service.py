import spacy
from sqlalchemy.orm import Session
from app.db.models.models import Questions, Vocabularies
from app.db.session import SessionLocal, session_scope

nlp = spacy.load("en_core_web_sm")

def update_question_lemmas(db: Session, question_id: str) -> None:
    question = db.query(Questions).filter(Questions.id == question_id).first()
    if not question:
        return None

    # 2. Lemmatize content
    doc = nlp(question.content)
    lemmas = [tok.lemma_.lower() for tok in doc if tok.is_alpha]

    # 3. Update DB
    question.lemmas = lemmas
    db.commit()
    # print(question)
    db.refresh(question)

    return question

def sync_all_questions(session: Session = None) -> None:
    if session is None:
        session = SessionLocal()
    questions = session.query(Questions).all()
    for q in questions:
        if not q.content:  # tránh lỗi nếu content null
            continue
        doc = nlp(q.content)
        q.lemmas = [tok.lemma_.lower() for tok in doc if tok.is_alpha]
        session.add(q)

def sync_all_vocabularies(session: Session = None) -> None:
    if session is None:
        session = SessionLocal()
    vocabularies = session.query(Vocabularies).all()
    for q in vocabularies:
        if not q.word:  # tránh lỗi nếu content null
            continue
        doc = nlp(q.word)
        q.lemmas = [tok.lemma_.lower() for tok in doc if tok.is_alpha]
        print(q.word, q.lemmas)
        session.add(q)
    session.commit()

def main():
    with session_scope() as db:
        sync_all_vocabularies(db)                       

if __name__ == "__main__":
    main()