import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';

export default function SpeechToTextScreen() {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        Voice.onSpeechResults = (event: SpeechResultsEvent) => {
            if (event.value && event.value.length > 0) {
                setText(event.value[0]); // realtime update
            }
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const start = async () => {
        try {
            await Voice.start('vi-VN'); // hoặc 'en-US'
            setIsListening(true);
        } catch (e) {
            console.error(e);
        }
    };

    const stop = async () => {
        await Voice.stop();
        setIsListening(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.status}>
                🎙 {isListening ? 'Đang nghe...' : 'Đã dừng'}
            </Text>
            <Text style={styles.text}>{text}</Text>
            <Button title={isListening ? 'Dừng lại' : 'Bắt đầu nói'} onPress={isListening ? stop : start} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { marginVertical: 20, fontSize: 18, textAlign: 'center', paddingHorizontal: 16 },
    status: { color: '#666' },
});
