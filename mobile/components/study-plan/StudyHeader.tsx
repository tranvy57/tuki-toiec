import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '~/constants/Color';

interface StudyHeaderProps {
  onProgressPress?: () => void;
}

export const StudyHeader: React.FC<StudyHeaderProps> = ({ onProgressPress }) => {
  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Học Tập Hôm Nay</Text>
            <Text style={styles.headerSubtitle}>
              Hoàn thành các bài học để tiến bộ mỗi ngày
            </Text>
          </View>
          
          {onProgressPress && (
            <Pressable style={styles.progressButton} onPress={onProgressPress}>
              <Ionicons name="stats-chart" size={20} color="white" />
              <Text style={styles.progressButtonText}>Tiến độ</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandCoral,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 20,
  },
});
