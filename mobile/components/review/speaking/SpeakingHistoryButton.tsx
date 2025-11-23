import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '~/constants/Color'
import { useSpeakingHistory } from '~/store/speakingHistory'

interface SpeakingHistoryButtonProps {
    skillFilter?: string
    style?: any
    size?: 'small' | 'medium' | 'large'
    variant?: 'primary' | 'secondary' | 'ghost'
}

export const SpeakingHistoryButton: React.FC<SpeakingHistoryButtonProps> = ({
    skillFilter,
    style,
    size = 'medium',
    variant = 'ghost',
}) => {
    const { attempts, showHistoryDialog } = useSpeakingHistory()

    // Get count for badge
    const attemptCount = skillFilter
        ? attempts.filter((attempt) => attempt.skill === skillFilter).length
        : attempts.length

    const handlePress = () => {
        showHistoryDialog()
    }

    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[`${size}Button`], styles[`${variant}Button`]]
        return [...baseStyle, style]
    }

    return (
        <Pressable style={getButtonStyle()} onPress={handlePress}>
            <Ionicons
                name="time"
                size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
                color={variant === 'primary' ? colors.white : colors.foreground}
            />
            {size !== 'small' && (
                <Text
                    style={[
                        styles.buttonText,
                        styles[`${size}Text`],
                        variant === 'primary' ? styles.primaryText : styles.secondaryText,
                    ]}
                >
                    Lịch sử
                </Text>
            )}
            {attemptCount > 0 && (
                <Pressable style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {attemptCount > 99 ? '99+' : attemptCount}
                    </Text>
                </Pressable>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        position: 'relative',
    },
    // Size variants
    smallButton: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        gap: 4,
    },
    mediumButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
    },
    largeButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    // Variant styles
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    ghostButton: {
        backgroundColor: 'transparent',
    },
    // Text styles
    buttonText: {
        fontWeight: '600',
    },
    smallText: {
        fontSize: 12,
    },
    mediumText: {
        fontSize: 14,
    },
    largeText: {
        fontSize: 16,
    },
    primaryText: {
        color: colors.white,
    },
    secondaryText: {
        color: colors.foreground,
    },
    // Badge styles
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: colors.destructive,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
    },
})