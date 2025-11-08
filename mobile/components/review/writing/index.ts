export { default as OpinionEssayPrompt } from './OpinionEssayPrompt';
export { default as PictureDescriptionPrompt } from './PictureDescriptionPrompt';
export { default as ArgumentativeEssayPrompt } from './ArgumentativeEssayPrompt';
export { default as WritingResponse } from './WritingResponse';

export type WritingTaskType =
  | 'opinion'
  | 'picture-description'
  | 'argumentative'
  | 'email'
  | 'short-answer'
  | 'error-correction';

export interface WritingTask {
  id: string;
  type: WritingTaskType;
  title: string;
  topic: string;
  timeLimit: number;
  wordLimit: number;
  imageUrl?: string;
  preparationTime?: number;
}

// Sample writing tasks
export const sampleWritingTasks: WritingTask[] = [
  {
    id: 'opinion-1',
    type: 'opinion',
    title: 'Technology and Life',
    topic:
      'Some people believe that technology has made our lives easier, while others argue that it has made our lives more complicated. Discuss both views and give your own opinion. Support your answer with specific examples and reasons.',
    timeLimit: 30,
    wordLimit: 250,
  },
  {
    id: 'picture-1',
    type: 'picture-description',
    title: 'Describe the Picture',
    topic: 'Describe what you see in the picture in detail.',
    timeLimit: 20,
    wordLimit: 150,
    preparationTime: 2,
    imageUrl: 'https://example.com/sample-image.jpg',
  },
  {
    id: 'argumentative-1',
    type: 'argumentative',
    title: 'Education and Online Learning',
    topic:
      'Online learning is more effective than traditional classroom learning. To what extent do you agree or disagree with this statement?',
    timeLimit: 30,
    wordLimit: 250,
  },
];
