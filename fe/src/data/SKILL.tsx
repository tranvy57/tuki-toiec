import { BookOpen, Headphones, Mic, Pencil } from "lucide-react";

export const skillsData = [
  {
    id: "listening",
    name: "Luyện Listening",
    level: "A2 - B2",
    color: "from-blue-500 to-blue-700",
    icon: Headphones,
    description:
      "Làm quen với các đoạn hội thoại, thông báo và hội nghị theo định dạng TOEIC Listening.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAtUWBlqAXrBL6JKUJnZwx-IKwZgZMvvxRNg&s",
    href: "/practice/listening",
  },
  {
    id: "reading",
    name: "Luyện Reading",
    level: "A2 - B2",
    color: "from-emerald-500 to-teal-600",
    icon: BookOpen,
    description:
      "Luyện đọc hiểu đoạn văn, email và thông báo, phát triển kỹ năng skimming và scanning.",
    image:
      "https://englishlabs.in/wp-content/uploads/2021/11/how-to-improve-english-reading-with-seven-easy-steps.jpg",
    href: "/practice/reading",
  },
  {
    id: "speaking",
    name: "Luyện Speaking",
    level: "B1 - C1",
    color: "from-pink-500 to-rose-600",
    icon: Mic,
    description:
      "Luyện tập mô tả tranh, trả lời câu hỏi và trình bày ý kiến theo định dạng TOEIC Speaking.",
    image: "https://i.scdn.co/image/ab6765630000ba8ae145abdfc91427ebed0f0839",
    href: "/practice/speaking",
  },
  {
    id: "writing",
    name: "Luyện Writing",
    level: "B1 - C1",
    color: "from-amber-500 to-orange-600",
    icon: Pencil,
    description:
      "Phát triển kỹ năng viết email, mô tả biểu đồ và phản hồi tình huống trong TOEIC Writing.",
    image:
      "https://thebuzzie.com/wp-content/uploads/2022/07/how-to-improve-writing-skills.png",
    href: "/practice/writing",
  },
];
