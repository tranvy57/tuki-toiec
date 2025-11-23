import {
  useSpeakingHistory,
  createSpeakingAttempt,
} from "@/store/speaking-history-store";

// Helper function to add sample data for testing
export const addSampleSpeakingData = () => {
  const { addAttempt } = useSpeakingHistory.getState();

  // Sample attempts for different skills
  const sampleAttempts = [
    createSpeakingAttempt(
      "describe-picture",
      "Mô tả hình ảnh",
      "Mô tả chi tiết những gì bạn thấy trong bức tranh này.",
      85,
      42,
      "topic-1"
    ),
    createSpeakingAttempt(
      "read-aloud",
      "Đọc to",
      "Đọc đoạn văn sau một cách rõ ràng và tự nhiên.",
      78,
      35,
      "lesson-1"
    ),
    createSpeakingAttempt(
      "respond-questions",
      "Trả lời câu hỏi",
      "Hãy giới thiệu về bản thân và sở thích của bạn.",
      92,
      28,
      "topic-2"
    ),
    createSpeakingAttempt(
      "respond-information",
      "Phản hồi thông tin",
      "Dựa vào lịch trình được cung cấp, đưa ra khuyến nghị về thời gian họp phù hợp nhất.",
      88,
      54,
      "topic-3"
    ),
    createSpeakingAttempt(
      "express-opinion",
      "Bày tỏ quan điểm",
      "Bạn nghĩ gì về làm việc từ xa so với làm việc tại văn phòng?",
      76,
      87,
      "topic-4"
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
    "read-aloud",
    "Đọc to",
    "Luyện tập đọc bài báo tin tức này.",
    0,
    12,
    "lesson-2"
  );
  failedAttempt.status = "failed";
  failedAttempt.attemptDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  addAttempt(failedAttempt);

  console.log("Đã thêm dữ liệu mẫu lịch sử speaking!");
};

// Helper functions for realistic sample data
function getRandomTranscription(taskType: string): string {
  const transcriptions = {
    "Đọc to": [
      "Thời tiết hôm nay rất đẹp với nhiệt độ cao nhất là 25 độ C. Đây là ngày hoàn hảo cho các hoạt động ngoài trời.",
      "Công nghệ đã thay đổi cách chúng ta giao tiếp và làm việc trong xã hội hiện đại.",
      "Học một ngôn ngữ mới đòi hỏi sự luyện tập, kiên nhẫn và cống hiến.",
    ],
    "Mô tả hình ảnh": [
      "Tôi có thể thấy một con phố đông đúc với nhiều người đang đi bộ. Có những tòa nhà cao tầng ở hai bên và một số cây xanh dọc theo vỉa hè.",
      "Bức tranh này cho thấy một công viên đẹp với cỏ xanh và một cái hồ nhỏ. Có những chú vịt đang bơi trong nước.",
      "Hình ảnh mô tả một văn phòng hiện đại với máy tính trên bàn làm việc và mọi người đang làm việc.",
    ],
    "Trả lời câu hỏi": [
      "Xin chào, tên tôi là Minh và tôi thích đọc sách và chơi tennis trong thời gian rảnh.",
      "Tôi làm việc như một kỹ sư phần mềm và tôi đã làm trong lĩnh vực này được khoảng 3 năm.",
      "Tôi thích du lịch và đã đến thăm nhiều quốc gia bao gồm Nhật Bản, Pháp và Úc.",
    ],
    "Phản hồi thông tin": [
      "Theo lịch trình, tôi sẽ khuyên nên họp lúc 2 giờ chiều thứ Ba vì đây dường như là thời gian duy nhất mà tất cả người tham gia đều có thể tham dự.",
      "Dựa trên thông tin được cung cấp, lựa chọn tốt nhất sẽ là buổi chiều vì có ít xung đột hơn.",
      "Nhìn vào dữ liệu, tôi đề nghị chúng ta chọn khung giờ buổi sáng vì phù hợp với hầu hết các thành viên trong nhóm.",
    ],
    "Bày tỏ quan điểm": [
      "Tôi tin rằng làm việc từ xa mang lại sự linh hoạt và cân bằng công việc-cuộc sống tốt hơn, nhưng làm việc tại văn phòng lại cung cấp cơ hội hợp tác và xây dựng nhóm tốt hơn.",
      "Theo ý kiến của tôi, cả hai lựa chọn đều có ưu điểm riêng. Làm việc từ xa hiệu quả nhưng làm việc tại văn phòng xây dựng mối quan hệ mạnh mẽ hơn.",
      "Tôi nghĩ tương lai của công việc sẽ là hybrid, kết hợp lợi ích của cả làm việc từ xa và trực tiếp.",
    ],
  };

  const typeTranscriptions =
    transcriptions[taskType] || transcriptions["Đọc to"];
  return typeTranscriptions[
    Math.floor(Math.random() * typeTranscriptions.length)
  ];
}

function getRandomFeedback(score: number): string {
  if (score >= 85) {
    return "Xuất sắc! Phát âm của bạn rất rõ ràng và nhịp độ nói rất tự nhiên. Hãy tiếp tục duy trì phong độ tuyệt vời này!";
  } else if (score >= 70) {
    return "Làm tốt! Câu trả lời của bạn có cấu trúc rõ ràng. Hãy cân nhắc cải thiện phát âm một số từ và nói lưu loát hơn.";
  } else if (score >= 60) {
    return "Hiệu suất đạt yêu cầu. Tập trung vào việc cải thiện phát âm và nói tự tin hơn. Luyện tập thường xuyên sẽ giúp bạn nâng cao độ lưu loát.";
  } else {
    return "Cần cải thiện. Hãy làm việc trên phát âm cơ bản và cố gắng nói rõ ràng hơn. Luyện tập đều đặn sẽ giúp bạn tiến bộ đáng kể.";
  }
}

// Utility to clear all data (for testing)
export const clearAllSpeakingData = () => {
  const { clearHistory } = useSpeakingHistory.getState();
  clearHistory();
  console.log("Đã xóa toàn bộ lịch sử speaking!");
};
