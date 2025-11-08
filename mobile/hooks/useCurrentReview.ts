import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '~/libs/axios';
import { LessonItem, LessonByModality, LessonsByModalityResponse } from '~/api/lesson/useLesson';

// Define all available item modalities
export const ITEM_MODALITIES = [
  'mcq',
  'cloze',
  'ordering',
  'image_pick',
  'minimal_pair',
  'dictation',
  'short_answer',
  'email_reply',
  'opinion_paragraph',
  'error_fix',
  'read_aloud',
  'repeat_sentence',
  'describe_picture',
  'respond_to_questions',
  'respond_using_info',
  'express_opinion',
  'true_false',
  'hotspot',
] as const;

export type ItemModality = (typeof ITEM_MODALITIES)[number];

// Types for grouped menu data
export interface MenuSection {
  modality: string;
  name: string;
  lessons: LessonByModality[];
  totalCount: number;
}

export interface MenuData {
  [modality: string]: MenuSection;
}

// Hook to get full data for menu with grouping by modality
export function useReviewMenuData(skillType?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['review-menu', skillType],
    queryFn: async (): Promise<MenuData> => {
      try {
        let url = `/lesson/by-modality?`;
        if (skillType) {
          url += `skillType=${skillType}`;
        }

        const res = await api.get(url);

        if (!res.data || typeof res.data !== 'object') {
          throw new Error('Invalid response format');
        }

        const response = res.data as LessonsByModalityResponse;

        if (response.statusCode !== 200) {
          throw new Error(response.message || 'API request failed');
        }

        const lessons = response.data || [];

        // Group lessons by modality
        const groupedData: MenuData = {};

        lessons.forEach((lesson) => {
          const modality = lesson.items[0]?.modality || 'unknown';

          if (!groupedData[modality]) {
            groupedData[modality] = {
              modality,
              name: getModalityDisplayName(modality),
              lessons: [],
              totalCount: 0,
            };
          }

          groupedData[modality].lessons.push(lesson);
          groupedData[modality].totalCount += lesson.items.length;
        });

        return groupedData;
      } catch (error) {
        console.error('Error fetching review menu data:', error);
        throw error;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}


// Utility function to get display name for modality
export function getModalityDisplayName(modality: string): string {
  const modalityNames: { [key: string]: string } = {
    // Item modalities - specific question types
    mcq: 'Trắc nghiệm',
    cloze: 'Điền từ vào chỗ trống',
    ordering: 'Sắp xếp thứ tự',
    image_pick: 'Chọn hình ảnh',
    minimal_pair: 'Phân biệt âm',
    dictation: 'Chính tả',
    short_answer: 'Trả lời ngắn',
    email_reply: 'Trả lời email',
    opinion_paragraph: 'Đoạn văn ý kiến',
    error_fix: 'Sửa lỗi',
    read_aloud: 'Đọc to',
    repeat_sentence: 'Lặp lại câu',
    describe_picture: 'Mô tả hình ảnh',
    respond_to_questions: 'Trả lời câu hỏi',
    respond_using_info: 'Trả lời dựa trên thông tin',
    express_opinion: 'Bày tỏ ý kiến',
    true_false: 'Đúng/Sai',
    hotspot: 'Điểm nóng',

    // General skill types
    listening: 'Nghe hiểu',
    reading: 'Đọc hiểu',
    speaking: 'Luyện nói',
    writing: 'Viết',
    vocabulary: 'Từ vựng',
    grammar: 'Ngữ pháp',
    pronunciation: 'Phát âm',
    conversation: 'Hội thoại',
  };

  return modalityNames[modality] || modality;
}

// Utility function to get icon name for modality
export function getModalityIcon(modality: string): string {
  const modalityIcons: { [key: string]: string } = {
    // Item modalities
    mcq: 'check-circle',
    cloze: 'edit',
    ordering: 'list-ol',
    image_pick: 'image',
    minimal_pair: 'volume-up',
    dictation: 'keyboard',
    short_answer: 'comment',
    email_reply: 'envelope',
    opinion_paragraph: 'pen-fancy',
    error_fix: 'tools',
    read_aloud: 'microphone',
    repeat_sentence: 'redo',
    describe_picture: 'camera',
    respond_to_questions: 'question',
    respond_using_info: 'info-circle',
    express_opinion: 'comments',
    true_false: 'toggle-on',
    hotspot: 'crosshairs',

    // General skill types
    listening: 'headphones',
    reading: 'book-open',
    speaking: 'microphone',
    writing: 'pen',
    vocabulary: 'spell-check',
    grammar: 'language',
    pronunciation: 'volume-up',
    conversation: 'comments',
  };

  return modalityIcons[modality] || 'question-circle';
}

// Utility function to categorize modality by skill type
export function getModalitySkillType(modality: string): string {
  const modalitySkillMap: { [key: string]: string } = {
    // Listening modalities
    minimal_pair: 'listening',
    dictation: 'listening',
    respond_to_questions: 'speaking',
    respond_using_info: 'speaking',

    // Speaking modalities
    read_aloud: 'speaking',
    repeat_sentence: 'speaking',
    describe_picture: 'speaking',
    express_opinion: 'speaking',

    // Reading modalities
    mcq: 'reading',
    cloze: 'reading',
    ordering: 'reading',
    true_false: 'reading',
    hotspot: 'reading',

    // Writing modalities
    short_answer: 'writing',
    email_reply: 'writing',
    opinion_paragraph: 'writing',
    error_fix: 'writing',

    // Mixed/General modalities
    image_pick: 'mixed',
  };

  return modalitySkillMap[modality] || 'mixed';
}

// Function to get lesson by ID from menu data
export function findLessonById(menuData: MenuData, lessonId: string): LessonByModality | null {
  for (const modalityData of Object.values(menuData)) {
    const lesson = modalityData.lessons.find((lesson) => lesson.lessonId === lessonId);
    if (lesson) {
      return lesson;
    }
  }
  return null;
}

// Function to get lesson items by modality from menu data
export function getLessonsByModality(menuData: MenuData, modality: string): LessonByModality[] {
  return menuData[modality]?.lessons || [];
}

// Function to filter lessons by multiple modalities
export function filterLessonsByModalities(
  menuData: MenuData,
  modalities: string[]
): LessonByModality[] {
  const filteredLessons: LessonByModality[] = [];

  modalities.forEach((modality) => {
    const lessons = getLessonsByModality(menuData, modality);
    filteredLessons.push(...lessons);
  });

  return filteredLessons;
}

// Function to group lessons by skill type
export function groupLessonsBySkillType(menuData: MenuData): {
  [skillType: string]: MenuSection[];
} {
  const groupedBySkill: { [skillType: string]: MenuSection[] } = {};

  Object.values(menuData).forEach((modalitySection) => {
    const skillType = getModalitySkillType(modalitySection.modality);

    if (!groupedBySkill[skillType]) {
      groupedBySkill[skillType] = [];
    }

    groupedBySkill[skillType].push(modalitySection);
  });

  return groupedBySkill;
}

// Function to get lessons count by skill type
export function getLessonsCountBySkillType(menuData: MenuData): { [skillType: string]: number } {
  const countBySkill: { [skillType: string]: number } = {};

  Object.values(menuData).forEach((modalitySection) => {
    const skillType = getModalitySkillType(modalitySection.modality);

    if (!countBySkill[skillType]) {
      countBySkill[skillType] = 0;
    }

    countBySkill[skillType] += modalitySection.totalCount;
  });

  return countBySkill;
}