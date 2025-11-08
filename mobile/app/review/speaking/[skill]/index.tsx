import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ReadAloudSpeaking,
    DescribePictureSpeaking,
    RespondToQuestion,
    RespondToUsingInformation,
    ExpressOpinion,
    SpeakingTaskType,
    sampleSpeakingTasks
} from '~/components/review/speaking';
import { useCurrentLesson } from '~/hooks/useCurrentLesson';
import { getModalityDisplayName } from '~/hooks/useCurrentReview';

const initialLayout = { width: Dimensions.get('window').width };

const SpeakingPracticeScreen = () => {
    const { skill, lessonId } = useLocalSearchParams();
    const router = useRouter();

    console.log(skill, lessonId);

    // Get lesson data from Zustand store
    const {
        currentLesson,
        currentModality,
        currentLessonId,
        currentItem,
        totalItems
    } = useCurrentLesson();

    console.log('Current lesson from prompt:', currentLesson?.items.map(item => item.promptJsonb));
    console.log('Current lesson from solution:', currentLesson?.items.map(item => item.solutionJsonb));

    // Use current lesson data
    const lessonData = currentLesson;

    // Get current task based on skill/modality
    const getCurrentTask = () => {
        if (!lessonData || !lessonData.items.length) {
            return sampleSpeakingTasks[0]; // fallback to sample data
        }

        const currentItem = lessonData.items[0]; // Use first item for now
        const modality = currentItem.modality;

        // Map modality to SpeakingTaskType and create task object
        switch (modality) {
            case 'read_aloud':
                return {
                    id: currentItem.id,
                    type: 'read-aloud' as SpeakingTaskType,
                    title: currentItem.title || 'Read Aloud Task',
                    content: currentItem.promptJsonb.content || currentItem.promptJsonb.question_text || '',
                    preparationTime: currentItem.promptJsonb.preparation_time || 45,
                    speakingTime: currentItem.promptJsonb.speaking_time || 45,
                    sampleAnswer: currentItem.solutionJsonb.sample_text,
                    audioUrl: currentItem.solutionJsonb.audio_url,
                    tips: currentItem.solutionJsonb.tips,
                };

            case 'repeat_sentence':
                return {
                    id: currentItem.id,
                    type: 'repeat-sentence' as SpeakingTaskType,
                    title: currentItem.title || 'Repeat Sentence Task',
                    content: currentItem.promptJsonb.question_text || '',
                    preparationTime: currentItem.promptJsonb.preparation_time || 15,
                    speakingTime: currentItem.promptJsonb.speaking_time || 15,
                    audioUrl: currentItem.promptJsonb.audio_url,
                    sampleAnswer: currentItem.solutionJsonb.sample_text,
                    tips: currentItem.solutionJsonb.tips,
                };

            case 'describe_picture':
                return {
                    id: currentItem.id,
                    type: 'describe-picture' as SpeakingTaskType,
                    title: currentItem.title || 'Describe Picture Task',
                    imageUrl: currentItem.promptJsonb.image_url || '',
                    preparationTime: currentItem.promptJsonb.preparation_time || 30,
                    speakingTime: currentItem.promptJsonb.speaking_time || 45,
                    keywords: currentItem.promptJsonb.keywords || [],
                    sampleAnswer: currentItem.solutionJsonb.sample_text,
                    tips: currentItem.solutionJsonb.tips,
                };

            case 'respond_to_questions':
                // For respond_to_questions, we need to handle multiple questions
                // Assuming lessonData.items contains multiple question items
                const questions = lessonData.items.map((item, index) => {
                    // Get audio URL from solution data if available
                    const solutionIndex = index < lessonData.items.length ? index : 0;
                    const audioUrl = lessonData.items[solutionIndex]?.solutionJsonb?.audio_url;

                    return {
                        id: item.id,
                        questionText: item.promptJsonb.question_text || `Question ${index + 1}`,
                        content: item.promptJsonb.content || '',
                        directions: item.promptJsonb.directions || '',
                        audioUrl: audioUrl,
                        preparationTime: item.promptJsonb.preparation_time || 3,
                        speakingTime: item.promptJsonb.speaking_time || 15,
                    };
                });

                return {
                    id: currentItem.id,
                    type: 'respond-to-questions' as SpeakingTaskType,
                    title: currentItem.title || 'Respond to Questions Task',
                    questions: questions,
                    sampleAnswer: currentItem.solutionJsonb.sample_text,
                    tips: currentItem.solutionJsonb.tips,
                };

            case 'respond_using_info':
                // For respond_using_information, we need to handle questions with HTML information
                const questionsWithInfo = lessonData.items.map((item, index) => {
                    // Get audio URL from solution data if available
                    const solutionIndex = index < lessonData.items.length ? index : 0;
                    const audioUrl = lessonData.items[solutionIndex]?.solutionJsonb?.audio_url;

                    return {
                        id: item.id,
                        questionText: item.promptJsonb.question_text || `Question ${index + 1}`,
                        content: item.promptJsonb.content || '',
                        directions: item.promptJsonb.directions || '',
                        informationHtml: (item.promptJsonb as any).information_html || (item.promptJsonb as any).information || item.promptJsonb.content || '',
                        audioUrl: audioUrl,
                        preparationTime: item.promptJsonb.preparation_time || 15,
                        speakingTime: item.promptJsonb.speaking_time || 45,
                    };
                });

                return {
                    id: currentItem.id,
                    type: 'respond-using-information' as SpeakingTaskType,
                    title: currentItem.title || 'Respond Using Information Task',
                    questions: questionsWithInfo,
                    sampleAnswer: currentItem.solutionJsonb.sample_text,
                    tips: currentItem.solutionJsonb.tips,
                };

            case 'express_opinion':
                return {
                    id: currentItem.id,
                    type: 'express-opinion' as SpeakingTaskType,
                    title: currentItem.title || 'Express Opinion Task',
                    content: currentItem.promptJsonb.question_text || currentItem.promptJsonb.content || '',
                    directions: currentItem.promptJsonb.directions || '',
                    audioUrl: currentItem.promptJsonb.audio_url || currentItem.solutionJsonb.audio_url,
                    preparationTime: currentItem.promptJsonb.preparation_time || 45,
                    speakingTime: currentItem.promptJsonb.speaking_time || 60,
                    sampleAnswer: currentItem.solutionJsonb.sample_text,
                    tips: currentItem.solutionJsonb.tips,
                };

            default:
                return {
                    id: currentItem.id,
                    type: 'read-aloud' as SpeakingTaskType,
                    title: currentItem.title || 'Speaking Task',
                    content: currentItem.promptJsonb.content || currentItem.promptJsonb.question_text || '',
                    preparationTime: currentItem.promptJsonb.preparation_time || 45,
                    speakingTime: currentItem.promptJsonb.speaking_time || 45,
                    sampleAnswer: currentItem.solutionJsonb.sample_text,
                    tips: currentItem.solutionJsonb.tips,
                };
        }
    };

    const currentTask = getCurrentTask();

    const renderSpeakingComponent = () => {
        switch (currentTask.type) {
            case 'read-aloud':
                return (
                    <ReadAloudSpeaking
                        text={currentTask.content || ''}
                        preparationTime={currentTask.preparationTime}
                        speakingTime={currentTask.speakingTime}
                        onRecordingComplete={(audioUri) => {
                            console.log('Recording completed:', audioUri);
                        }}
                        onSubmit={(audioUri) => {
                            console.log('Submitted audio:', audioUri);
                            // Handle submission logic here
                        }}
                    />
                );

            case 'describe-picture':
                return (
                    <DescribePictureSpeaking
                        imageUri={currentTask.imageUrl || ''}
                        preparationTime={currentTask.preparationTime}
                        speakingTime={currentTask.speakingTime}
                        onRecordingComplete={(audioUri) => {
                            console.log('Recording completed:', audioUri);
                        }}
                        onSubmit={(audioUri) => {
                            console.log('Submitted audio:', audioUri);
                            // Handle submission logic here
                        }}
                    />
                );

            case 'respond-to-questions':
                return (
                    <RespondToQuestion
                        questions={currentTask.questions || []}
                        onRecordingComplete={(questionId, audioUri) => {
                            console.log(`Question ${questionId} recording completed:`, audioUri);
                        }}
                        onSubmit={(recordings) => {
                            console.log('All recordings submitted:', recordings);
                            // Handle submission logic here
                        }}
                    />
                );

            case 'respond-using-information':
                return (
                    <RespondToUsingInformation
                        questions={currentTask.questions || []}
                        onRecordingComplete={(questionId, audioUri) => {
                            console.log(`Question ${questionId} recording completed:`, audioUri);
                        }}
                        onSubmit={(recordings) => {
                            console.log('All recordings submitted:', recordings);
                            // Handle submission logic here
                        }}
                    />
                );

            // TODO: Add other speaking task types
            case 'express-opinion':
                return (
                    <ExpressOpinion
                        topic={currentTask.content || ''}
                        content={currentTask.content}
                        directions={(currentTask as any).directions}
                        audioUrl={(currentTask as any).audioUrl}
                        speakingTime={currentTask.speakingTime}
                        onRecordingComplete={(audioUri) => {
                            console.log('Express opinion recording completed:', audioUri);
                        }}
                        onSubmit={(audioUri) => {
                            console.log('Express opinion submitted:', audioUri);
                            // Handle submission logic here
                        }}
                    />
                );

            default:
                return (
                    <ReadAloudSpeaking
                        text={currentTask.content || ''}
                        preparationTime={currentTask.preparationTime}
                        speakingTime={currentTask.speakingTime}
                    />
                );
        }
    };

    // Loading state
    if (!currentLesson) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.loadingText}>Đang tải bài tập...</Text>
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

            {/* Speaking Component */}
            {renderSpeakingComponent()}
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
    comingSoonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    comingSoonText: {
        fontSize: 18,
        color: '#6B7280',
        textAlign: 'center',
    },
});

export default SpeakingPracticeScreen;