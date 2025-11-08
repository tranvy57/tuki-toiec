import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  OpinionEssayPrompt,
  PictureDescriptionPrompt,
  ArgumentativeEssayPrompt,
  WritingResponse,
  WritingTaskType,
  sampleWritingTasks
} from '~/components/review/writing';
import { useReviewMenuData, findLessonById, getModalityDisplayName } from '~/hooks/useCurrentReview';
import { useCurrentLesson } from '~/hooks/useCurrentLesson';

const initialLayout = { width: Dimensions.get('window').width };

const WritingPracticeScreen = () => {
  const { skill, lessonId } = useLocalSearchParams();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'prompt', title: 'Writing Prompt' },
    { key: 'response', title: 'Your Response' },
  ]);

  console.log(skill, lessonId)

  // Get lesson data from Zustand store
  const {
    currentLesson,
    currentModality,
    currentLessonId,
    currentItem,
    totalItems
  } = useCurrentLesson();

  // Fallback: if no lesson in store, try to load from menuData
  const { data: menuData, isLoading, isError } = useReviewMenuData(
    skill as string,
    !currentLesson // only load if no current lesson
  );

  console.log('Current lesson from store:', currentLesson);
  console.log('MenuData (fallback):', menuData);

  // If no current lesson but we have lessonId, find it in menuData
  React.useEffect(() => {
    if (!currentLesson && lessonId && menuData) {
      const foundLesson = findLessonById(menuData, lessonId as string);
      if (foundLesson) {
        console.warn('Lesson not found in store, using fallback from menuData');
      }
    }
  }, [currentLesson, lessonId, menuData]);

  // Use current lesson data
  const lessonData = currentLesson;


  const getCurrentTask = () => {
    if (!lessonData || !lessonData.items.length) {
      return sampleWritingTasks[0];
    }

    const currentItem = lessonData.items[0];
    const modality = currentItem.modality;

    switch (modality) {
      case 'email_reply':
        return {
          id: currentItem.id,
          type: 'email' as WritingTaskType,
          topic: currentItem.promptJsonb.content || 'Email Response Task',
          timeLimit: 20, // minutes
          wordLimit: 150,
          emailContext: currentItem.promptJsonb.writing_type || 'formal',
          sampleAnswer: currentItem.solutionJsonb.sample_answer,
          tips: currentItem.solutionJsonb.tips,
        };

      case 'opinion_paragraph':
        return {
          id: currentItem.id,
          type: 'opinion' as WritingTaskType,
          topic: currentItem.promptJsonb.content || 'Opinion Essay Task',
          timeLimit: 30,
          wordLimit: 200,
          sampleAnswer: currentItem.solutionJsonb.sample_answer,
          tips: currentItem.solutionJsonb.tips,
        };

      case 'describe_picture':
        return {
          id: currentItem.id,
          type: 'picture-description' as WritingTaskType,
          topic: 'Describe the picture',
          imageUrl: currentItem.promptJsonb.image_url || '',
          keywords: currentItem.promptJsonb.keywords || [],
          timeLimit: 15,
          wordLimit: 100,
          preparationTime: 2,
          sampleAnswer: currentItem.solutionJsonb.sample_answer,
          tips: currentItem.solutionJsonb.tips,
        };

      case 'short_answer':
        return {
          id: currentItem.id,
          type: 'short-answer' as WritingTaskType,
          topic: currentItem.promptJsonb.content || 'Short Answer Task',
          timeLimit: 10,
          wordLimit: 50,
          sampleAnswer: currentItem.solutionJsonb.sample_answer,
          tips: currentItem.solutionJsonb.tips,
        };

      case 'error_fix':
        return {
          id: currentItem.id,
          type: 'error-correction' as WritingTaskType,
          topic: 'Fix the errors in the text',
          content: currentItem.promptJsonb.content || '',
          timeLimit: 15,
          wordLimit: 200,
          sampleAnswer: currentItem.solutionJsonb.sample_answer,
          tips: currentItem.solutionJsonb.tips,
        };

      default:
        return {
          id: currentItem.id,
          type: 'opinion' as WritingTaskType,
          topic: currentItem.promptJsonb.content || 'Writing Task',
          timeLimit: 20,
          wordLimit: 150,
          sampleAnswer: currentItem.solutionJsonb.sample_answer,
          tips: currentItem.solutionJsonb.tips,
        };
    }
  };

  const currentTask = getCurrentTask();

  const renderPromptComponent = () => {
    switch (currentTask.type) {
      case 'email':
      case 'short-answer':
      case 'error-correction':
      case 'opinion':
        return (
          <OpinionEssayPrompt
            topic={currentTask.topic}
            timeLimit={currentTask.timeLimit}
            wordLimit={currentTask.wordLimit}
          />
        );
      case 'picture-description':
        return (
          <PictureDescriptionPrompt
            imageUrl={(currentTask as any).imageUrl || ''}
            timeLimit={currentTask.timeLimit}
            wordLimit={currentTask.wordLimit}
            preparationTime={(currentTask as any).preparationTime || 2}
          />
        );
      case 'argumentative':
        return (
          <ArgumentativeEssayPrompt
            topic={currentTask.topic}
            timeLimit={currentTask.timeLimit}
            wordLimit={currentTask.wordLimit}
          />
        );
      default:
        return (
          <OpinionEssayPrompt
            topic={currentTask.topic}
            timeLimit={currentTask.timeLimit}
            wordLimit={currentTask.wordLimit}
          />
        );
    }
  };

  const WritingPromptRoute = () => renderPromptComponent();

  const YourResponseRoute = () => (
    <WritingResponse
      timeLimit={currentTask.timeLimit}
      wordLimit={currentTask.wordLimit}
      onSubmit={(response) => {
        console.log('Submitted response:', response);
        // Handle submission logic here
      }}
      onSave={(response) => {
        console.log('Saved draft:', response);
        // Handle save logic here
      }}
    />
  );

  const renderScene = SceneMap({
    prompt: WritingPromptRoute,
    response: YourResponseRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#2563eb"
      inactiveColor="#666"
      pressColor="rgba(37, 99, 235, 0.1)"
    />
  );

  // Loading state - only show loading if no lesson in store and still loading menuData
  if (!currentLesson && isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Đang tải bài tập...</Text>
      </View>
    );
  }

  // Error state
  if (!currentLesson && (isError || !menuData)) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Có lỗi xảy ra khi tải bài tập</Text>
      </View>
    );
  }

  // Lesson not found
  if (!lessonData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Không tìm thấy bài tập</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display skill info */}
      <View style={styles.skillHeader}>
        <Text style={styles.skillTitle}>
          {getModalityDisplayName(skill as string)}
        </Text>
        <Text style={styles.lessonTitle}>
          {lessonData.name}
        </Text>
      </View>

      {/* TabView */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  skillHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabIndicator: {
    backgroundColor: '#2563eb',
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
  },
});

export default WritingPracticeScreen;