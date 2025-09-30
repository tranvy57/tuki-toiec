import { Vocabulary } from "@/types/implements/vocabulary";

export const mockVocabularies: Vocabulary[] = [
  {
    word: "accomplish",
    meaning: "hoàn thành, đạt được",
    pronunciation: "/əˈkʌmplɪʃ/",
    partOfSpeech: "verb",
    exampleEn: "She was able to accomplish her goals within the deadline.",
    exampleVn: "Cô ấy đã có thể hoàn thành mục tiêu trong thời hạn.",
    audioUrl: "https://example.com/audio/accomplish.mp3"
  },
  {
    word: "beneficial",
    meaning: "có lợi, có ích",
    pronunciation: "/ˌbenɪˈfɪʃl/",
    partOfSpeech: "adjective",
    exampleEn: "Regular exercise is beneficial for your health.",
    exampleVn: "Tập thể dục thường xuyên có lợi cho sức khỏe của bạn.",
    audioUrl: "https://example.com/audio/beneficial.mp3"
  },
  {
    word: "colleague",
    meaning: "đồng nghiệp",
    pronunciation: "/ˈkɒliːɡ/",
    partOfSpeech: "noun",
    exampleEn: "I discussed the project with my colleague.",
    exampleVn: "Tôi đã thảo luận dự án với đồng nghiệp của mình.",
    audioUrl: "https://example.com/audio/colleague.mp3"
  },
  {
    word: "demonstrate",
    meaning: "chứng minh, thể hiện",
    pronunciation: "/ˈdemənstreɪt/",
    partOfSpeech: "verb",
    exampleEn: "The teacher will demonstrate how to solve the problem.",
    exampleVn: "Giáo viên sẽ chứng minh cách giải quyết vấn đề.",
    audioUrl: "https://example.com/audio/demonstrate.mp3"
  },
  {
    word: "efficient",
    meaning: "hiệu quả",
    pronunciation: "/ɪˈfɪʃnt/",
    partOfSpeech: "adjective",
    exampleEn: "This new system is more efficient than the old one.",
    exampleVn: "Hệ thống mới này hiệu quả hơn hệ thống cũ.",
    audioUrl: "https://example.com/audio/efficient.mp3"
  },
  {
    word: "frequently",
    meaning: "thường xuyên",
    pronunciation: "/ˈfriːkwəntli/",
    partOfSpeech: "adverb",
    exampleEn: "She frequently travels for business.",
    exampleVn: "Cô ấy thường xuyên đi công tác.",
    audioUrl: "https://example.com/audio/frequently.mp3"
  },
  {
    word: "generate",
    meaning: "tạo ra, sinh ra",
    pronunciation: "/ˈdʒenəreɪt/",
    partOfSpeech: "verb",
    exampleEn: "The new policy will generate more revenue.",
    exampleVn: "Chính sách mới sẽ tạo ra nhiều doanh thu hơn.",
    audioUrl: "https://example.com/audio/generate.mp3"
  },
  {
    word: "implement",
    meaning: "thực hiện, triển khai",
    pronunciation: "/ˈɪmplɪment/",
    partOfSpeech: "verb",
    exampleEn: "We need to implement the new strategy immediately.",
    exampleVn: "Chúng ta cần triển khai chiến lược mới ngay lập tức.",
    audioUrl: "https://example.com/audio/implement.mp3"
  },
  {
    word: "maintain",
    meaning: "duy trì, bảo trì",
    pronunciation: "/meɪnˈteɪn/",
    partOfSpeech: "verb",
    exampleEn: "It's important to maintain good relationships with customers.",
    exampleVn: "Việc duy trì mối quan hệ tốt với khách hàng là quan trọng.",
    audioUrl: "https://example.com/audio/maintain.mp3"
  },
  {
    word: "opportunity",
    meaning: "cơ hội",
    pronunciation: "/ˌɒpəˈtjuːnəti/",
    partOfSpeech: "noun",
    exampleEn: "This job offers great opportunities for advancement.",
    exampleVn: "Công việc này mang lại cơ hội thăng tiến tuyệt vời.",
    audioUrl: "https://example.com/audio/opportunity.mp3"
  }
];

export async function getVocabularies() {
  // Simulate API call
  return {
    data: mockVocabularies,
    total: mockVocabularies.length
  };
}

export async function getWordAudioUrl(word: string): Promise<string | null> {
  // Simulate getting audio URL
  return `https://example.com/audio/${word.toLowerCase()}.mp3`;
}
