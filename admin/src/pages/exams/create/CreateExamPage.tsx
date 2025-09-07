import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Minus, Save, ArrowLeft, Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ExcelImport } from '@/components/ExcelImport';
import type { ExamFormData } from '@/types';

const TOEIC_PARTS = [
  { number: 1, name: 'Photographs', description: 'Mô tả hình ảnh' },
  { number: 2, name: 'Question-Response', description: 'Hỏi đáp' },
  { number: 3, name: 'Conversations', description: 'Hội thoại' },
  { number: 4, name: 'Short Talks', description: 'Bài nói ngắn' },
  { number: 5, name: 'Incomplete Sentences', description: 'Hoàn thành câu' },
  { number: 6, name: 'Text Completion', description: 'Hoàn thành đoạn văn' },
  { number: 7, name: 'Reading Comprehension', description: 'Đọc hiểu' },
];

export default function CreateExamPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showExcelImport, setShowExcelImport] = useState(false);
  
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<ExamFormData>({
    defaultValues: {
      title: '',
      audioUrl: '',
      parts: TOEIC_PARTS.map(part => ({
        partNumber: part.number,
        directions: '',
        groups: [{
          orderIndex: 1,
          paragraphEn: '',
          paragraphVn: '',
          imageUrl: '',
          audioUrl: '',
          questions: [{
            numberLabel: 1,
            content: '',
            explanation: '',
            answers: [
              { content: '', isCorrect: false, answerKey: 'A' },
              { content: '', isCorrect: false, answerKey: 'B' },
              { content: '', isCorrect: false, answerKey: 'C' },
              { content: '', isCorrect: false, answerKey: 'D' },
            ]
          }]
        }]
      }))
    }
  });



  const onSubmit = (data: ExamFormData) => {
    console.log('Exam data:', data);
    // TODO: Submit to API
  };

  const handleExcelImport = (importedData: ExamFormData) => {
    // Simply reset with imported data, keeping any title/audioUrl that was already entered
    console.log("importedData", importedData);
    reset(importedData);
    // setShowExcelImport(false);
    
    // Show success notification (you can add a toast library later)
    alert('Import Excel thành công! Dữ liệu đã được tải vào form.');
  };

  const currentPart = TOEIC_PARTS[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/exams/list">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-warm-gray-900">Tạo đề thi mới</h1>
            <p className="text-warm-gray-600">Tạo một đề thi TOEIC hoàn chỉnh với 7 phần</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowExcelImport(true)}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>
            <Save className="h-4 w-4 mr-2" />
            Lưu đề thi
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Nhập thông tin cơ bản của đề thi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Tên đề thi</Label>
              <Input
                id="title"
                placeholder="TOEIC Practice Test 01"
                {...register('title', { required: 'Tên đề thi là bắt buộc' })}
              />
              {errors.title && (
                <p className="text-sm text-error mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="audioUrl">Link audio chung (tùy chọn)</Label>
              <div className="flex space-x-2">
                <Input
                  id="audioUrl"
                  placeholder="https://example.com/audio/test.mp3"
                  {...register('audioUrl')}
                />
                <Button type="button" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parts Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Phần thi TOEIC</CardTitle>
            <CardDescription>
              Chọn phần thi để chỉnh sửa chi tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {TOEIC_PARTS.map((part, index) => (
                <Button
                  key={part.number}
                  type="button"
                  variant={activeTab === index ? "default" : "outline"}
                  onClick={() => setActiveTab(index)}
                  className="h-auto py-3 px-2 flex flex-col items-center"
                >
                  <span className="font-bold">Part {part.number}</span>
                  <span className="text-xs text-center">{part.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Part Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              Part {currentPart.number}: {currentPart.name}
            </CardTitle>
            <CardDescription>
              {currentPart.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Part Directions */}
            <div>
              <Label htmlFor={`parts.${activeTab}.directions`}>Hướng dẫn phần thi</Label>
              <textarea
                id={`parts.${activeTab}.directions`}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                placeholder="Nhập hướng dẫn cho phần thi này..."
                {...register(`parts.${activeTab}.directions`)}
              />
            </div>

            {/* Groups */}
            <PartGroupsEditor 
              partIndex={activeTab}
              control={control}
              register={register}
            />
          </CardContent>
        </Card>
      </form>

      {/* Excel Import Modal */}
      {showExcelImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ExcelImport
              onImportSuccess={handleExcelImport}
              onClose={() => setShowExcelImport(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Component con để quản lý groups trong mỗi part
function PartGroupsEditor({ 
  partIndex, 
  control, 
  register
}: {
  partIndex: number;
  control: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  register: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: `parts.${partIndex}.groups`
  });

  const addGroup = () => {
    appendGroup({
      orderIndex: groupFields.length + 1,
      paragraphEn: '',
      paragraphVn: '',
      imageUrl: '',
      audioUrl: '',
      questions: [{
        numberLabel: 1,
        content: '',
        explanation: '',
        answers: [
          { content: '', isCorrect: false, answerKey: 'A' },
          { content: '', isCorrect: false, answerKey: 'B' },
          { content: '', isCorrect: false, answerKey: 'C' },
          { content: '', isCorrect: false, answerKey: 'D' },
        ]
      }]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Nhóm câu hỏi</h4>
        <Button type="button" onClick={addGroup} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhóm
        </Button>
      </div>

      {groupFields.map((group, groupIndex) => (
        <Card key={group.id} className="border-l-4 border-l-brand-coral-300">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Nhóm {groupIndex + 1}</CardTitle>
              {groupFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGroup(groupIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Group content fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Đoạn văn (Tiếng Anh)</Label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  placeholder="Nhập đoạn văn tiếng Anh..."
                  {...register(`parts.${partIndex}.groups.${groupIndex}.paragraphEn`)}
                />
              </div>
              <div>
                <Label>Đoạn văn (Tiếng Việt)</Label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  placeholder="Nhập đoạn văn tiếng Việt..."
                  {...register(`parts.${partIndex}.groups.${groupIndex}.paragraphVn`)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Link hình ảnh</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...register(`parts.${partIndex}.groups.${groupIndex}.imageUrl`)}
                />
              </div>
              <div>
                <Label>Link audio</Label>
                <Input
                  placeholder="https://example.com/audio.mp3"
                  {...register(`parts.${partIndex}.groups.${groupIndex}.audioUrl`)}
                />
              </div>
            </div>

            {/* Questions */}
            <QuestionsEditor
              partIndex={partIndex}
              groupIndex={groupIndex}
              control={control}
              register={register}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Component con để quản lý questions trong group
function QuestionsEditor({
  partIndex,
  groupIndex,
  control,
  register
}: {
  partIndex: number;
  groupIndex: number;
  control: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  register: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: `parts.${partIndex}.groups.${groupIndex}.questions`
  });

  const addQuestion = () => {
    appendQuestion({
      numberLabel: questionFields.length + 1,
      content: '',
      explanation: '',
      answers: [
        { content: '', isCorrect: false, answerKey: 'A' },
        { content: '', isCorrect: false, answerKey: 'B' },
        { content: '', isCorrect: false, answerKey: 'C' },
        { content: '', isCorrect: false, answerKey: 'D' },
      ]
    });
  };

  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <h5 className="font-medium">Câu hỏi</h5>
        <Button type="button" onClick={addQuestion} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Thêm câu hỏi
        </Button>
      </div>

      <div className="space-y-4">
        {questionFields.map((question, questionIndex) => (
          <div key={question.id} className="p-4 border rounded-md bg-warm-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h6 className="font-medium">Câu {questionIndex + 1}</h6>
              {questionFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(questionIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label>Nội dung câu hỏi</Label>
                <Input
                  placeholder="Nhập nội dung câu hỏi..."
                  {...register(`parts.${partIndex}.groups.${groupIndex}.questions.${questionIndex}.content`)}
                />
              </div>

              <div>
                <Label>Giải thích (tùy chọn)</Label>
                <Input
                  placeholder="Nhập giải thích đáp án..."
                  {...register(`parts.${partIndex}.groups.${groupIndex}.questions.${questionIndex}.explanation`)}
                />
              </div>

              {/* Answers */}
              <div className="space-y-2">
                <Label>Đáp án</Label>
                {['A', 'B', 'C', 'D'].map((key, answerIndex) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`parts.${partIndex}.groups.${groupIndex}.questions.${questionIndex}.correct`}
                      value={key}
                      className="text-brand-coral-500"
                      {...register(`parts.${partIndex}.groups.${groupIndex}.questions.${questionIndex}.answers.${answerIndex}.isCorrect`)}
                    />
                    <span className="w-6 text-sm font-medium">{key}.</span>
                    <Input
                      placeholder={`Đáp án ${key}`}
                      className="flex-1"
                      {...register(`parts.${partIndex}.groups.${groupIndex}.questions.${questionIndex}.answers.${answerIndex}.content`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
