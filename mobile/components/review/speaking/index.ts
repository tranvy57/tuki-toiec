export { default as ReadAloudSpeaking } from './ReadAloudSpeaking';
export { default as DescribePictureSpeaking } from './DescribePictureSpeaking';
export { default as RespondToQuestion } from './RespondToQuestion';
export { default as RespondToUsingInformation } from './RespondToUsingInformation';
export { default as ExpressOpinion } from './ExpressOpinion';

export type SpeakingTaskType =
  | 'read-aloud'
  | 'repeat-sentence'
  | 'describe-picture'
  | 'respond-to-questions'
  | 'respond-using-information'
  | 'express-opinion';

export interface SpeakingTask {
  id: string;
  type: SpeakingTaskType;
  title: string;
  content?: string;
  imageUrl?: string;
  preparationTime?: number;
  speakingTime?: number;
  questionText?: string;
  questions?: Array<{
    id: string;
    questionText: string;
    audioUrl?: string;
    preparationTime?: number;
    speakingTime?: number;
  }>;
}

// Sample speaking tasks
export const sampleSpeakingTasks: SpeakingTask[] = [
  {
    id: 'read-aloud-1',
    type: 'read-aloud',
    title: 'Company Announcement',
    content:
      "Hi. This is Myra Peters calling about my appointment with Dr. Jones. I have a three o'clock appointment scheduled for this afternoon. Unfortunately, I won't be able to keep it because of an important meeting at work. So, I'll need to reschedule. I was hoping to come in sometime next week. Any time Monday, Tuesday, or Wednesday afternoon would work for me. I hope the doctor has some time available on one of those days. Please call me back and let me know.",
    preparationTime: 45,
    speakingTime: 45,
  },
  {
    id: 'read-aloud-2',
    type: 'read-aloud',
    title: 'Product Information',
    content:
      'Welcome to our customer service line. We are currently experiencing higher than normal call volumes. Your call is important to us, and we appreciate your patience. Please stay on the line, and the next available representative will assist you shortly. For faster service, you may also visit our website or use our mobile app to access your account information and resolve common issues.',
    preparationTime: 45,
    speakingTime: 45,
  },
];
