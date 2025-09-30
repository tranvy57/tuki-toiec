import { SpeakingTopic } from "@/components/toeic/speaking/speaking-topic-selector";

export const speakingTopicsData: SpeakingTopic[] = [
  {
    id: "1",
    title: "Self Introduction & Personal Background",
    description: "Learn to introduce yourself confidently and talk about your personal background",
    difficulty: "beginner",
    category: "Personal",
    estimatedTime: 15,
    popularity: 95,
    tags: ["introduction", "personal", "basic", "confidence"],
    questions: [
      "Could you please introduce yourself?",
      "What are your hobbies and interests?",
      "Tell me about your daily routine.",
      "What are your goals for the future?",
      "Describe your personality in three words.",
      "What makes you unique?"
    ]
  },
  {
    id: "2",
    title: "Describing Places & Locations",
    description: "Practice describing different places, from your hometown to dream destinations",
    difficulty: "intermediate",
    category: "Descriptive",
    estimatedTime: 20,
    popularity: 88,
    tags: ["description", "places", "travel", "vocabulary"],
    questions: [
      "Describe your hometown in detail.",
      "What's your favorite place to visit and why?",
      "Compare city life with countryside life.",
      "Describe a memorable trip you took.",
      "What makes a place beautiful to you?",
      "Where would you like to live in the future?"
    ]
  },
  {
    id: "3",
    title: "Work & Career Development",
    description: "Discuss professional topics, career aspirations, and workplace challenges",
    difficulty: "advanced",
    category: "Professional",
    estimatedTime: 25,
    popularity: 92,
    tags: ["career", "work", "professional", "skills"],
    questions: [
      "What is your ideal job and why?",
      "Describe the challenges of working in a team.",
      "How do you handle stress at work?",
      "What skills are important for success in your field?",
      "How do you balance work and personal life?",
      "What motivates you in your career?"
    ]
  },
  {
    id: "4",
    title: "Technology & Digital Life",
    description: "Express opinions about technology's impact on modern society and daily life",
    difficulty: "advanced",
    category: "Global Issues",
    estimatedTime: 30,
    popularity: 85,
    tags: ["technology", "digital", "society", "opinion"],
    questions: [
      "How has technology changed our daily lives?",
      "What are the pros and cons of social media?",
      "Do you think AI will replace human jobs?",
      "How can we protect our privacy online?",
      "What role should technology play in education?",
      "How do you manage screen time?"
    ]
  },
  {
    id: "5",
    title: "Food & Culinary Experiences",
    description: "Discuss food preferences, cooking experiences, and cultural cuisines",
    difficulty: "intermediate",
    category: "Lifestyle",
    estimatedTime: 20,
    popularity: 90,
    tags: ["food", "cooking", "culture", "preferences"],
    questions: [
      "Describe your favorite dish and how to prepare it.",
      "What role does food play in your culture?",
      "Do you prefer eating out or cooking at home?",
      "What's the most unusual food you've ever tried?",
      "How important is healthy eating to you?",
      "What would you cook for a special occasion?"
    ]
  },
  {
    id: "6",
    title: "Education & Learning",
    description: "Share thoughts on education systems, learning methods, and academic experiences",
    difficulty: "intermediate",
    category: "Education",
    estimatedTime: 25,
    popularity: 82,
    tags: ["education", "learning", "academic", "methods"],
    questions: [
      "How has your education shaped who you are?",
      "What's the most effective way to learn a language?",
      "Should education be free for everyone?",
      "How important are grades and test scores?",
      "What subject would you like to study more?",
      "How do you prefer to learn new skills?"
    ]
  },
  {
    id: "7",
    title: "Travel & Cultural Exchange",
    description: "Explore travel experiences, cultural differences, and global perspectives",
    difficulty: "intermediate",
    category: "Travel",
    estimatedTime: 25,
    popularity: 94,
    tags: ["travel", "culture", "experiences", "global"],
    questions: [
      "Describe your most memorable travel experience.",
      "How do you prepare for traveling to a new country?",
      "What cultural differences have surprised you?",
      "Would you rather travel alone or with others?",
      "How does travel change a person?",
      "What's on your travel bucket list?"
    ]
  },
  {
    id: "8",
    title: "Health & Wellness",
    description: "Discuss health habits, wellness practices, and lifestyle choices",
    difficulty: "beginner",
    category: "Lifestyle",
    estimatedTime: 15,
    popularity: 78,
    tags: ["health", "wellness", "fitness", "lifestyle"],
    questions: [
      "What do you do to stay healthy?",
      "How important is exercise in your daily routine?",
      "What are your thoughts on healthy eating?",
      "How do you manage stress?",
      "What wellness trends do you follow?",
      "How has your health routine changed over time?"
    ]
  },
  {
    id: "9",
    title: "Environmental Issues & Sustainability",
    description: "Address environmental concerns and discuss sustainable living practices",
    difficulty: "advanced",
    category: "Global Issues",
    estimatedTime: 30,
    popularity: 76,
    tags: ["environment", "sustainability", "climate", "responsibility"],
    questions: [
      "What environmental issues concern you most?",
      "How can individuals contribute to environmental protection?",
      "What changes have you made to live more sustainably?",
      "Should governments regulate environmental practices?",
      "How do you see the future of renewable energy?",
      "What role do businesses play in environmental responsibility?"
    ]
  },
  {
    id: "10",
    title: "Entertainment & Media",
    description: "Share opinions about movies, books, music, and entertainment preferences",
    difficulty: "beginner",
    category: "Lifestyle",
    estimatedTime: 20,
    popularity: 87,
    tags: ["entertainment", "media", "movies", "music"],
    questions: [
      "What type of entertainment do you enjoy most?",
      "Describe a movie or book that impacted you.",
      "How do you discover new music or shows?",
      "Do you prefer streaming services or traditional media?",
      "What role does entertainment play in your life?",
      "How has digital media changed entertainment?"
    ]
  },
  {
    id: "11",
    title: "Friendship & Relationships",
    description: "Explore the importance of relationships and social connections",
    difficulty: "intermediate",
    category: "Personal",
    estimatedTime: 20,
    popularity: 89,
    tags: ["friendship", "relationships", "social", "connections"],
    questions: [
      "What qualities do you value in a friend?",
      "How do you maintain long-distance relationships?",
      "What's the difference between online and offline friendships?",
      "How important is family in your life?",
      "What makes a relationship successful?",
      "How do you handle conflicts with friends?"
    ]
  },
  {
    id: "12",
    title: "Money & Financial Planning",
    description: "Discuss financial goals, spending habits, and economic perspectives",
    difficulty: "advanced",
    category: "Professional",
    estimatedTime: 25,
    popularity: 73,
    tags: ["money", "finance", "planning", "economics"],
    questions: [
      "How do you manage your personal finances?",
      "What's your approach to saving money?",
      "Do you think money can buy happiness?",
      "How important is financial security to you?",
      "What would you do if you won the lottery?",
      "How do you make important financial decisions?"
    ]
  },
  {
    id: "13",
    title: "Time Management & Productivity",
    description: "Share strategies for managing time effectively and staying productive",
    difficulty: "intermediate",
    category: "Professional",
    estimatedTime: 20,
    popularity: 84,
    tags: ["time", "productivity", "organization", "efficiency"],
    questions: [
      "How do you organize your daily schedule?",
      "What productivity techniques work best for you?",
      "How do you prioritize tasks and responsibilities?",
      "What's your biggest time-wasting habit?",
      "How do you balance multiple projects?",
      "What tools or apps help you stay organized?"
    ]
  },
  {
    id: "14",
    title: "Fashion & Personal Style",
    description: "Express your views on fashion trends, personal style, and self-expression",
    difficulty: "beginner",
    category: "Lifestyle",
    estimatedTime: 15,
    popularity: 71,
    tags: ["fashion", "style", "trends", "expression"],
    questions: [
      "How would you describe your personal style?",
      "What influences your clothing choices?",
      "Do you follow fashion trends or create your own?",
      "How important is appearance in daily life?",
      "What's your favorite piece of clothing and why?",
      "How has your style evolved over time?"
    ]
  },
  {
    id: "15",
    title: "Communication & Language Learning",
    description: "Discuss communication skills, language learning experiences, and multilingualism",
    difficulty: "intermediate",
    category: "Education",
    estimatedTime: 25,
    popularity: 91,
    tags: ["communication", "language", "learning", "multilingual"],
    questions: [
      "Why are you learning English?",
      "What's the most challenging aspect of learning a new language?",
      "How do you practice speaking skills?",
      "What advantages does speaking multiple languages provide?",
      "How do you overcome language barriers?",
      "What advice would you give to language learners?"
    ]
  },
  {
    id: "16",
    title: "Innovation & Future Trends",
    description: "Explore emerging trends, innovative ideas, and predictions for the future",
    difficulty: "advanced",
    category: "Global Issues",
    estimatedTime: 30,
    popularity: 79,
    tags: ["innovation", "future", "trends", "predictions"],
    questions: [
      "What innovations excite you most about the future?",
      "How do you stay updated on emerging trends?",
      "What industry do you think will change the most?",
      "How can we prepare for future challenges?",
      "What role will creativity play in the future?",
      "How do you think work will evolve in the next decade?"
    ]
  },
  {
    id: "17",
    title: "Sports & Physical Activities",
    description: "Share experiences with sports, fitness activities, and athletic pursuits",
    difficulty: "beginner",
    category: "Lifestyle",
    estimatedTime: 15,
    popularity: 83,
    tags: ["sports", "fitness", "activities", "competition"],
    questions: [
      "What sports or physical activities do you enjoy?",
      "How important is competition in sports?",
      "What life lessons have you learned from sports?",
      "Do you prefer team sports or individual activities?",
      "How do you motivate yourself to exercise?",
      "What role do sports play in your community?"
    ]
  },
  {
    id: "18",
    title: "Art & Creative Expression",
    description: "Explore artistic interests, creative processes, and cultural appreciation",
    difficulty: "intermediate",
    category: "Lifestyle",
    estimatedTime: 20,
    popularity: 77,
    tags: ["art", "creativity", "culture", "expression"],
    questions: [
      "What forms of art do you appreciate most?",
      "Do you have any creative hobbies?",
      "How does art influence society?",
      "What's your favorite museum or cultural site?",
      "How do you express creativity in your daily life?",
      "What role should arts education play in schools?"
    ]
  },
  {
    id: "19",
    title: "Social Issues & Community",
    description: "Discuss social challenges, community involvement, and civic responsibility",
    difficulty: "advanced",
    category: "Global Issues",
    estimatedTime: 30,
    popularity: 68,
    tags: ["social", "community", "responsibility", "issues"],
    questions: [
      "What social issues are most important to you?",
      "How can individuals make a positive impact in their community?",
      "What role should governments play in solving social problems?",
      "How do you stay informed about current events?",
      "What volunteering experiences have you had?",
      "How can we build stronger communities?"
    ]
  },
  {
    id: "20",
    title: "Dreams & Life Goals",
    description: "Share your aspirations, life goals, and vision for personal growth",
    difficulty: "beginner",
    category: "Personal",
    estimatedTime: 20,
    popularity: 96,
    tags: ["dreams", "goals", "aspirations", "growth"],
    questions: [
      "What are your biggest dreams and aspirations?",
      "How do you set and achieve your goals?",
      "What would you do if you could do anything?",
      "How do you define success in life?",
      "What obstacles have you overcome to reach your goals?",
      "How have your dreams changed as you've grown older?"
    ]
  }
];

export const getTopicsByDifficulty = (difficulty: "beginner" | "intermediate" | "advanced") => {
  return speakingTopicsData.filter(topic => topic.difficulty === difficulty);
};

export const getTopicsByCategory = (category: string) => {
  return speakingTopicsData.filter(topic => topic.category === category);
};

export const getPopularTopics = (limit: number = 5) => {
  return speakingTopicsData
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

export const searchTopics = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return speakingTopicsData.filter(topic => 
    topic.title.toLowerCase().includes(term) ||
    topic.description.toLowerCase().includes(term) ||
    topic.tags.some(tag => tag.toLowerCase().includes(term)) ||
    topic.questions.some(question => question.toLowerCase().includes(term))
  );
};

export const getRandomTopic = (difficulty?: "beginner" | "intermediate" | "advanced") => {
  const topics = difficulty ? getTopicsByDifficulty(difficulty) : speakingTopicsData;
  return topics[Math.floor(Math.random() * topics.length)];
};

