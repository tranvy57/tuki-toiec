import { useSpeakingHistory, createSpeakingAttempt } from './speakingHistory';

// Helper function to add sample data for testing
export const addSampleSpeakingData = () => {
  const { addAttempt } = useSpeakingHistory.getState();

  // Sample attempts for different skills
  const sampleAttempts = [
    createSpeakingAttempt(
      'read_aloud',
      'Read Aloud',
      'Read the following text aloud clearly and naturally.',
      85,
      42
    ),
    createSpeakingAttempt(
      'describe_picture',
      'Describe Picture',
      'Describe what you see in this picture in detail.',
      78,
      65
    ),
    createSpeakingAttempt(
      'respond_to_questions',
      'Respond to Questions',
      'Please introduce yourself and your hobbies.',
      92,
      28
    ),
    createSpeakingAttempt(
      'respond_using_info',
      'Respond Using Information',
      'Based on the schedule provided, recommend the best meeting time.',
      88,
      54
    ),
    createSpeakingAttempt(
      'express_opinion',
      'Express Opinion',
      'What is your opinion on remote work vs office work?',
      76,
      87
    ),
  ];

  // Add some additional attempts with different timestamps
  const now = new Date();
  sampleAttempts.forEach((attempt, index) => {
    // Spread attempts over the last few days
    const attemptWithPastDate = {
      ...attempt,
      id: `sample-${index}-${Date.now()}`,
      attemptDate: new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000), // Each attempt 1 day earlier
      details: {
        ...attempt.details,
        transcription: getRandomTranscription(attempt.details.taskType),
        feedback: getRandomFeedback(attempt.score),
      },
    };
    addAttempt(attemptWithPastDate);
  });

  // Add some failed/in-progress attempts
  const failedAttempt = createSpeakingAttempt(
    'read_aloud',
    'Read Aloud',
    'Practice reading this news article.',
    0,
    12
  );
  failedAttempt.status = 'failed';
  failedAttempt.attemptDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  addAttempt(failedAttempt);

  console.log('Sample speaking history data added!');
};

// Helper functions for realistic sample data
function getRandomTranscription(taskType: string): string {
  const transcriptions = {
    'Read Aloud': [
      'The weather today is sunny with a high of 25 degrees Celsius. It is a perfect day for outdoor activities.',
      'Technology has changed the way we communicate and work in modern society.',
      'Learning a new language requires practice, patience, and dedication.',
    ],
    'Describe Picture': [
      'I can see a busy street with many people walking. There are tall buildings on both sides and some trees along the sidewalk.',
      'This picture shows a beautiful park with green grass and a small lake. There are ducks swimming in the water.',
      'The image depicts a modern office with computers on desks and people working.',
    ],
    'Respond to Questions': [
      'Hello, my name is John and I enjoy reading books and playing tennis in my free time.',
      'I work as a software engineer and I have been in this field for about 3 years.',
      'I love traveling and have visited many countries including Japan, France, and Australia.',
    ],
    'Respond Using Information': [
      'According to the schedule, I would recommend meeting at 2 PM on Tuesday as it appears to be the only time when all participants are available.',
      'Based on the information provided, the best option would be the afternoon session since it has fewer conflicts.',
      'Looking at the data, I suggest we choose the morning time slot as it works for most team members.',
    ],
    'Express Opinion': [
      'I believe remote work offers more flexibility and work-life balance, but office work provides better collaboration and team building opportunities.',
      'In my opinion, both options have their advantages. Remote work is efficient but office work builds stronger relationships.',
      'I think the future of work will be hybrid, combining the benefits of both remote and in-person work.',
    ],
  };

  const typeTranscriptions = transcriptions[taskType] || transcriptions['Read Aloud'];
  return typeTranscriptions[Math.floor(Math.random() * typeTranscriptions.length)];
}

function getRandomFeedback(score: number): string {
  if (score >= 85) {
    return 'Excellent work! Your pronunciation is clear and your pace is natural. Keep up the great performance!';
  } else if (score >= 70) {
    return 'Good job! Your response was well-structured. Consider working on pronunciation of some words and speaking more fluently.';
  } else if (score >= 60) {
    return 'Adequate performance. Focus on improving your pronunciation and speaking more confidently. Practice more to enhance fluency.';
  } else {
    return 'Needs improvement. Work on basic pronunciation and try to speak more clearly. Regular practice will help you improve significantly.';
  }
}

// Utility to clear all data (for testing)
export const clearAllSpeakingData = () => {
  const { clearHistory } = useSpeakingHistory.getState();
  clearHistory();
  console.log('All speaking history cleared!');
};
