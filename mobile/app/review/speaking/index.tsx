import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { SpeakingHistoryButton } from '~/components/review/speaking/SpeakingHistoryButton';
import { SpeakingHistoryDialog } from '~/components/review/speaking/SpeakingHistoryDialog';
import { useSpeakingHistory } from '~/store/speakingHistory';

export default function SpeakingReviewIndex() {
    const { isHistoryDialogVisible, hideHistoryDialog } = useSpeakingHistory();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SpeakingHistoryButton
                    size="medium"
                    variant="secondary"
                    style={styles.historyButton}
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Speaking Practice</Text>
                <Text style={styles.subtitle}>Choose a speaking skill to practice</Text>
            </View>

            <SpeakingHistoryDialog
                visible={isHistoryDialogVisible}
                onClose={hideHistoryDialog}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60, // For status bar
        paddingBottom: 16,
    },
    historyButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});
