"use client";

import { useParams } from "next/navigation";
import { Loader2, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeakingExerciseBase from "@/components/practice/speaking/SpeakingExerciseBase";
import ReadAloudExercise from "@/components/practice/speaking/ReadAloudExercise";
import RepeatSentenceExercise from "@/components/practice/speaking/RepeatSentenceExercise";
import DescribePictureExercise from "@/components/practice/speaking/DescribePictureExercise";
import RespondUsingInfoExercise from "@/components/practice/speaking/RespondUsingInfoExercise";
import ExpressOpinionExercise from "@/components/practice/speaking/ExpressOpinionExercise";
import { useLessonsByModality, type LessonItem } from "@/api/useLessons";
import { PracticeBreadcrumb } from "@/components/practice";

// Mock data cho các loại bài tập nói khác (chưa có API)
const mockExerciseData = {
  "repeat-sentence": {
    id: "2",
    name: "Repeat Sentence",
    vietnameseName: "Nhắc lại câu",
    title: "Nghe và nhắc lại câu sau",
    prompt:
      "The company will introduce a new training program for employees next month. This program aims to enhance their professional skills and improve workplace efficiency.",
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    duration: 15,
    timeLimit: "15 giây",
    audio_url:
      "https://s4-media1.study4.com/media/tez_media/sound/eco_toeic_1000_test_1_7.mp3",
    target_transcript:
      "Where was the company picnic held?(A) In April.(B) Refreshments will be provided.(C) At a park next to a lake.",
    instructions: [
      "Nghe kỹ câu được phát",
      "Nhắc lại chính xác từng từ",
      "Giữ nguyên ngữ điệu và nhấn âm",
      "Không thêm bớt từ nào",
    ],
    sample_result: {
      user_transcript:
        "The project been completed ahead schedule and under budget.",
      target_transcript:
        "The project has been completed ahead of schedule and under budget.",
      accuracy_score: 83,
      pronunciation_score: 85,
      fluency_score: 79,
      feedback:
        "You missed 'has' and 'of'. Try slowing down a little to catch all words.",
    },
  },
  "describe-picture": {
    id: "3",
    type: "describe_picture",
    name: "Describe a Picture",
    vietnameseName: "Mô tả hình ảnh",
    title: "Mô tả hình ảnh trong 30 giây",
    prompt: "Nhìn vào hình ảnh và mô tả chi tiết những gì bạn nhìn thấy.",
    difficulty: "Medium",
    difficultyColor: "bg-yellow-100 text-yellow-800",
    duration: 30,
    timeLimit: "30 giây",
    image_url: "/images/airport_waiting.jpg",
    instructions: [
      "Quan sát kỹ tất cả chi tiết trong hình",
      "Mô tả người, vật, hành động rõ ràng",
      "Sử dụng từ vựng phong phú và chính xác",
      "Tổ chức ý tưởng logic và mạch lạc",
    ],
    sample_feedback: {
      grammar_score: 89,
      vocabulary_score: 76,
      fluency_score: 84,
      pronunciation_score: 82,
      feedback:
        "Good pronunciation and fluency. Try adding more descriptive vocabulary like 'busy', 'crowded', or specific clothing details.",
    },
  },
};

export default function SpeakingExercisePage() {
  const params = useParams();
  const slug = params.slug as string;
  const topicId = params.topicId as string;

  // Fetch API data for read_aloud
  const { data: readAloudLessons, isLoading: readAloudLoading, error: readAloudError } = useLessonsByModality({
    modality: "read_aloud",
    skillType: "speaking",
    enabled: slug === "read-aloud"
  });

  // Fetch API data for describe_picture
  const { data: describePictureLessons, isLoading: describePictureLoading, error: describePictureError } = useLessonsByModality({
    modality: "describe_picture",
    skillType: "speaking",
    enabled: slug === "describe-picture"
  });

  // Fetch API data for respond_using_info
  const { data: respondUsingInfoLessons, isLoading: respondUsingInfoLoading, error: respondUsingInfoError } = useLessonsByModality({
    modality: "respond_using_info",
    skillType: "speaking",
    enabled: slug === "respond-using-info"
  });

  // Fetch API data for express_opinion
  const { data: expressOpinionLessons, isLoading: expressOpinionLoading, error: expressOpinionError } = useLessonsByModality({
    modality: "express_opinion",
    skillType: "speaking",
    enabled: slug === "express-opinion"
  });

  // Get current lesson item from API or mock data
  let currentItem: LessonItem | null = null;
  let exerciseData: any = null;

  if (slug === "read-aloud" && readAloudLessons) {
    // Find item in read_aloud API data
    for (const lesson of readAloudLessons) {
      const found = lesson.items.find(item => item.id === topicId);
      if (found) {
        currentItem = found;
        // Map API data to exerciseData format
        exerciseData = {
          ...found,
          name: "Read Aloud",
          vietnameseName: "Đọc đoạn văn",
          type: "read_aloud",
          // Map speaking_time to duration for compatibility with existing logic
          duration: found.promptJsonb?.speaking_time || 45,
          timeLimit: `${found.promptJsonb?.speaking_time || 45} giây`,
        };
        break;
      }
    }
  } else if (slug === "describe-picture" && describePictureLessons) {
    // Find item in describe_picture API data
    for (const lesson of describePictureLessons) {
      const found = lesson.items.find(item => item.id === topicId);
      if (found) {
        currentItem = found;
        // Map API data to exerciseData format
        exerciseData = {
          ...found,
          name: "Describe a Picture",
          vietnameseName: "Mô tả hình ảnh",
          // Map speaking_time to duration for compatibility with existing logic
          duration: found.promptJsonb?.speaking_time || 30,
          timeLimit: `${found.promptJsonb?.speaking_time || 30} giây`,
        };
        break;
      }
    }
  } else if (slug === "respond-using-info" && respondUsingInfoLessons) {
    // Find lesson by lessonId in respond_using_info API data
    const foundLesson = respondUsingInfoLessons.find(lesson => lesson.lessonId === topicId);
    if (foundLesson) {
      // Use the entire lesson with all items
      exerciseData = {
        lessonId: foundLesson.lessonId,
        items: foundLesson.items,
        name: "Respond Using Information",
        vietnameseName: "Trả lời thông tin",
        // Use the first item's duration as default
        duration: foundLesson.items[0]?.promptJsonb?.speaking_time || 15,
        timeLimit: `${foundLesson.items[0]?.promptJsonb?.speaking_time || 15} giây`,
      };
    }
  } else if (slug === "express-opinion" && expressOpinionLessons) {
    // Find lesson by lessonId in express_opinion API data
    const foundLesson = expressOpinionLessons.find(lesson => lesson.lessonId === topicId);
    if (foundLesson) {
      // Use the entire lesson with all items
      exerciseData = {
        lessonId: foundLesson.lessonId,
        type: "express_opinion",
        items: foundLesson.items,
        name: "Express Opinion",
        vietnameseName: "Nêu quan điểm cá nhân",
        // Use the first item's duration as default
        duration: foundLesson.items[0]?.promptJsonb?.speaking_time || 60,
        timeLimit: `${foundLesson.items[0]?.promptJsonb?.speaking_time || 60} giây`,
      };
    }
  } else {
    // Use mock data for other types
    exerciseData = mockExerciseData[slug as keyof typeof mockExerciseData];
  }

  // Show loading for API-backed exercises
  if ((slug === "read-aloud" && readAloudLoading) || (slug === "describe-picture" && describePictureLoading) || (slug === "respond-using-info" && respondUsingInfoLoading) || (slug === "express-opinion" && expressOpinionLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Đang tải bài tập...</h2>
        </div>
      </div>
    );
  }

  // Show error for API-backed exercises
  if ((slug === "read-aloud" && readAloudError) || (slug === "describe-picture" && describePictureError) || (slug === "respond-using-info" && respondUsingInfoError) || (slug === "express-opinion" && expressOpinionError)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Không thể tải bài tập</h2>
          <p className="text-gray-500 mb-4">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  if (!exerciseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy bài tập này.</p>
        </div>
      </div>
    );
  }

  // Render specific exercise component based on slug
  const renderExerciseContent = () => {
    switch (slug) {
      case "read-aloud":
        return (
          <div className="container mx-auto mt-4">
            <PracticeBreadcrumb
              items={[
                { label: "Speaking", href: "/practice/speaking" },
                { label: "Bài tập", href: `/practice/speaking/${slug}` },
                { label: exerciseData?.vietnameseName || 'Chi tiết' }
              ]}
            />
            <SpeakingExerciseBase exerciseData={exerciseData}>
              <ReadAloudExercise exerciseData={exerciseData} />
            </SpeakingExerciseBase>
          </div>
        );
      case "repeat-sentence":
        return (
          <div className="container mx-auto mt-4">
            <PracticeBreadcrumb
              items={[
                { label: "Speaking", href: "/practice/speaking" },
                { label: "Bài tập", href: `/practice/speaking/${slug}` },
                { label: exerciseData?.vietnameseName || 'Chi tiết' }
              ]}
            />
            <SpeakingExerciseBase exerciseData={exerciseData}>
              <RepeatSentenceExercise exerciseData={exerciseData} />
            </SpeakingExerciseBase>
          </div>
        );
      case "describe-picture":
        return (
          <div className="container mx-auto mt-4">
            <PracticeBreadcrumb
              items={[
                { label: "Speaking", href: "/practice/speaking" },
                { label: "Bài tập", href: `/practice/speaking/${slug}` },
                { label: exerciseData?.vietnameseName || 'Chi tiết' }
              ]}
            />
            <SpeakingExerciseBase exerciseData={exerciseData}>
              <DescribePictureExercise exerciseData={exerciseData} />
            </SpeakingExerciseBase>
          </div>
        );
      case "respond-using-info":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
              <PracticeBreadcrumb
                items={[
                  { label: "Speaking", href: "/practice/speaking" },
                  { label: "Bài tập", href: `/practice/speaking/${slug}` },
                  { label: exerciseData?.vietnameseName || 'Chi tiết' }
                ]}
              />
              <RespondUsingInfoExercise exerciseData={exerciseData} />
            </div>
          </div>
        );
      case "express-opinion":
        return (
          <div className="container mx-auto mt-4">
            <PracticeBreadcrumb
              items={[
                { label: "Speaking", href: "/practice/speaking" },
                { label: "Bài tập", href: `/practice/speaking/${slug}` },
                { label: exerciseData?.vietnameseName || 'Chi tiết' }
              ]}
            />
            <SpeakingExerciseBase exerciseData={exerciseData}>
              <ExpressOpinionExercise exerciseData={exerciseData} />
            </SpeakingExerciseBase>
          </div>
        );
      default:
        return (
          <div className="container mx-auto mt-4">
            <PracticeBreadcrumb
              items={[
                { label: "Speaking", href: "/practice/speaking" },
                { label: "Bài tập", href: `/practice/speaking/${slug}` },
                { label: exerciseData?.vietnameseName || 'Chi tiết' }
              ]}
            />
            <SpeakingExerciseBase exerciseData={exerciseData}>
              <ReadAloudExercise exerciseData={exerciseData} />
            </SpeakingExerciseBase>
          </div>
        );
    }
  };

  return renderExerciseContent();
}
