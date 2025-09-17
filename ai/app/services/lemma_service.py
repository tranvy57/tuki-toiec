import spacy
from spacy.matcher import PhraseMatcher
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
    # Lấy sẵn toàn bộ phrase vocab (is_phrase = True)
    phrase_vocabs = session.query(Vocabularies).filter_by(is_phrase=True).all()
    phrase_keys = [v.lemma for v in phrase_vocabs]

    matcher = PhraseMatcher(nlp.vocab)
    matcher.add("VOCAB_PHRASES", [nlp.make_doc(p) for p in phrase_keys])

    for q in questions:
        if not q.content:
            continue
        doc = nlp(q.content)

        # lemmas từ đơn
        q.lemmas = [tok.lemma_.lower() for tok in doc if tok.is_alpha]

        # cụm từ (so khớp với vocab DB)
        matches = matcher(doc)
        phrases = []
        for match_id, start, end in matches:
            span = doc[start:end]
            phrases.append(span.text.lower())
        q.phrases = list(set(phrases))

        session.add(q)

    session.commit()


def sync_all_vocabularies(session: Session = None) -> None:
    if session is None:
        session = SessionLocal()

    vocabularies = session.query(Vocabularies).all()
    for v in vocabularies:
        if not v.word:
            continue

        doc = nlp(v.word)
        lemmas = [tok.lemma_.lower() for tok in doc if tok.is_alpha]

        if len(lemmas) == 1:
            v.lemma = lemmas[0]
            v.is_phrase = False
        else:
            v.lemma = " ".join(lemmas)
            v.is_phrase = True

        print(v.word, "→", v.lemma, "(phrase)" if v.is_phrase else "(word)")
        session.add(v)

    session.commit()


def main():
    with session_scope() as db:
        # sync_all_vocabularies(db)
        sync_all_questions(db)                  

if __name__ == "__main__":
    main()