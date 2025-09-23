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
    <div className="min-h-screen">
      <main className="pt-16 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
