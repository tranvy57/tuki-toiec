"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Clock,
  FileText,
  MessageSquare,
  Info,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTestById } from "@/api/useTest";
import { usePracticeTest } from "@/hooks";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TestDetailPage() {
  const params = useParams();
  const {
    data: testData,
    isLoading,
    isError,
  } = useTestById(params.id as string);
  const router = useRouter();

  const { clearPersistedState } = usePracticeTest();

  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [openParts, setOpenParts] = useState<string[]>([
    testData?.parts[0]?.id || "",
  ]);

  const togglePart = (partId: string) => {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  const toggleOpen = (partId: string) => {
    setOpenParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  const selectAll = () => {
    setSelectedParts(testData?.parts.map((part) => part.id) ?? []);
  };

  const deselectAll = () => {
    setSelectedParts([]);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50/50 min-h-full py-5">
      <div className="container mx-auto px-8 py-6 max-w-5xl bg-white border border-gray-200 shadow-lg rounded-2xl ">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8  my-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-pink-500 to-primary text-white border-0 shadow-sm">
              #TOEIC
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            {testData?.title}
          </h1>
          {/* Info Box */}
          <div className="">
            <div className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-semibold">120 phút</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phần thi</p>
                    <p className="font-semibold">7 phần</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Câu hỏi</p>
                    <p className="font-semibold">200</p>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <Alert className="mt-6 border-red-200 bg-red-50">
                <Info className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-medium">
                  Để nhận điểm số chuẩn, vui lòng hoàn thành chế độ BÀI THI ĐẦY
                  ĐỦ.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </motion.div>

        <div className="overflow-x-auto mb-5 border border-gray-300">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Ngày làm
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Kết quả
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Thời gian làm bài
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      07/10/2025
                    </span>
                    <Badge className="w-fit mt-1 bg-green-100 text-green-800 border-green-200 text-xs">
                      Full test
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-gray-900">
                    0/200
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">0:00:09</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Xem chi tiết
                  </Button>
                </td>
              </tr>

              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      20/09/2025
                    </span>
                    <Badge className="w-fit mt-1 bg-green-100 text-green-800 border-green-200 text-xs">
                      Full test
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      1/200
                    </span>
                    <span className="text-xs text-gray-500">(Điểm: 15)</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">0:00:12</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Xem chi tiết
                  </Button>
                </td>
              </tr>

              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      09/08/2025
                    </span>
                    <Badge className="w-fit mt-1 bg-green-100 text-green-800 border-green-200 text-xs">
                      Full test
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-gray-900">
                    0/200
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">0:00:07</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Xem chi tiết
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Empty state nếu không có kết quả */}
        {/* <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <FileText className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        Bạn chưa có kết quả làm bài nào. Hãy bắt đầu làm bài thi để xem kết quả.
                      </p>
                    </div> */}

        {/* Tabs Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="practice" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-md">
              <TabsTrigger
                value="practice"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:bg-pink-400 data-[state=active]:text-white"
              >
                Chế độ Luyện tập
              </TabsTrigger>
              <TabsTrigger
                value="fulltest"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:bg-pink-400 data-[state=active]:text-white"
              >
                Chế độ Thi đầy đủ
              </TabsTrigger>
              
            </TabsList>

            <TabsContent value="practice" className="space-y-6">
              {/* Pro Tips Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Lightbulb className="w-5 h-5" />
                      Mẹo Học tập
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 leading-relaxed">
                      <strong>Chế độ Luyện tập</strong> cho phép bạn chọn các
                      phần cụ thể để tập trung luyện tập. Hoàn hảo cho việc
                      luyện tập có mục tiêu và cải thiện kỹ năng. Để có điểm số
                      chính thức, hãy chuyển sang{" "}
                      <strong>Chế độ Thi đầy đủ</strong> mô phỏng trải nghiệm
                      thi thật với đầy đủ 7 phần và thời gian nghiêm ngặt.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Parts Checklist */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Chọn Phần Thi
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAll}
                      className="text-sm bg-transparent"
                    >
                      Chọn tất cả
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAll}
                      className="text-sm bg-transparent"
                    >
                      Bỏ chọn tất cả
                    </Button>
                  </div>
                </div>

                {testData?.parts.map((part, index) => (
                  <motion.div key={part.id} variants={fadeInUp}>
                    <Collapsible
                      open={openParts.includes(part.id)}
                      onOpenChange={() => toggleOpen(part.id)}
                    >
                      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
                        <CollapsibleTrigger className="w-full" asChild>
                          <CardHeader className="hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Checkbox
                                  checked={selectedParts.includes(part.id)}
                                  onCheckedChange={() => togglePart(part.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="border-2"
                                />
                                <div className="text-left">
                                  <CardTitle className="text-lg font-bold text-gray-900">
                                    Part {part.partNumber}
                                  </CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {part.groups
                                      .map((group) => group.questions.length)
                                      .reduce((a, b) => a + b, 0)}{" "}
                                    câu hỏi
                                  </p>
                                </div>
                              </div>
                              {openParts.includes(part.id) ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 pb-4">
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-wrap gap-2 pt-2"
                              >
                                {part.skills.map((skill, skillIndex) => (
                                  <motion.div
                                    key={skill.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: skillIndex * 0.05 }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
                                    >
                                      {skill.name}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </AnimatePresence>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </motion.div>
                ))}
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky bottom-6 pt-6"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Button
                    disabled={selectedParts.length === 0}
                    className="w-full py-6 text-lg font-bold bg-pink-400 to-primary hover:bg-pink-300 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bắt đầu Phần đã chọn ({selectedParts.length})
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="fulltest" className="space-y-6">
              <div className="">
                <div className="space-y-4">
                 
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      Đảm bảo bạn có 2 giờ liên tục không bị gián đoạn trước khi
                      bắt đầu bài thi đầy đủ.
                    </AlertDescription>
                  </Alert>
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Button
                      onClick={() => {
                        try {
                          clearPersistedState();
                        } catch (e) {
                          console.warn(
                            "Không thể xóa cache practice-test-storage:",
                            e
                          );
                        }
                        router.push(`/tests/${testData?.id}/start`);
                      }}
                      className="w-full py-6 text-lg font-bold bg-pink-400 hover:bg-pink-300 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Bắt đầu Bài thi đầy đủ (120 phút)
                    </Button>
                  </motion.div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
