import { BookOpen, Headphones, MessageSquare, FileText } from "lucide-react";
import { TOEICPart, Question, BandScoreMapping } from "./types";

export const TOEIC_PARTS: TOEICPart[] = [
  {
    id: 1,
    name: "Photographs",
    description: "Listen to descriptions of photos",
    questions: 6,
    skill: "Listening",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    name: "Question-Response",
    description: "Listen to questions and choose best response",
    questions: 25,
    skill: "Listening",
    icon: Headphones,
    color: "bg-green-50 text-green-700",
  },
  {
    id: 3,
    name: "Conversations",
    description: "Listen to conversations between two people",
    questions: 39,
    skill: "Listening",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-700",
  },
  {
    id: 4,
    name: "Talks",
    description: "Listen to short talks by one speaker",
    questions: 30,
    skill: "Listening",
    icon: Headphones,
    color: "bg-orange-50 text-orange-700",
  },
  {
    id: 5,
    name: "Incomplete Sentences",
    description: "Choose the word that best completes each sentence",
    questions: 30,
    skill: "Reading",
    icon: FileText,
    color: "bg-pink-50 text-pink-700",
  },
  {
    id: 6,
    name: "Text Completion",
    description: "Choose the word that best completes each passage",
    questions: 16,
    skill: "Reading",
    icon: BookOpen,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    id: 7,
    name: "Reading Comprehension",
    description: "Read passages and answer questions",
    questions: 54,
    skill: "Reading",
    icon: BookOpen,
    color: "bg-teal-50 text-teal-700",
  },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    part: 1,
    partName: "Photographs",
    question: "Look at the picture and choose the best description:",
    options: [
      "The woman is reading a book in the library",
      "The woman is writing notes at her desk",
      "The woman is talking on the phone",
      "The woman is typing on her computer",
    ],
    correctAnswer: 1,
    explanation: "The image shows a woman writing notes at her desk.",
  },
  {
    id: 2,
    part: 2,
    partName: "Question-Response",
    question: "When does the meeting start?",
    options: [
      "At 9 AM",
      "In the conference room",
      "Tomorrow",
      "With the manager",
    ],
    correctAnswer: 0,
    explanation:
      "This question asks about time, so 'At 9 AM' is the most appropriate response.",
  },
  {
    id: 3,
    part: 3,
    partName: "Conversations",
    question: "What are the speakers discussing?",
    options: [
      "A business proposal",
      "A vacation plan",
      "A training session",
      "A product launch",
    ],
    correctAnswer: 0,
    explanation:
      "The conversation centers around a business proposal being reviewed.",
  },
  {
    id: 4,
    part: 4,
    partName: "Talks",
    question: "What is the purpose of the announcement?",
    options: [
      "To inform about a schedule change",
      "To introduce a new policy",
      "To celebrate an achievement",
      "To request feedback",
    ],
    correctAnswer: 0,
    explanation:
      "The announcement is primarily informing listeners about a schedule change.",
  },
  {
    id: 5,
    part: 5,
    partName: "Incomplete Sentences",
    question: "The report must be submitted _____ Friday.",
    options: ["by", "on", "at", "in"],
    correctAnswer: 0,
    explanation:
      "'By Friday' means before or on Friday - the correct preposition for deadlines.",
  },
  {
    id: 6,
    part: 6,
    partName: "Text Completion",
    question:
      "Choose the best word to complete the passage: _____, the project was completed ahead of schedule.",
    options: ["However", "Therefore", "Moreover", "Meanwhile"],
    correctAnswer: 2,
    explanation:
      "'Moreover' is used to add additional positive information to support the previous statement.",
  },
  {
    id: 7,
    part: 7,
    partName: "Reading Comprehension",
    passageId: "passage-1",
    questionNumber: 1,
    passage: `Subject: Appointment Confirmation - Dr. Johnson
From: reception@healthcare.com
To: patient@email.com

Dear Mr. Smith,

We are writing to confirm your appointment with Dr. Johnson on Friday, March 15th at 2:30 PM. Please arrive 15 minutes early to complete the necessary paperwork.

If you need to reschedule or cancel this appointment, please contact our office at least 24 hours in advance. You can reach us at (555) 123-4567 or reply to this email.

Please bring your insurance card and a valid photo ID to your appointment.

Thank you for choosing our healthcare facility.

Best regards,
Reception Team
Healthcare Center
Subject: Appointment Confirmation - Dr. Johnson
From: reception@healthcare.com
To: patient@email.com

Dear Mr. Smith,

We are writing to confirm your appointment with Dr. Johnson on Friday, March 15th at 2:30 PM. Please arrive 15 minutes early to complete the necessary paperwork.

If you need to reschedule or cancel this appointment, please contact our office at least 24 hours in advance. You can reach us at (555) 123-4567 or reply to this email.

Please bring your insurance card and a valid photo ID to your appointment.

Thank you for choosing our healthcare facility.

Best regards,
Reception Team
Healthcare Center
`,
    question:
      "According to the passage, what is the main purpose of the email?",
    options: [
      "To request information",
      "To confirm an appointment",
      "To express gratitude",
      "To make a complaint",
    ],
    correctAnswer: 1,
    explanation:
      "The email primarily serves to confirm the scheduled appointment with Dr. Johnson.",
  },
  {
    id: 8,
    part: 7,
    partName: "Reading Comprehension",
    passageId: "passage-1",
    questionNumber: 2,
    passage: `Subject: Appointment Confirmation - Dr. Johnson
From: reception@healthcare.com
To: patient@email.com

Dear Mr. Smith,

We are writing to confirm your appointment with Dr. Johnson on Friday, March 15th at 2:30 PM. Please arrive 15 minutes early to complete the necessary paperwork.

If you need to reschedule or cancel this appointment, please contact our office at least 24 hours in advance. You can reach us at (555) 123-4567 or reply to this email.

Please bring your insurance card and a valid photo ID to your appointment.

Thank you for choosing our healthcare facility.

Best regards,
Reception Team
Healthcare Center`,
    question: "What should patients bring to their appointment?",
    options: [
      "Medical records and prescription",
      "Insurance card and photo ID",
      "Previous test results",
      "Payment and referral letter",
    ],
    correctAnswer: 1,
    explanation:
      "The email specifically states to bring insurance card and a valid photo ID.",
  },
  {
    id: 9,
    part: 7,
    partName: "Reading Comprehension",
    passageId: "passage-1",
    questionNumber: 3,
    passage: `Subject: Appointment Confirmation - Dr. Johnson
From: reception@healthcare.com
To: patient@email.com

Dear Mr. Smith,

We are writing to confirm your appointment with Dr. Johnson on Friday, March 15th at 2:30 PM. Please arrive 15 minutes early to complete the necessary paperwork.

If you need to reschedule or cancel this appointment, please contact our office at least 24 hours in advance. You can reach us at (555) 123-4567 or reply to this email.

Please bring your insurance card and a valid photo ID to your appointment.

Thank you for choosing our healthcare facility.

Best regards,
Reception Team
Healthcare Center`,
    question:
      "How far in advance should patients contact the office to reschedule?",
    options: ["12 hours", "24 hours", "48 hours", "1 week"],
    correctAnswer: 1,
    explanation:
      "The email states that patients should contact the office at least 24 hours in advance to reschedule or cancel.",
  },
  {
    id: 10,
    part: 7,
    partName: "Reading Comprehension",
    passageId: "passage-2",
    questionNumber: 1,
    passage: `OFFICE MEMO

TO: All Employees
FROM: Human Resources Department
DATE: March 10, 2024
RE: New Flexible Work Policy

Effective immediately, all full-time employees are eligible to participate in our new flexible work arrangement program. This policy allows employees to work from home up to 2 days per week, subject to manager approval and operational requirements.

To participate in this program:
1. Submit a formal request to your direct supervisor
2. Complete the remote work training module
3. Ensure you have appropriate home office setup
4. Maintain regular communication with your team

All remote work days must be pre-approved and documented. Employees who fail to meet productivity standards may have their flexible work privileges revoked.

For more information, contact HR at extension 2500.`,
    question: "How many days per week can employees work from home?",
    options: ["1 day", "2 days", "3 days", "As many as needed"],
    correctAnswer: 1,
    explanation:
      "The memo clearly states employees can work from home up to 2 days per week.",
  },
];

export const BAND_SCORE_MAPPING: Record<number, BandScoreMapping> = {
  0: { band: "200-300", level: "Beginner", color: "bg-red-100 text-red-800" },
  1: {
    band: "300-400",
    level: "Elementary",
    color: "bg-orange-100 text-orange-800",
  },
  2: {
    band: "400-500",
    level: "Pre-Intermediate",
    color: "bg-yellow-100 text-yellow-800",
  },
  3: {
    band: "500-600",
    level: "Intermediate",
    color: "bg-blue-100 text-blue-800",
  },
  4: {
    band: "600-700",
    level: "Upper Intermediate",
    color: "bg-indigo-100 text-indigo-800",
  },
  5: {
    band: "700-800",
    level: "Advanced",
    color: "bg-purple-100 text-purple-800",
  },
  6: {
    band: "800-850",
    level: "Proficient",
    color: "bg-green-100 text-green-800",
  },
  7: {
    band: "850-900",
    level: "Expert",
    color: "bg-emerald-100 text-emerald-800",
  },
  8: { band: "900-950", level: "Master", color: "bg-green-200 text-green-900" },
  9: {
    band: "950-990",
    level: "Perfect",
    color: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900",
  },
};

export const TEST_TIPS = [
  "Read all options carefully before choosing your answer",
  "Eliminate obviously wrong answers first",
  "Pay attention to keywords and context clues",
  "Don't spend too much time on difficult questions",
  "Review your answers if time permits",
  "Practice regularly to improve your speed and accuracy",
];

export const STUDY_RESOURCES = [
  {
    title: "Grammar Fundamentals",
    description: "Master essential grammar rules for TOEIC success",
    icon: "book",
    difficulty: "Beginner",
  },
  {
    title: "Business Vocabulary",
    description: "Learn key vocabulary used in business contexts",
    icon: "briefcase",
    difficulty: "Intermediate",
  },
  {
    title: "Listening Strategies",
    description: "Improve your listening comprehension skills",
    icon: "headphones",
    difficulty: "All Levels",
  },
  {
    title: "Reading Techniques",
    description:
      "Develop effective reading strategies for better comprehension",
    icon: "book-open",
    difficulty: "All Levels",
  },
];

export function generateRecommendations(correctAnswers: number): string[] {
  const percentage = (correctAnswers / SAMPLE_QUESTIONS.length) * 100;

  if (percentage < 25) {
    return [
      "Start with basic grammar and vocabulary foundations",
      "Practice listening to simple English conversations daily",
      "Focus on fundamental TOEIC question types",
      "Build confidence with easier practice exercises",
      "Consider taking a beginner TOEIC preparation course",
    ];
  } else if (percentage < 50) {
    return [
      "Strengthen grammar foundations with targeted practice",
      "Expand business vocabulary through regular study",
      "Practice reading comprehension strategies",
      "Improve listening skills with audio materials",
      "Take practice tests to identify weak areas",
    ];
  } else if (percentage < 75) {
    return [
      "Focus on advanced grammar patterns and structures",
      "Practice time management during test sections",
      "Work on inference and detail questions",
      "Develop strategies for longer reading passages",
      "Review and practice challenging question types",
    ];
  } else {
    return [
      "Maintain current level with regular practice",
      "Focus on speed and accuracy improvements",
      "Practice with full-length mock tests regularly",
      "Fine-tune test-taking strategies",
      "Consider advanced business English courses",
    ];
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
