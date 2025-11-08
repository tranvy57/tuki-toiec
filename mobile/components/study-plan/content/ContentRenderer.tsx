import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ContentData, ContentDisplayProps } from '~/types/contentTypes';

import { colors } from '~/constants/Color';
import { StrategyContentRenderer } from './StrategyContentRenderer';
import { VideoContentRenderer } from './VideoContentRenderer';
import { QuizContentRenderer } from './QuizContentRenderer';
import { ExplanationContentRenderer } from './ExplanationContentRenderer';
import { VocabularyContentRenderer } from './VocabularyContentRenderer';

export const ContentRenderer: React.FC<ContentDisplayProps> = ({
    content,
    progress,
    onComplete,
    onProgress,
    isPreview = false,
}) => {
    const renderContent = () => {
        const commonProps = {
            progress,
            onComplete,
            onProgress,
            isPreview,
        };

        switch (content.type) {
            case 'strategy':
                return <StrategyContentRenderer content={content} {...commonProps} />;

            case 'video':
                return <VideoContentRenderer content={content} {...commonProps} />;

            case 'quiz':
                return <QuizContentRenderer content={content} {...commonProps} />;

            case 'explanation':
                return <ExplanationContentRenderer content={content} {...commonProps} />;

            case 'vocabulary':
                return <VocabularyContentRenderer content={content} {...commonProps} />;

            default:
                return (
                    <View style={styles.unsupportedContainer}>
                        <Text style={styles.unsupportedText}>
                            Loại nội dung không được hỗ trợ: {(content as any).type}
                        </Text>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    unsupportedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    unsupportedText: {
        fontSize: 16,
        color: colors.mutedForeground,
        textAlign: 'center',
    },
});