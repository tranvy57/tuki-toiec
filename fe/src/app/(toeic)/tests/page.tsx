"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Search, Users, Clock, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTest } from "@/api/useTest";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function TestListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const { data, isLoading, isError } = useTest();

  const filteredTests = data?.filter((test) => {
    const matchesSearch = test.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-400/20 rounded-full blur-xl"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 4.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--color-7)]  to-[var(--primary)] bg-clip-text text-transparent">
            Đề Thi Thử TOEIC
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nâng cao kỹ năng tiếng Anh với bộ đề thi thử TOEIC toàn diện của
            chúng tôi
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Tìm kiếm đề thi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200"
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/80 backdrop-blur-sm border-gray-200">
              <SelectValue placeholder="Độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả cấp độ</SelectItem>
              <SelectItem value="beginner">Cơ bản</SelectItem>
              <SelectItem value="intermediate">Trung cấp</SelectItem>
              <SelectItem value="advanced">Nâng cao</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/80 backdrop-blur-sm border-gray-200">
              <SelectValue placeholder="Nguồn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nguồn</SelectItem>
              <SelectItem value="ETS">ETS</SelectItem>
              <SelectItem value="New Economy">New Economy</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Loading state with spinner */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <Spinner className="w-12 h-12 text-purple-500" />
            <p className="text-lg text-muted-foreground">
              Đang tải đề thi TOEIC...
            </p>
          </motion.div>
        )}

        {/* Error state */}
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-red-50 rounded-xl max-w-2xl mx-auto"
          >
            <p className="text-lg text-red-600 font-medium">
              Không thể tải đề thi. Vui lòng thử lại sau.
            </p>
          </motion.div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Test Cards Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
            >
              {filteredTests?.map((test) => (
                <motion.div key={test.id} variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0"
                          >
                            Đề thi thử
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {test.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>200 câu hỏi</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>120 phút</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Sparkles className="w-4 h-4 text-pink-500" />
                          <span>7 phần thi</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <Users className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-700">
                            999+ học viên
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/tests/${test.id}`} className="w-full">
                          <Button className="w-full bg-gradient-to-r from-[var(--color-7)] to-[var(--primary)] hover:from-fuchsia-200-700 hover:via-orange-400 hover:to-yellow-400 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                            Bắt đầu luyện tập
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {filteredTests?.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-lg text-muted-foreground">
                  Không tìm thấy đề thi phù hợp với tiêu chí tìm kiếm
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}