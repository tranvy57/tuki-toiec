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
import { useParams } from "next/navigation";

// Mock test data
const testData = {
  id: 1,
  title: "New Economy TOEIC Test 1",
  duration: 120,
  parts: 7,
  questions: 200,
  comments: 1234,
  parts_detail: [
    {
      id: 1,
      name: "Part 1: Photographs",
      questions: 6,
      tags: ["Description", "People", "Objects", "Scenes"],
    },
    {
      id: 2,
      name: "Part 2: Question-Response",
      questions: 25,
      tags: [
        "WHO",
        "WHERE",
        "HOW",
        "WHY",
        "YES-NO",
        "Suggestion",
        "Tag Question",
      ],
    },
    {
      id: 3,
      name: "Part 3: Conversations",
      questions: 39,
      tags: ["Company", "Event", "Service", "Shopping", "Travel", "Office"],
    },
    {
      id: 4,
      name: "Part 4: Talks",
      questions: 30,
      tags: [
        "Company",
        "Event",
        "Service",
        "Announcement",
        "Advertisement",
        "News",
      ],
    },
    {
      id: 5,
      name: "Part 5: Incomplete Sentences",
      questions: 30,
      tags: ["Grammar", "Vocabulary", "Prepositions", "Conjunctions"],
    },
    {
      id: 6,
      name: "Part 6: Text Completion",
      questions: 16,
      tags: ["Grammar", "Vocabulary", "Context", "Coherence"],
    },
    {
      id: 7,
      name: "Part 7: Reading Comprehension",
      questions: 54,
      tags: [
        "Single Passage",
        "Double Passage",
        "Triple Passage",
        "Email",
        "Article",
        "Advertisement",
      ],
    },
  ],
};

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
  const [selectedParts, setSelectedParts] = useState<number[]>([]);
  const [openParts, setOpenParts] = useState<number[]>([1]);

  const togglePart = (partId: number) => {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  const toggleOpen = (partId: number) => {
    setOpenParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  const selectAll = () => {
    setSelectedParts(testData.parts_detail.map((part) => part.id));
  };

  const deselectAll = () => {
    setSelectedParts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-500 text-white border-0">
              #TOEIC
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {testData.title}
          </h1>

          {/* Info Box */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg rounded-xl">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{testData.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Parts</p>
                    <p className="font-semibold">{testData.parts} parts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Questions</p>
                    <p className="font-semibold">{testData.questions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Comments</p>
                    <p className="font-semibold">{testData.comments}</p>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <Alert className="mt-6 border-red-200 bg-red-50">
                <Info className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-medium">
                  To get scaled score, please complete FULL TEST mode.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

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
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Practice Mode
              </TabsTrigger>
              <TabsTrigger
                value="fulltest"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Full Test Mode
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
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 leading-relaxed">
                      <strong>Practice Mode</strong> allows you to select
                      specific parts to focus on. Perfect for targeted practice
                      and skill improvement. For an official score, switch to{" "}
                      <strong>Full Test Mode</strong> which simulates the real
                      exam experience with all 7 parts and strict timing.
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
                    Select Test Parts
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAll}
                      className="text-sm bg-transparent"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAll}
                      className="text-sm bg-transparent"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                {testData.parts_detail.map((part, index) => (
                  <motion.div key={part.id} variants={fadeInUp}>
                    <Collapsible
                      open={openParts.includes(part.id)}
                      onOpenChange={() => toggleOpen(part.id)}
                    >
                      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
                        <CollapsibleTrigger className="w-full">
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
                                    {part.name}
                                  </CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {part.questions} questions
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
                                {part.tags.map((tag, tagIndex) => (
                                  <motion.div
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: tagIndex * 0.05 }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 hover:from-blue-200 hover:to-purple-200 transition-colors"
                                    >
                                      {tag}
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
                    className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Selected Parts ({selectedParts.length})
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="fulltest" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Full Test Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Complete all 7 parts (200 questions) in 120 minutes to
                    receive your scaled TOEIC score. This mode simulates the
                    real exam experience with strict timing and no breaks
                    between sections.
                  </p>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      Make sure you have 2 hours of uninterrupted time before
                      starting the full test.
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
                    <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl mt-4">
                      Start Full Test (120 minutes)
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
