import { Phase } from "@/types/study-plan";

export const mockPhases: Phase[] = [
  {
    "phase_id": "plan_123_1756370487-P1",
    "plan_id": "plan_123_1756370487",
    "title": "Phase 1 - Grammar Basics",
    "order_no": 1,
    "lessons": [101, 102],
    "status": "active"
  },
  {
    "phase_id": "plan_123_1756370487-P2", 
    "plan_id": "plan_123_1756370487",
    "title": "Phase 2 - Grammar Advanced",
    "order_no": 2,
    "lessons": [201, 202],
    "status": "locked"
  },
  {
    "phase_id": "plan_123_1756370487-P3",
    "plan_id": "plan_123_1756370487", 
    "title": "Phase 3 - Vocabulary – Daily Life",
    "order_no": 3,
    "lessons": [302, 303, 304, 305],
    "status": "locked"
  },
  {
    "phase_id": "plan_123_1756370487-P4",
    "plan_id": "plan_123_1756370487",
    "title": "Phase 4 - Listening Part 1 – Photographs", 
    "order_no": 4,
    "lessons": [401],
    "status": "locked"
  },
  {
    "phase_id": "plan_123_1756370487-P5",
    "plan_id": "plan_123_1756370487",
    "title": "Phase 5 - Listening Part 2 – Question Response",
    "order_no": 5, 
    "lessons": [501, 504, 502],
    "status": "locked"
  },
  {
    "phase_id": "plan_123_1756370487-P6",
    "plan_id": "plan_123_1756370487",
    "title": "Phase 6 - Listening Part 3 – Conversations",
    "order_no": 6,
    "lessons": [601],
    "status": "locked" 
  },
  {
    "phase_id": "plan_123_1756370487-P7",
    "plan_id": "plan_123_1756370487",
    "title": "Phase 7 - Listening Part 4 – Talks",
    "order_no": 7,
    "lessons": [701], 
    "status": "locked"
  },
  {
    "phase_id": "plan_123_1756370487-P8",
    "plan_id": "plan_123_1756370487",
    "title": "Phase 8 - Reading Part 5 – Incomplete Sentences",
    "order_no": 8,
    "lessons": [801, 802],
    "status": "locked"
  },
  {
    "phase_id": "plan_123_1756370487-P9", 
    "plan_id": "plan_123_1756370487",
    "title": "Phase 9 - Reading Part 6 – Text Completion",
    "order_no": 9,
    "lessons": [901],
    "status": "locked"
  },
  {
    "phase_id": "plan_123_1756370487-P10",
    "plan_id": "plan_123_1756370487", 
    "title": "Phase 10 - Reading Part 7 – Comprehension",
    "order_no": 10,
    "lessons": [1001],
    "status": "locked"
  }
];

export function getPhaseStatusColor(status: Phase['status']): string {
  switch (status) {
    case 'active':
      return '#ff776f';
    case 'completed':
      return '#10b981';
    case 'locked':
    default:
      return '#78716c';
  }
}

export function getPhaseDescription(lessonCount: number): string {
  return `${lessonCount} bài học`;
}

export function isPhaseAccessible(status: Phase['status']): boolean {
  return status === 'active' || status === 'completed';
}
