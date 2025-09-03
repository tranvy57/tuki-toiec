"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  X,
  Sparkles,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  parseExcelFile,
  generateSampleExcel,
} from "@/utils/excelParser";
import type { ExamFormData, ExcelImportResult } from "@/types";

interface ExcelImportProps {
  onImportSuccess: (data: ExamFormData) => void;
  onClose?: () => void;
}

export function ExcelImport({ onImportSuccess, onClose }: ExcelImportProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ExcelImportResult | null>(
    null
  );
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setImportResult({
        success: false,
        error: "Vui lòng chọn file Excel (.xlsx hoặc .xls)",
      });
      return;
    }

    setIsProcessing(true);
    setImportResult(null);
    setUploadedFile(file);

    try {
      const result = await parseExcelFile(file);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        error: `Lỗi xử lý file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (importResult?.success && importResult.data) {
      const enhancedData = {
        ...importResult.data,
        title: title || importResult.data.title,
        audioUrl: audioUrl || importResult.data.audioUrl,
      };
      onImportSuccess(enhancedData);
    }
  };

  const handlePreviewFile = () => {
    if (uploadedFile && importResult?.success) {
      setShowPreview(true);
    }
  };

  const getTotalQuestions = (data: ExamFormData): number => {
    return data.parts.reduce((total, part) => {
      return (
        total +
        part.groups.reduce((partTotal, group) => {
          return partTotal + group.questions.length;
        }, 0)
      );
    }, 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    generateSampleExcel();
  };

  const resetImport = () => {
    setImportResult(null);
    setIsProcessing(false);
    setUploadedFile(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Import từ Excel
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Nhập dữ liệu đề thi từ file Excel theo mẫu chuẩn
                </CardDescription>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Tiêu đề đề thi
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Nhập tiêu đề đề thi..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="audioUrl"
                className="text-sm font-medium text-gray-700"
              >
                Audio URL (tùy chọn)
              </Label>
              <Input
                id="audioUrl"
                type="url"
                placeholder="https://example.com/audio.mp3"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 text-balance">
                    Tải xuống mẫu Excel
                  </p>
                  <p className="text-sm text-blue-700 mt-1 text-pretty">
                    Tải xuống file mẫu để tham khảo cấu trúc dữ liệu
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 shadow-sm bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Tải mẫu
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -translate-y-10 translate-x-10"></div>
          </div>

          <div
            className={`relative group border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? "border-emerald-400 bg-emerald-50 scale-[1.02]"
                : "border-gray-300 hover:border-emerald-300 hover:bg-gray-50"
            } ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />

            <div className="space-y-4">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  dragActive
                    ? "bg-emerald-100 scale-110"
                    : "bg-gray-100 group-hover:bg-emerald-50"
                }`}
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
                ) : (
                  <Upload
                    className={`h-6 w-6 transition-colors ${
                      dragActive
                        ? "text-emerald-600"
                        : "text-gray-400 group-hover:text-emerald-500"
                    }`}
                  />
                )}
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-900 text-balance">
                  {isProcessing
                    ? "Đang xử lý..."
                    : "Kéo thả file Excel vào đây"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  hoặc{" "}
                  <span className="text-emerald-600 font-medium">
                    nhấp để chọn file
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Hỗ trợ file .xlsx và .xls (tối đa 10MB)
                </p>
              </div>
            </div>
          </div>

          {importResult && (
            <div
              className={`p-5 rounded-xl border shadow-sm ${
                importResult.success
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                  : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 mt-0.5 p-1 rounded-full ${
                    importResult.success ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  <h4
                    className={`font-semibold text-balance ${
                      importResult.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {importResult.success ? "Import thành công!" : "Lỗi import"}
                  </h4>

                  {importResult.error && (
                    <p className="text-sm text-red-700 mt-2 text-pretty">
                      {importResult.error}
                    </p>
                  )}

                  {importResult.success && (
                    <div className="space-y-3 mt-3">
                      <p className="text-sm text-green-700 text-pretty">
                        Dữ liệu đã được đọc thành công. Kiểm tra và xác nhận để
                        áp dụng vào form.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviewFile}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem trước
                        </Button>
                        <Button
                          onClick={handleConfirmImport}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Xác nhận Import
                        </Button>
                      </div>
                    </div>
                  )}

                  {importResult.warnings &&
                    importResult.warnings.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800">
                          Cảnh báo:
                        </p>
                        <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                          {importResult.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-yellow-500 mt-0.5">•</span>
                              <span className="text-pretty">{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetImport}
                  className="flex-shrink-0 h-8 w-8 p-0 hover:bg-white/50 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {showPreview && importResult?.success && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
              <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden bg-white">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">
                          Xem trước dữ liệu
                        </CardTitle>
                        <CardDescription>
                          File: {uploadedFile?.name} •{" "}
                          {getTotalQuestions(importResult.data!)} câu hỏi •{" "}
                          {importResult.data?.parts.length} phần
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[60vh] overflow-y-auto p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Tiêu đề
                          </p>
                          <p className="text-gray-900">
                            {title ||
                              importResult.data?.title ||
                              "Chưa có tiêu đề"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Audio URL
                          </p>
                          <p className="text-gray-900 truncate">
                            {audioUrl ||
                              importResult.data?.audioUrl ||
                              "Không có"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Cấu trúc đề thi ({importResult.data?.parts.length}{" "}
                          phần, {getTotalQuestions(importResult.data!)} câu hỏi)
                        </h4>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {importResult.data?.parts.map((part, partIndex) => (
                            <div
                              key={partIndex}
                              className="border rounded-lg bg-white"
                            >
                              <div className="p-3 bg-blue-50 border-b">
                                <h5 className="font-medium text-blue-900">
                                  Part {part.partNumber}
                                </h5>
                                <p className="text-sm text-blue-700">
                                  {part.directions}
                                </p>
                              </div>
                              <div className="p-3 space-y-3">
                                {part.groups
                                  .slice(0, 2)
                                  .map((group, groupIndex) => (
                                    <div
                                      key={groupIndex}
                                      className="border-l-2 border-gray-200 pl-3"
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                          Group {group.orderIndex}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {group.questions.length} câu hỏi
                                        </span>
                                      </div>
                                      {group.paragraphEn && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                          {group.paragraphEn}
                                        </p>
                                      )}
                                      <div className="space-y-2">
                                        {group.questions
                                          .slice(0, 2)
                                          .map((question, qIndex) => (
                                            <div
                                              key={qIndex}
                                              className="text-sm"
                                            >
                                              <p className="font-medium">
                                                {question.numberLabel}.{" "}
                                                {question.content}
                                              </p>
                                              <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mt-1">
                                                {question.answers.map(
                                                  (answer, aIndex) => (
                                                    <span
                                                      key={aIndex}
                                                      className={
                                                        answer.isCorrect
                                                          ? "text-green-600 font-medium"
                                                          : ""
                                                      }
                                                    >
                                                      {answer.answerKey}.{" "}
                                                      {answer.content}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        {group.questions.length > 2 && (
                                          <p className="text-xs text-gray-500">
                                            ... và {group.questions.length - 2}{" "}
                                            câu hỏi khác
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                {part.groups.length > 2 && (
                                  <p className="text-sm text-gray-500 text-center py-2">
                                    ... và {part.groups.length - 2} nhóm khác
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="p-1 bg-gray-200 rounded">
                <FileSpreadsheet className="h-4 w-4 text-gray-600" />
              </div>
              Hướng dẫn chuẩn bị file Excel:
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              {[
                "Sử dụng file mẫu đã tải xuống làm cơ sở",
                "Dòng đầu tiên phải là header (tiêu đề cột)",
                "Các cột bắt buộc: Part Number, Group Index, Question Number, Content, Answer A-D, Correct Answer",
                "Có thể thêm Directions, Paragraph EN/VN, Image URL, Audio URL cho từng nhóm",
                "Correct Answer phải là A, B, C hoặc D",
                "Part từ 1-7 theo chuẩn TOEIC, Group theo thứ tự tăng dần",
              ].map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-pretty">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
