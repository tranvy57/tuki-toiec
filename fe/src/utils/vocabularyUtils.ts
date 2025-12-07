import { toast } from "sonner";
import { WeakVocabulary } from "@/types/implements/vocabulary";

export const getWeaknessColor = (level: string) => {
  switch (level) {
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    case "moderate":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "mild":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export const getWeaknessLabel = (strength: number, timesReviewed: number) => {
  if(timesReviewed < 10) {
    return "Từ mới";
  }
  if (strength < 0.15) {
    return "Rất yếu";
  }
  if (strength < 0.5) {
    return "Trung bình";
  }
  if (strength < 0.75) {
    return "Hơi yếu";
  }
  if (strength < 0.9) {
    return "Tốt";
  }
  return "";
};

export const generateQuizOptions = (
  correctMeaning: string,
  allVocabularies: WeakVocabulary[]
) => {
  const otherMeanings = allVocabularies
    .filter((v) => v.meaning !== correctMeaning)
    .map((v) => v.meaning);

  // Shuffle and take 3 random incorrect options
  const shuffled = otherMeanings.sort(() => 0.5 - Math.random());
  const incorrectOptions = shuffled.slice(0, 3);

  // Combine and shuffle all options
  const allOptions = [correctMeaning, ...incorrectOptions];
  return allOptions.sort(() => 0.5 - Math.random());
};

export const playAudio = (audioUrl?: string) => {
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
        toast.error("Không thể phát âm thanh");
      });
    } catch (error) {
      console.error("Audio playback error:", error);
      toast.error("Lỗi phát âm thanh");
    }
  } else {
    toast.error("Không có file âm thanh");
  }
};
