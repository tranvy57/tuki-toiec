import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

export default function SpeakingReviewIndex() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Speaking Practice</Text>
            <Text style={styles.subtitle}>Choose a speaking skill to practice</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
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
