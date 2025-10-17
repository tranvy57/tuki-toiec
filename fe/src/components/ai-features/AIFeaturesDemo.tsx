"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  FileText,
  Image,
  Edit,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useAIFeatures } from "@/hooks/useAIFeatures";
import type {
  GenerateEmailRequest,
  EvaluateEmailRequest,
  EvaluateImageDescriptionRequest,
  EvaluateOpinionEssayRequest,
} from "@/types/ai-features";

export default function AIFeaturesDemo() {
  const [activeTab, setActiveTab] = useState<
    "generate" | "evaluate-email" | "evaluate-image" | "evaluate-essay"
  >("generate");
  const {
    generateEmail,
    evaluateEmail,
    evaluateImageDescription,
    evaluateOpinionEssay,
  } = useAIFeatures();

  // States for Generate Email
  const [emailRequest, setEmailRequest] = useState<GenerateEmailRequest>({
    purpose: "",
    tone: "formal",
    recipient: "",
    mainPoints: [""],
    context: "",
    length: "medium",
  });
  const [generatedEmail, setGeneratedEmail] = useState<any>(null);

  // States for Evaluate Email
  const [emailToEvaluate, setEmailToEvaluate] = useState({
    subject: "",
    body: "",
    purpose: "",
    targetRecipient: "",
  });
  const [emailEvaluation, setEmailEvaluation] = useState<any>(null);

  // States for Evaluate Image Description
  const [imageDescription, setImageDescription] = useState({
    description: "",
    expectedElements: [""],
    descriptionType: "basic" as const,
  });
  const [imageEvaluation, setImageEvaluation] = useState<any>(null);

  // States for Evaluate Opinion Essay
  const [opinionEssay, setOpinionEssay] = useState({
    essay: "",
    topic: "",
    requiredLength: 300,
    essayType: "opinion" as const,
  });
  const [essayEvaluation, setEssayEvaluation] = useState<any>(null);

  // Handle Generate Email
  const handleGenerateEmail = async () => {
    const result = await generateEmail.generateEmail(emailRequest);
    if (result) {
      setGeneratedEmail(result);
    }
  };

  // Handle Evaluate Email
  const handleEvaluateEmail = async () => {
    const result = await evaluateEmail.evaluateEmail(emailToEvaluate);
    if (result) {
      setEmailEvaluation(result);
    }
  };

  // Handle Evaluate Image Description
  const handleEvaluateImageDescription = async () => {
    const result = await evaluateImageDescription.evaluateImageDescription(
      imageDescription
    );
    if (result) {
      setImageEvaluation(result);
    }
  };

  // Handle Evaluate Opinion Essay
  const handleEvaluateOpinionEssay = async () => {
    const result = await evaluateOpinionEssay.evaluateOpinionEssay(
      opinionEssay
    );
    if (result) {
      setEssayEvaluation(result);
    }
  };

  const tabs = [
    { id: "generate", label: "Generate Email", icon: Mail },
    { id: "evaluate-email", label: "Evaluate Email", icon: CheckCircle },
    { id: "evaluate-image", label: "Evaluate Image Description", icon: Image },
    { id: "evaluate-essay", label: "Evaluate Opinion Essay", icon: Edit },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-slate-50/50 font-['Inter',system-ui,sans-serif]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            AI Features Demo
          </h1>
          <p className="text-lg text-slate-600">
            Advanced AI-powered tools for TOEIC Writing practice
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Generate Email Tab */}
        {activeTab === "generate" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Generate Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Purpose</label>
                  <Input
                    value={emailRequest.purpose}
                    onChange={(e) =>
                      setEmailRequest({
                        ...emailRequest,
                        purpose: e.target.value,
                      })
                    }
                    placeholder="e.g., Request information about..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tone</label>
                  <Select
                    value={emailRequest.tone}
                    onValueChange={(value: any) =>
                      setEmailRequest({ ...emailRequest, tone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="semi-formal">Semi-formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Recipient</label>
                  <Input
                    value={emailRequest.recipient}
                    onChange={(e) =>
                      setEmailRequest({
                        ...emailRequest,
                        recipient: e.target.value,
                      })
                    }
                    placeholder="e.g., Hotel manager, Professor, etc."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Main Points</label>
                  <Textarea
                    value={emailRequest.mainPoints.join("\n")}
                    onChange={(e) =>
                      setEmailRequest({
                        ...emailRequest,
                        mainPoints: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="Enter each main point on a new line"
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleGenerateEmail}
                  disabled={generateEmail.isLoading}
                  className="w-full"
                >
                  {generateEmail.isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Generate Email
                </Button>

                {generateEmail.error && (
                  <div className="text-red-600 text-sm">
                    {generateEmail.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Email Result */}
            {generatedEmail && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-blue-600">
                      Subject:
                    </label>
                    <p className="font-medium">{generatedEmail.subject}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-blue-600">
                      Body:
                    </label>
                    <div className="bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
                      {generatedEmail.body}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-blue-600">
                      Key Phrases:
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {generatedEmail.keyPhrases?.map(
                        (phrase: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {phrase}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-blue-600">
                      Tone Analysis:
                    </label>
                    <p className="text-sm text-slate-600">
                      {generatedEmail.toneAnalysis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Evaluate Email Tab */}
        {activeTab === "evaluate-email" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Evaluate Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={emailToEvaluate.subject}
                    onChange={(e) =>
                      setEmailToEvaluate({
                        ...emailToEvaluate,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Email subject line"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email Body</label>
                  <Textarea
                    value={emailToEvaluate.body}
                    onChange={(e) =>
                      setEmailToEvaluate({
                        ...emailToEvaluate,
                        body: e.target.value,
                      })
                    }
                    placeholder="Paste your email content here..."
                    rows={8}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Purpose (Optional)
                  </label>
                  <Input
                    value={emailToEvaluate.purpose}
                    onChange={(e) =>
                      setEmailToEvaluate({
                        ...emailToEvaluate,
                        purpose: e.target.value,
                      })
                    }
                    placeholder="What was the intended purpose?"
                  />
                </div>

                <Button
                  onClick={handleEvaluateEmail}
                  disabled={evaluateEmail.isLoading}
                  className="w-full"
                >
                  {evaluateEmail.isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Target className="h-4 w-4 mr-2" />
                  )}
                  Evaluate Email
                </Button>

                {evaluateEmail.error && (
                  <div className="text-red-600 text-sm">
                    {evaluateEmail.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Evaluation Result */}
            {emailEvaluation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Evaluation Results
                    <Badge className="ml-auto">
                      {emailEvaluation.overallScore}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(emailEvaluation.breakdown).map(
                      ([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>
                            <span className="font-medium">
                              {Number(value)}/100
                            </span>
                          </div>
                          <Progress value={Number(value)} className="h-2" />
                        </div>
                      )
                    )}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-green-600">
                        Strengths:
                      </label>
                      <ul className="text-sm text-slate-600 mt-1 space-y-1">
                        {emailEvaluation.strengths?.map(
                          (strength: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-orange-600">
                        Areas for Improvement:
                      </label>
                      <ul className="text-sm text-slate-600 mt-1 space-y-1">
                        {emailEvaluation.weaknesses?.map(
                          (weakness: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                              {weakness}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Grammar Errors */}
                  {emailEvaluation.grammarErrors?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-red-600">
                        Grammar Corrections:
                      </label>
                      <div className="space-y-2 mt-2">
                        {emailEvaluation.grammarErrors.map(
                          (error: any, index: number) => (
                            <div
                              key={index}
                              className="bg-red-50 p-3 rounded-lg border border-red-200"
                            >
                              <p className="text-sm">
                                <span className="line-through text-red-600">
                                  {error.error}
                                </span>
                                <span className="mx-2">→</span>
                                <span className="text-green-600 font-medium">
                                  {error.correction}
                                </span>
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                {error.explanation}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Add similar layouts for evaluate-image and evaluate-essay tabs */}
        {/* For brevity, I'll show a simplified version */}

        {activeTab === "evaluate-image" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Evaluate Image Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={imageDescription.description}
                  onChange={(e) =>
                    setImageDescription({
                      ...imageDescription,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter your image description here..."
                  rows={6}
                />

                <Button
                  onClick={handleEvaluateImageDescription}
                  disabled={evaluateImageDescription.isLoading}
                  className="w-full"
                >
                  {evaluateImageDescription.isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Image className="h-4 w-4 mr-2" />
                  )}
                  Evaluate Description
                </Button>

                {imageEvaluation && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Overall Score: {imageEvaluation.overallScore}/100
                    </h3>
                    <p className="text-sm text-slate-600">
                      {imageEvaluation.sampleImprovedDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "evaluate-essay" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Evaluate Opinion Essay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={opinionEssay.topic}
                  onChange={(e) =>
                    setOpinionEssay({ ...opinionEssay, topic: e.target.value })
                  }
                  placeholder="Essay topic..."
                />

                <Textarea
                  value={opinionEssay.essay}
                  onChange={(e) =>
                    setOpinionEssay({ ...opinionEssay, essay: e.target.value })
                  }
                  placeholder="Enter your opinion essay here..."
                  rows={10}
                />

                <Button
                  onClick={handleEvaluateOpinionEssay}
                  disabled={evaluateOpinionEssay.isLoading}
                  className="w-full"
                >
                  {evaluateOpinionEssay.isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  Evaluate Essay
                </Button>

                {essayEvaluation && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-lg p-2">
                        Overall: {essayEvaluation.overallScore}/100
                      </Badge>
                      <Badge variant="outline" className="text-lg p-2">
                        TOEIC Writing:{" "}
                        {essayEvaluation.estimatedTOEICWritingScore}/200
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(essayEvaluation.breakdown).map(
                        ([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="text-sm font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </div>
                            <Progress value={Number(value)} className="h-2" />
                            <div className="text-xs text-slate-600">
                              {Number(value)}/100
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
