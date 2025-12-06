import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Minus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileUploadButton } from '@/components/FileUploadButton';
import { useCreateTest } from '@/hooks/useTests';
import type { CreateTestDto } from '@/types/api';
import { toast } from 'sonner';
import {
    PageContainer,
    ContentWrapper,
} from '@/components/common';

const TOEIC_PARTS = [
    { number: 1, name: 'Photographs', description: 'Mô tả hình ảnh' },
    { number: 2, name: 'Question-Response', description: 'Hỏi đáp' },
    { number: 3, name: 'Conversations', description: 'Hội thoại' },
    { number: 4, name: 'Short Talks', description: 'Bài nói ngắn' },
    { number: 5, name: 'Incomplete Sentences', description: 'Hoàn thành câu' },
    { number: 6, name: 'Text Completion', description: 'Hoàn thành đoạn văn' },
    { number: 7, name: 'Reading Comprehension', description: 'Đọc hiểu' },
];

interface TestFormData extends CreateTestDto { }

export default function CreateTestPage() {
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const createMutation = useCreateTest();

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<TestFormData>({
        defaultValues: {
            title: '',
            audioUrl: '',
            duration: 120,
            description: '',
            parts: TOEIC_PARTS.map(part => ({
                partNumber: part.number,
                direction: '',
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

    const onSubmit = async (data: TestFormData) => {
        try {
            await createMutation.mutateAsync(data);
            toast.success('Tạo đề thi thành công!', {
                description: 'Đề thi đã được tạo và lưu vào hệ thống.'
            });
            navigate('/tests');
        } catch (error) {
            console.error('Error creating test:', error);
            toast.error('Có lỗi xảy ra khi tạo đề thi', {
                description: 'Vui lòng kiểm tra lại thông tin và thử lại.'
            });
        }
    };

    const currentPart = TOEIC_PARTS[activeTab];

    return (
        <PageContainer>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/tests')}>
                        ← Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Tạo đề thi TOEIC mới</h1>
                        <p className="text-gray-600">Tạo đề thi TOEIC với thông tin cơ bản hoặc import từ file Excel</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={createMutation.isPending}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {createMutation.isPending ? 'Đang lưu...' : 'Lưu đề thi'}
                    </Button>
                </div>
            </div>

            <ContentWrapper>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Tên đề thi *</Label>
                                    <Input
                                        id="title"
                                        placeholder="TOEIC Practice Test 01"
                                        {...register('title', { required: 'Tên đề thi là bắt buộc' })}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="duration">Thời gian (phút) *</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min="1"
                                        max="300"
                                        placeholder="120"
                                        {...register('duration', {
                                            required: 'Thời gian là bắt buộc',
                                            min: { value: 1, message: 'Thời gian tối thiểu 1 phút' },
                                            max: { value: 300, message: 'Thời gian tối đa 300 phút' }
                                        })}
                                    />
                                    {errors.duration && (
                                        <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                                    placeholder="Mô tả về đề thi này..."
                                    {...register('description')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="audioUrl">Link audio chung (tùy chọn)</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="audioUrl"
                                        placeholder="https://example.com/audio/test.mp3"
                                        {...register('audioUrl')}
                                    />
                                    <FileUploadButton
                                        accept="audio/*"
                                        label="Upload"
                                        onUploadSuccess={(url) => {
                                            console.log('Setting audioUrl to:', url);
                                            setValue('audioUrl', url, { shouldDirty: true, shouldValidate: true });
                                            console.log('setValue called');
                                        }}
                                    />
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
                                <Label htmlFor={`parts.${activeTab}.direction`}>Hướng dẫn phần thi</Label>
                                <textarea
                                    id={`parts.${activeTab}.direction`}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                                    placeholder="Nhập hướng dẫn cho phần thi này..."
                                    {...register(`parts.${activeTab}.direction`)}
                                />
                            </div>

                            {/* Groups */}
                            <PartGroupsEditor
                                partIndex={activeTab}
                                control={control}
                                register={register}
                                setValue={setValue}
                            />
                        </CardContent>
                    </Card>
                </form>
            </ContentWrapper>
        </PageContainer>
    );
}

// Component con để quản lý groups trong mỗi part
function PartGroupsEditor({
    partIndex,
    control,
    register,
    setValue
}: {
    partIndex: number;
    control: any;
    register: any;
    setValue: any;
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
                <Card key={group.id} className="border-l-4 border-l-blue-300">
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
                                <div className="flex space-x-2">
                                    <Input
                                        id={`parts.${partIndex}.groups.${groupIndex}.imageUrl`}
                                        placeholder="https://example.com/image.jpg"
                                        {...register(`parts.${partIndex}.groups.${groupIndex}.imageUrl`)}
                                    />
                                    <FileUploadButton
                                        accept="image/*"
                                        label="Upload"
                                        onUploadSuccess={(url) => {
                                            console.log('Setting group imageUrl to:', url);
                                            setValue(`parts.${partIndex}.groups.${groupIndex}.imageUrl`, url, { shouldDirty: true, shouldValidate: true });
                                            console.log('setValue called for group image');
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Link audio</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id={`parts.${partIndex}.groups.${groupIndex}.audioUrl`}
                                        placeholder="https://example.com/audio.mp3"
                                        {...register(`parts.${partIndex}.groups.${groupIndex}.audioUrl`)}
                                    />
                                    <FileUploadButton
                                        accept="audio/*"
                                        label="Upload"
                                        onUploadSuccess={(url) => {
                                            console.log('Setting group audioUrl to:', url);
                                            setValue(`parts.${partIndex}.groups.${groupIndex}.audioUrl`, url, { shouldDirty: true, shouldValidate: true });
                                            console.log('setValue called for group audio');
                                        }}
                                    />
                                </div>
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
    control: any;
    register: any;
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
                    <div key={question.id} className="p-4 border rounded-md bg-gray-50">
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
                                <Label>Đáp án (chọn đáp án đúng)</Label>
                                {['A', 'B', 'C', 'D'].map((key, answerIndex) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name={`question_${partIndex}_${groupIndex}_${questionIndex}_correct`}
                                            value={answerIndex}
                                            className="text-blue-500"
                                            onChange={() => {
                                                // Set all answers to false first
                                                ['A', 'B', 'C', 'D'].forEach((_, idx) => {
                                                    const input = document.querySelector(`input[name="parts.${partIndex}.groups.${groupIndex}.questions.${questionIndex}.answers.${idx}.isCorrect"]`) as HTMLInputElement;
                                                    if (input) input.checked = idx === answerIndex;
                                                });
                                            }}
                                        />
                                        <input
                                            type="hidden"
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
