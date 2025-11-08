import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface PictureDescriptionPromptProps {
    imageUrl?: string;
    timeLimit?: number;
    wordLimit?: number;
    preparationTime?: number;
}

const PictureDescriptionPrompt: React.FC<PictureDescriptionPromptProps> = ({
    imageUrl,
    timeLimit = 20,
    wordLimit = 150,
    preparationTime = 2,
}) => {
    const screenWidth = Dimensions.get('window').width;
    const imageWidth = screenWidth - 72; // Account for padding and margins

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.promptCard}>
                <View style={styles.taskHeader}>
                    <FontAwesome5 name="image" size={24} color="#10b981" />
                    <Text style={styles.taskType}>Picture Description</Text>
                </View>

                <Text style={styles.promptTitle}>Writing Task</Text>
                <Text style={styles.promptText}>
                    You have {preparationTime} minutes to study the picture and {timeLimit} minutes to write a description:
                </Text>

                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={[styles.image, { width: imageWidth, height: imageWidth * 0.6 }]}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.placeholderImage, { width: imageWidth, height: imageWidth * 0.6 }]}>
                            <FontAwesome5 name="image" size={48} color="#9ca3af" />
                            <Text style={styles.placeholderText}>Image will appear here</Text>
                        </View>
                    )}
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>Instructions:</Text>
                    <Text style={styles.instructionItem}>• Write at least {wordLimit} words</Text>
                    <Text style={styles.instructionItem}>• Describe what you see in detail</Text>
                    <Text style={styles.instructionItem}>• Include people, objects, actions, and setting</Text>
                    <Text style={styles.instructionItem}>• Use descriptive adjectives and precise vocabulary</Text>
                    <Text style={styles.instructionItem}>• Organize your description logically</Text>
                </View>

                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>💡 Description Tips:</Text>
                    <Text style={styles.tipItem}>• Start with the overall scene/setting</Text>
                    <Text style={styles.tipItem}>• Describe from left to right or foreground to background</Text>
                    <Text style={styles.tipItem}>• Use present continuous for actions you see</Text>
                    <Text style={styles.tipItem}>• Include colors, sizes, positions, and emotions</Text>
                </View>

                <View style={styles.vocabularyContainer}>
                    <Text style={styles.vocabularyTitle}>Useful Phrases:</Text>
                    <View style={styles.phraseRow}>
                        <Text style={styles.phrase}>• In the foreground/background</Text>
                        <Text style={styles.phrase}>• On the left/right side</Text>
                    </View>
                    <View style={styles.phraseRow}>
                        <Text style={styles.phrase}>• In the center of the image</Text>
                        <Text style={styles.phrase}>• It appears that...</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        padding: 16,
    },
    promptCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    taskType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10b981',
    },
    promptTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 12,
    },
    promptText: {
        fontSize: 16,
        color: '#475569',
        lineHeight: 24,
        marginBottom: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    placeholderImage: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    placeholderText: {
        fontSize: 14,
        color: '#9ca3af',
    },
    instructionsContainer: {
        marginBottom: 20,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    instructionItem: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
        lineHeight: 20,
    },
    tipsContainer: {
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#0ea5e9',
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0c4a6e',
        marginBottom: 8,
    },
    tipItem: {
        fontSize: 14,
        color: '#075985',
        marginBottom: 4,
        lineHeight: 20,
    },
    vocabularyContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    vocabularyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    phraseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    phrase: {
        fontSize: 14,
        color: '#6b7280',
        flex: 1,
    },
});

export default PictureDescriptionPrompt;