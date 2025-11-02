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

export const getWeaknessLabel = (strength: number) => {
  if (strength < 0.25) {
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
    // Mock audio play - in real app, would use Web Audio API
    toast.success("Đang phát âm thanh...");
  }
};
