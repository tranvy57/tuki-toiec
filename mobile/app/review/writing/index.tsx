import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const WritingIntroductionScreen = () => {
  const router = useRouter();
  const { modality, lessonId } = useLocalSearchParams();

  const handleStartPractice = () => {
    // Navigate to the actual writing practice screen
    router.push(`/review/writing/${modality}?lessonId=${lessonId}`);
  };

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Writing Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <FontAwesome5 name="edit" size={48} color="#2563eb" />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Bài tập Writing Task</Text>
          <Text style={styles.subtitle}>
            Luyện tập kỹ năng viết luận tiếng Anh với các chủ đề TOEIC
          </Text>

          {/* Exercise Information */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Thông tin bài tập:</Text>

            <View style={styles.infoItem}>
              <FontAwesome5 name="clock" size={16} color="#6b7280" />
              <Text style={styles.infoText}>Thời gian: 30 phút</Text>
            </View>

            <View style={styles.infoItem}>
              <FontAwesome5 name="file-alt" size={16} color="#6b7280" />
              <Text style={styles.infoText}>Yêu cầu: Tối thiểu 250 từ</Text>
            </View>

            <View style={styles.infoItem}>
              <FontAwesome5 name="target" size={16} color="#6b7280" />
              <Text style={styles.infoText}>Mục tiêu: Thảo luận và đưa ra quan điểm</Text>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Hướng dẫn làm bài:</Text>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Đọc kỹ đề bài và hiểu rõ yêu cầu
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Lập dàn ý và sắp xếp các ý tưởng
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Viết bài với cấu trúc rõ ràng: Mở bài - Thân bài - Kết luận
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>4</Text>
              </View>
              <Text style={styles.instructionText}>
                Sử dụng ví dụ cụ thể để minh họa cho quan điểm
              </Text>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Mẹo làm bài:</Text>
            <Text style={styles.tipText}>• Dành 5 phút đầu để lập dàn ý</Text>
            <Text style={styles.tipText}>• Viết câu chủ đề rõ ràng cho mỗi đoạn</Text>
            <Text style={styles.tipText}>• Sử dụng từ nối để liên kết các ý</Text>
            <Text style={styles.tipText}>• Dành 5 phút cuối để kiểm tra lại bài viết</Text>
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.footer}>
        <Pressable style={styles.startButton} onPress={handleStartPractice}>
          <FontAwesome5 name="play" size={20} color="#fff" />
          <Text style={styles.startButtonText}>Bắt đầu làm bài</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingTop: 48,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  tipsCard: {
    backgroundColor: '#fefce8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#eab308',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#713f12',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 16,
    color: '#a16207',
    lineHeight: 24,
    marginBottom: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default WritingIntroductionScreen;