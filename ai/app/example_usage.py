#!/usr/bin/env python3
"""
Example usage của refactored crawl_service
"""

from app.services.crawl_service import import_test
from app.db.session import session_scope

def example_import():
    """Example import test from URL"""
    
    # URL ví dụ - bạn có thể thay đổi thành URL thật
    test_url = "https://study4.com/tests/224/new-economy-toeic-test-1/results/29592832/details/"
    
    print(f"🚀 Importing test from: {test_url}")
    print("-" * 50)
    
    try:
        with session_scope() as session:
            # Import test vào database
            test = import_test(test_url, session)
            
            print(f"\n✅ Successfully imported test!")
            print(f"   Test ID: {test.id}")
            print(f"   Title: {test.title}")
            print(f"   Audio URL: {test.audio_url}")
            print(f"   Created: {test.created_at}")
            
            # In thêm thông tin về các parts
            print(f"\n📊 Parts information:")
            for part in test.parts:
                print(f"   Part {part.part_number}: {len(part.groups)} groups")
                
                # Đếm questions trong part này
                question_count = sum(len(group.questions) for group in part.groups)
                print(f"     - Total questions: {question_count}")
            
            return test
            
    except Exception as e:
        print(f"❌ Error occurred: {e}")
        import traceback
        traceback.print_exc()
        return None

def example_query():
    """Example query data từ database"""
    
    print(f"\n🔍 Querying data from database")
    print("-" * 50)
    
    try:
        with session_scope() as session:
            from app.db.models.models import Tests, Questions, Skills
            
            # Query tests
            tests = session.query(Tests).all()
            print(f"Total tests in database: {len(tests)}")
            
            # Query questions
            questions = session.query(Questions).all()
            print(f"Total questions in database: {len(questions)}")
            
            # Query skills
            skills = session.query(Skills).all()
            print(f"Total skills in database: {len(skills)}")
            
            if tests:
                latest_test = tests[-1]
                print(f"\nLatest test:")
                print(f"  Title: {latest_test.title}")
                print(f"  Parts: {len(latest_test.parts)}")
                print(f"  Total groups: {sum(len(part.groups) for part in latest_test.parts)}")
                
                # In một số questions
                all_questions = []
                for part in latest_test.parts:
                    for group in part.groups:
                        all_questions.extend(group.questions)
                
                print(f"  Total questions: {len(all_questions)}")
                
                if all_questions:
                    print(f"\nFirst few questions:")
                    for i, q in enumerate(all_questions[:3]):
                        print(f"  Q{q.number_label}: {q.content[:50]}...")
                        print(f"    Answers: {len(q.answers)}")
            
    except Exception as e:
        print(f"❌ Error querying: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🔧 Crawl Service Refactor Demo")
    print("=" * 50)
    
    # Demo import
    test = example_import()
    
    # Demo query
    example_query()
    
    print("\n✨ Demo completed!")
