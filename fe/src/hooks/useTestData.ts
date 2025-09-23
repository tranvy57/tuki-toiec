"use client";

export interface QuestionData {
  id: number;
  part: number;
  type: string;
  options: string[];
  instruction?: string;
  hasImage?: boolean;
  hasAudio?: boolean;
  hasText?: boolean;
}

export interface PassageQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface Passage {
  type: string;
  content: string;
  questions: PassageQuestion[];
  title?: string;
}

export interface Part {
  number: number;
  questions: number[];
  name: string;
}

// Mock data cho câu hỏi theo từng part
export const getQuestionsForPart = (partNum: number): QuestionData[] => {
  switch (partNum) {
    case 1:
      return Array.from({length: 6}, (_, i) => ({
        id: i + 1,
        part: 1,
        type: "photo-description",
        hasImage: true,
        options: ["A", "B", "C", "D"],
        instruction: "Look at the picture and listen to the audio."
      }));
    case 2:
      return Array.from({length: 25}, (_, i) => ({
        id: i + 7,
        part: 2,
        type: "question-response",
        hasAudio: true,
        options: ["A", "B", "C"],
        instruction: "You will hear a question or statement and three responses."
      }));
    case 6:
      return Array.from({length: 16}, (_, i) => ({
        id: i + 131,
        part: 6,
        type: "text-completion",
        hasText: true,
        options: ["A", "B", "C", "D"],
        instruction: "Complete the text by choosing the best words."
      }));
    case 7:
      return Array.from({length: 54}, (_, i) => ({
        id: i + 147,
        part: 7,
        type: "reading-comprehension",
        hasText: true,
        options: ["A", "B", "C", "D"],
        instruction: "Read the passage and answer the questions."
      }));
    default:
      return Array.from({length: 5}, (_, i) => ({
        id: i + 7,
        part: 1,
        type: "multiple-choice",
        options: ["A", "B", "C", "D"]
      }));
  }
};

// Mock passages for Part 6 & 7
export const mockPassages: Record<string, Passage> = {
  131: {
    type: "business-letter",
    title: "Business Contract",
    content: `To: samsmith@digitallt.com
From: sharronb@email.com
Date: September 24
Subject: Business Contract Dear Mr. Smith, I am Sharron Biggs, CEO and founder of BiggsGraphics. I recently came across your advertisement _____(131) the partnership of a graphic design company for a number of your projects. BiggsGraphics has _____(132) experience working with various small businesses and companies in designing advertising campaigns, logos, and websites. _____(133). Our website www.biggs-graphics.com also has some information about our company. I'm interested in working with your company on your projects and hope we can build a beneficial partnership. I look forward _____(134) your reply. Sincerely, Sharron Biggs CEO, BiggsGraphics`,
    questions: [
      {
        id: 131,
        question: "What word best completes the blank?",
        options: ["A. seek", "B. to seek", "C. seeking", "D. are seeking"]
      },
      {
        id: 132,
        question: "What word best completes the blank?",
        options: ["A. extensive", "B. restricted", "C. generous", "D. limitless"]
      },
      {
        id: 133,
        question: "What sentence best completes the paragraph?",
        options: [
          "A. I would really appreciate the opportunity to work with you.",
          "B. I heard that DigitalIT is a great company.",
          "C. In fact, our designs are often copied by other companies.",
          "D. I have attached a number of our past designs to illustrate what we specialize in."
        ]
      },
      {
        id: 134,
        question: "What word best completes the blank?",
        options: ["A. at", "B. to", "C. with", "D. from"]
      }
    ]
  },
  147: {
    type: "email",
    content: `To: employees@simnetsolutions.com
From: management@simnetsolutions.com
Subject: Seminar Opportunity
Date: February 5

Dear Female Employees,

Only one week remains until registration will be closed for the Women's Leadership Seminar. This seminar is offered free of charge to all of our female employees at Simnet Solutions. To accommodate our female employees' busy schedules, identical seminars will be held on two different dates—February 21 and February 23. In order to register for this special seminar, you must e-mail James Taylor in human resources by 5:00 PM. on February 12. This seminar will teach our female employees about how to communicate with confidence and credibility in the workplace. The Simnet Solutions Management Team`,
    questions: [
      {
        id: 147,
        question: "What is indicated about the seminar?",
        options: [
          "A. It will feature speaker James Taylor.",
          "B. It is held annually.", 
          "C. Its fee is more expensive than the last one.",
          "D. It is designed for women."
        ]
      },
      {
        id: 148,
        question: "When will the free registration offer end?",
        options: [
          "A. On February 5",
          "B. On February 12",
          "C. On February 21", 
          "D. On February 23"
        ]
      }
    ]
  }
};

// Parts configuration
export const parts: Part[] = [
  { number: 1, questions: Array.from({length: 6}, (_, i) => i + 1), name: "Photographs" },
  { number: 2, questions: Array.from({length: 25}, (_, i) => i + 7), name: "Question-Response" },
  { number: 3, questions: Array.from({length: 39}, (_, i) => i + 32), name: "Conversations" },
  { number: 4, questions: Array.from({length: 30}, (_, i) => i + 71), name: "Short Talks" },
  { number: 5, questions: Array.from({length: 30}, (_, i) => i + 101), name: "Incomplete Sentences" },
  { number: 6, questions: Array.from({length: 16}, (_, i) => i + 131), name: "Text Completion" },
  { number: 7, questions: Array.from({length: 54}, (_, i) => i + 147), name: "Reading Comprehension" }
];

// Get passage data for Part 6 & 7
export const getPassageForQuestion = (questionId: number): Passage | null => {
  for (const [passageKey, passage] of Object.entries(mockPassages)) {
    if (passage.questions.some(q => q.id === questionId)) {
      return passage;
    }
  }
  return null;
};
