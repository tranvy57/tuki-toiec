import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuki TOEIC® - Luyện thi TOEIC hiệu quả",
  description: "Ứng dụng luyện thi TOEIC với hệ thống bài học và đề thi phong phú",
};

export default function ToeicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="">
        {children}
      </main>
    </div>
  );
}
