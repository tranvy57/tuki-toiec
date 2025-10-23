"""
PostgreSQL helper script for TOEIC platform lesson management.
Creates lesson_content with type='quiz' and randomly assigns items to lesson_content_items table.
"""

import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

from app.db.session import session_scope
from app.db.models.models import LessonContents, Items
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def create_lesson_quiz_content(
    lesson_id: str,
    modality: str,
    count: int,
    use_status_filter: bool = True,
    difficulty: Optional[List[str]] = None,
    domain: Optional[List[str]] = None,
    replace_existing: bool = True
) -> Dict[str, Any]:
    """
    Create or update lesson content with type='quiz' and randomly assign items.
    
    Args:
        lesson_id: UUID of the lesson
        modality: Item modality to filter by
        count: Number of items to select (10-12)
        use_status_filter: Whether to filter by status='active' 
        difficulty: List of difficulties to filter by
        domain: List of domains to filter by
        replace_existing: Whether to replace existing items
        
    Returns:
        JSON response with success/error status
    """
    
    # Validate count parameter
    if not (10 <= count <= 12):
        return {
            "success": False,
            "error": f"Count must be between 10 and 12, got {count}",
            "error_code": "INVALID_COUNT"
        }
    
    try:
        with session_scope() as session:
            # Step 1: Find or create lesson_content with type='quiz'
            lesson_content_query = text("""
                SELECT id FROM lesson_contents 
                WHERE lesson_id = :lesson_id AND type = 'quiz'
                LIMIT 1
            """)
            
            result = session.execute(lesson_content_query, {"lesson_id": lesson_id}).fetchone()
            
            if result:
                lesson_content_id = result[0]
                print(f"✅ Found existing lesson_content: {lesson_content_id}")
            else:
                # Create new lesson_content
                lesson_content_id = str(uuid.uuid4())
                insert_content_query = text("""
                    INSERT INTO lesson_contents (id, type, content, is_active, "order", "isPremium", lesson_id, created_at, updated_at)
                    VALUES (:id, 'quiz', NULL, TRUE, 99, FALSE, :lesson_id, :now, :now)
                """)
                
                now = datetime.now(timezone.utc)
                session.execute(insert_content_query, {
                    "id": lesson_content_id,
                    "lesson_id": lesson_id,
                    "now": now
                })
                print(f"✅ Created new lesson_content: {lesson_content_id}")
            
            # Step 2: Build item selection query
            item_conditions = ["modality = :modality"]
            query_params = {"modality": modality}
            
            if use_status_filter:
                item_conditions.append("status = 'active'")
                
            if difficulty:
                item_conditions.append("difficulty = ANY(:difficulty)")
                query_params["difficulty"] = difficulty
                
            if domain:
                item_conditions.append("domain = ANY(:domain)")  
                query_params["domain"] = domain
            
            where_clause = " AND ".join(item_conditions)
            
            # Step 3: Get random items
            select_items_query = text(f"""
                SELECT id FROM items 
                WHERE {where_clause}
                ORDER BY RANDOM() 
                LIMIT :count
            """)
            
            query_params["count"] = count
            items_result = session.execute(select_items_query, query_params).fetchall()
            
            if len(items_result) < count:
                session.rollback()
                return {
                    "success": False,
                    "error": f"Not enough items for modality '{modality}'. Found {len(items_result)}, need {count}",
                    "error_code": "INSUFFICIENT_ITEMS",
                    "found_count": len(items_result),
                    "required_count": count
                }
            
            selected_item_ids = [row[0] for row in items_result]
            print(f"✅ Selected {len(selected_item_ids)} items for modality '{modality}'")
            
            # Step 4: Handle existing items
            if replace_existing:
                delete_existing_query = text("""
                    DELETE FROM lesson_content_items 
                    WHERE lesson_content_id = :lesson_content_id
                """)
                session.execute(delete_existing_query, {"lesson_content_id": lesson_content_id})
                print("✅ Deleted existing lesson_content_items")
                start_order = 1
            else:
                # Get max order to append new items
                max_order_query = text("""
                    SELECT COALESCE(MAX("order"), 0) FROM lesson_content_items 
                    WHERE lesson_content_id = :lesson_content_id
                """)
                max_order_result = session.execute(max_order_query, {"lesson_content_id": lesson_content_id}).scalar()
                start_order = (max_order_result or 0) + 1
            
            # Step 5: Insert new lesson_content_items
            insert_items_query = text("""
                INSERT INTO lesson_content_items (id, lesson_content_id, item_id, order_index)
                VALUES (:id, :lesson_content_id, :item_id, :order)
            """)
            
            for i, item_id in enumerate(selected_item_ids):
                session.execute(insert_items_query, {
                    "id": str(uuid.uuid4()),
                    "lesson_content_id": lesson_content_id,
                    "item_id": item_id,
                    "order": start_order + i
                })
            
            print(f"✅ Inserted {len(selected_item_ids)} lesson_content_items")
            
            # Step 6: Update lesson_content timestamp
            update_content_query = text("""
                UPDATE lesson_contents 
                SET updated_at = :now 
                WHERE id = :lesson_content_id
            """)
            
            session.execute(update_content_query, {
                "lesson_content_id": lesson_content_id,
                "now": datetime.now(timezone.utc)
            })
            
            # Commit transaction
            session.commit()
            
            return {
                "success": True,
                "lesson_content_id": lesson_content_id,
                "lesson_id": lesson_id,
                "modality": modality,
                "items_count": len(selected_item_ids),
                "item_ids": selected_item_ids,
                "operation": "replace" if replace_existing else "append",
                "message": f"Successfully assigned {len(selected_item_ids)} {modality} items to lesson quiz"
            }
            
    except SQLAlchemyError as e:
        return {
            "success": False,
            "error": f"Database error: {str(e)}",
            "error_code": "DATABASE_ERROR"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "error_code": "UNKNOWN_ERROR"
        }


def assign_dictation_items_to_lesson(lesson_id: str, count: int = 10) -> Dict[str, Any]:
    """
    Convenience function to assign dictation items to a lesson.
    
    Args:
        lesson_id: UUID of the lesson
        count: Number of dictation items to assign (10-12)
        
    Returns:
        JSON response
    """
    return create_lesson_quiz_content(
        lesson_id=lesson_id,
        modality='dictation',
        count=count,
        use_status_filter=True,
        replace_existing=True
    )


def batch_assign_items_to_lessons(lesson_configs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Batch assign items to multiple lessons.
    
    Args:
        lesson_configs: List of lesson configuration dictionaries
        
    Returns:
        Batch operation results
    """
    results = []
    success_count = 0
    
    for config in lesson_configs:
        try:
            result = create_lesson_quiz_content(**config)
            results.append({
                "lesson_id": config.get("lesson_id"),
                "result": result
            })
            
            if result.get("success"):
                success_count += 1
                
        except Exception as e:
            results.append({
                "lesson_id": config.get("lesson_id"),
                "result": {
                    "success": False,
                    "error": str(e),
                    "error_code": "BATCH_ERROR"
                }
            })
    
    return {
        "success": success_count == len(lesson_configs),
        "total_lessons": len(lesson_configs),
        "successful_lessons": success_count,
        "failed_lessons": len(lesson_configs) - success_count,
        "results": results
    }


def auto_assign_items_to_all_quiz_contents(
    modality: str = "dictation",
    count: int = 10,
    use_status_filter: bool = True,
    difficulty: Optional[List[str]] = None,
    domain: Optional[List[str]] = None,
    replace_existing: bool = True
) -> Dict[str, Any]:
    """
    Find all lesson_contents with type='quiz' and assign items to each one.
    
    Args:
        modality: Item modality to filter by (default: 'dictation')
        count: Number of items per lesson_content (10-12)
        use_status_filter: Whether to filter by status='active'
        difficulty: List of difficulties to filter by
        domain: List of domains to filter by
        replace_existing: Whether to replace existing items
        
    Returns:
        Batch operation results
    """
    
    try:
        with session_scope() as session:
            # Step 1: Find all lesson_contents with type='quiz'
            find_quiz_contents_query = text("""
                SELECT id, lesson_id FROM lesson_contents 
                WHERE type = 'quiz' AND is_active = TRUE
                ORDER BY created_at DESC
            """)
            
            quiz_contents_result = session.execute(find_quiz_contents_query).fetchall()
            
            if not quiz_contents_result:
                return {
                    "success": False,
                    "error": "No lesson_contents with type='quiz' found",
                    "error_code": "NO_QUIZ_CONTENTS_FOUND",
                    "total_found": 0
                }
            
            print(f"🔍 Found {len(quiz_contents_result)} lesson_contents with type='quiz'")
            
            # Step 2: Process each lesson_content
            results = []
            success_count = 0
            
            for lesson_content_row in quiz_contents_result:
                lesson_content_id = lesson_content_row[0]
                lesson_id = lesson_content_row[1]
                
                try:
                    # Use the existing logic but with known lesson_content_id
                    result = assign_items_to_existing_quiz_content(
                        lesson_content_id=lesson_content_id,
                        lesson_id=lesson_id,
                        modality=modality,
                        count=count,
                        use_status_filter=use_status_filter,
                        difficulty=difficulty,
                        domain=domain,
                        replace_existing=replace_existing
                    )
                    
                    results.append({
                        "lesson_content_id": lesson_content_id,
                        "lesson_id": lesson_id,
                        "result": result
                    })
                    
                    if result.get("success"):
                        success_count += 1
                        print(f"✅ Processed lesson_content {lesson_content_id}")
                    else:
                        print(f"❌ Failed lesson_content {lesson_content_id}: {result.get('error')}")
                        
                except Exception as e:
                    error_result = {
                        "success": False,
                        "error": str(e),
                        "error_code": "PROCESSING_ERROR"
                    }
                    results.append({
                        "lesson_content_id": lesson_content_id,
                        "lesson_id": lesson_id,
                        "result": error_result
                    })
                    print(f"❌ Exception for lesson_content {lesson_content_id}: {e}")
            
            return {
                "success": success_count == len(quiz_contents_result),
                "total_quiz_contents": len(quiz_contents_result),
                "successful_assignments": success_count,
                "failed_assignments": len(quiz_contents_result) - success_count,
                "modality": modality,
                "items_per_content": count,
                "results": results,
                "summary": f"Processed {len(quiz_contents_result)} quiz contents, {success_count} successful"
            }
            
    except SQLAlchemyError as e:
        return {
            "success": False,
            "error": f"Database error: {str(e)}",
            "error_code": "DATABASE_ERROR"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "error_code": "UNKNOWN_ERROR"
        }


def assign_items_to_existing_quiz_content(
    lesson_content_id: str,
    lesson_id: str,
    modality: str,
    count: int,
    use_status_filter: bool = True,
    difficulty: Optional[List[str]] = None,
    domain: Optional[List[str]] = None,
    replace_existing: bool = True
) -> Dict[str, Any]:
    """
    Assign items to an existing lesson_content with type='quiz'.
    
    Args:
        lesson_content_id: Existing lesson_content UUID
        lesson_id: Associated lesson UUID 
        modality: Item modality to filter by
        count: Number of items to select (10-12)
        use_status_filter: Whether to filter by status='active'
        difficulty: List of difficulties to filter by
        domain: List of domains to filter by
        replace_existing: Whether to replace existing items
        
    Returns:
        JSON response with success/error status
    """
    
    # Validate count parameter
    if not (10 <= count <= 12):
        return {
            "success": False,
            "error": f"Count must be between 10 and 12, got {count}",
            "error_code": "INVALID_COUNT"
        }
    
    try:
        with session_scope() as session:
            # Build item selection query
            item_conditions = ["modality = :modality"]
            query_params = {"modality": modality}
            
            if use_status_filter:
                item_conditions.append("status = 'active'")
                
            if difficulty:
                item_conditions.append("difficulty = ANY(:difficulty)")
                query_params["difficulty"] = difficulty
                
            if domain:
                item_conditions.append("domain = ANY(:domain)")  
                query_params["domain"] = domain
            
            where_clause = " AND ".join(item_conditions)
            
            # Get random items
            select_items_query = text(f"""
                SELECT id FROM items 
                WHERE {where_clause}
                ORDER BY RANDOM() 
                LIMIT :count
            """)
            
            query_params["count"] = count
            items_result = session.execute(select_items_query, query_params).fetchall()
            
            if len(items_result) < count:
                return {
                    "success": False,
                    "error": f"Not enough items for modality '{modality}'. Found {len(items_result)}, need {count}",
                    "error_code": "INSUFFICIENT_ITEMS",
                    "found_count": len(items_result),
                    "required_count": count
                }
            
            selected_item_ids = [row[0] for row in items_result]
            
            # Handle existing items
            if replace_existing:
                delete_existing_query = text("""
                    DELETE FROM lesson_content_items 
                    WHERE lesson_content_id = :lesson_content_id
                """)
                session.execute(delete_existing_query, {"lesson_content_id": lesson_content_id})
                start_order = 1
            else:
                # Get max order to append new items
                max_order_query = text("""
                    SELECT COALESCE(MAX("order"), 0) FROM lesson_content_items 
                    WHERE lesson_content_id = :lesson_content_id
                """)
                max_order_result = session.execute(max_order_query, {"lesson_content_id": lesson_content_id}).scalar()
                start_order = (max_order_result or 0) + 1
            
            # Insert new lesson_content_items
            insert_items_query = text("""
                INSERT INTO lesson_content_items (id, lesson_content_id, item_id, order_index)
                VALUES (:id, :lesson_content_id, :item_id, :order)
            """)
            
            for i, item_id in enumerate(selected_item_ids):
                session.execute(insert_items_query, {
                    "id": str(uuid.uuid4()),
                    "lesson_content_id": lesson_content_id,
                    "item_id": item_id,
                    "order": start_order + i
                })
            
            # Update lesson_content timestamp
            update_content_query = text("""
                UPDATE lesson_contents 
                SET updated_at = :now 
                WHERE id = :lesson_content_id
            """)
            
            session.execute(update_content_query, {
                "lesson_content_id": lesson_content_id,
                "now": datetime.now(timezone.utc)
            })
            
            # Commit transaction
            session.commit()
            
            return {
                "success": True,
                "lesson_content_id": lesson_content_id,
                "lesson_id": lesson_id,
                "modality": modality,
                "items_count": len(selected_item_ids),
                "item_ids": selected_item_ids,
                "operation": "replace" if replace_existing else "append",
                "message": f"Successfully assigned {len(selected_item_ids)} {modality} items"
            }
            
    except SQLAlchemyError as e:
        return {
            "success": False,
            "error": f"Database error: {str(e)}",
            "error_code": "DATABASE_ERROR"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "error_code": "UNKNOWN_ERROR"
        }


if __name__ == "__main__":
    # Main usage: Find all quiz lesson_contents and assign dictation items
    print("🚀 Starting auto-assignment of dictation items to all quiz lesson_contents...")
    
    result = auto_assign_items_to_all_quiz_contents(
        modality="dictation",
        count=10,
        replace_existing=True
    )
    
    print(json.dumps(result, indent=2, default=str))
