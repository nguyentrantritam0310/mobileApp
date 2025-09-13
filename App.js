import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const icons = [
  { key: 'profile', label: 'Hồ sơ', icon: '👤' },
  { key: 'attendance', label: 'Bảng công', icon: '📅' },
  { key: 'salary', label: 'Phiếu lương', icon: '💰' },
  { key: 'request', label: 'Đơn từ', icon: '📝' },
];

const todaySchedule = [
  { time: '08:00', task: 'Họp nhóm' },
  { time: '09:30', task: 'Làm việc dự án A' },
  { time: '13:00', task: 'Gặp khách hàng' },
  { time: '15:00', task: 'Báo cáo tiến độ' },
];

export default function App() {
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>Xin chào User 👋</Text>
        <View style={styles.iconRow}>
          {icons.map(item => (
            <TouchableOpacity key={item.key} style={styles.iconButton}>
              <Text style={styles.iconEmoji}>{item.icon}</Text>
              <Text style={styles.iconLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch làm việc hôm nay</Text>
          {todaySchedule.map((item, idx) => (
            <View key={idx} style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <Text style={styles.scheduleTask}>{item.task}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.checkButton, checkedIn ? styles.checkedOut : styles.checkedIn]}
          onPress={() => setCheckedIn(!checkedIn)}
        >
          <Text style={styles.checkButtonText}>{checkedIn ? 'Check Out' : 'Check In'}</Text>
        </TouchableOpacity>
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>Mẹo hôm nay</Text>
          <Text style={styles.tipText}>Hãy check-in đúng giờ để nhận thưởng cuối tháng!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  iconButton: {
    alignItems: 'center',
    flex: 1,
  },
  iconEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  iconLabel: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a73e8',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleTime: {
    fontWeight: 'bold',
    color: '#1a73e8',
    width: 60,
  },
  scheduleTask: {
    fontSize: 15,
    color: '#333',
  },
  checkButton: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#1a73e8',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  checkedIn: {
    backgroundColor: '#1a73e8',
  },
  checkedOut: {
    backgroundColor: '#e53935',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tipBox: {
    width: '100%',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  tipTitle: {
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  tipText: {
    color: '#1976d2',
    fontSize: 14,
  },
});
