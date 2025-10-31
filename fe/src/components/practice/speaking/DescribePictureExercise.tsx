"use client";

import { FileText } from "lucide-react";

interface DescribePictureExerciseProps {
    exerciseData: any;
}

export default function DescribePictureExercise({ exerciseData }: DescribePictureExerciseProps) {
    return (
        <div className="bg-white rounded-sm p-4">
            <div>
                <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    {exerciseData.title}
                </div>
            </div>
            <div className="space-y-4">
                {/* Image for picture description */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <FileText className="w-16 h-16 mb-4" />
                        <span className="text-lg font-medium">Hình ảnh mẫu</span>
                        <span className="text-sm">Airport Waiting Area</span>
                    </div>
                </div>
            </div>
        </div>
    );
}