import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const mainIcons = [
  { key: 'profile', label: 'Hồ sơ', icon: 'account-circle-outline', color: '#1976d2' },
  { key: 'attendance', label: 'Bảng công', icon: 'calendar-check-outline', color: '#43a047' },
  { key: 'salary', label: 'Phiếu lương', icon: 'cash-multiple', color: '#fb8c00' },
];

const subIcons = [
  { key: 'leave', label: 'Nghỉ phép', color: ['#ff8a80', '#ff5252'], icon: 'beach', iconLib: 'MaterialCommunityIcons' },
  { key: 'overtime', label: 'Tăng ca', color: ['#80d8ff', '#0091ea'], icon: 'clock-plus-outline', iconLib: 'MaterialCommunityIcons' },
];

export default function HomeScreen() {
  const [checkedIn, setCheckedIn] = useState(true);
  const userName = 'Nguyễn Trần Trí Tâm';
  const checkInTime = '08:40';
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View style={styles.menuIcon} />
            <View style={styles.avatarWrap}>
              <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.avatar} />
            </View>
          </View>
          <Text style={styles.hello}>Xin chào</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Main icons */}
        <View style={styles.mainIconCard}>
          {mainIcons.map(item => (
            <TouchableOpacity
              key={item.key}
              style={styles.mainIconBtn}
            onPress={() => {
                if (item.key === 'attendance') router.push('/attendance');
                if (item.key === 'profile') router.push('/profile' as any);
                if (item.key === 'salary') router.push('/payslip' as any);
              }}
            >
              <View style={[styles.mainIconCircle, { backgroundColor: item.color + '22' }]}> 
                <Icon name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={[styles.mainIconLabel, { color: item.color }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task notification */}
        <View style={styles.taskBox}>
          <Text style={styles.taskText}>Bạn có <Text style={styles.taskCount}>0</Text> công việc cần thực hiện </Text>
          <TouchableOpacity><Text style={styles.taskAll}>Xem tất cả</Text></TouchableOpacity>
        </View>

        {/* Checkin/Checkout */}
        <TouchableOpacity
          style={[styles.checkButton, checkedIn ? styles.checkedOut : styles.checkedIn]}
          onPress={() => router.push('/checkin' as any)}
        >
          <View style={styles.checkBtnRow}>
            <Text style={styles.checkBtnIcon}>🕒</Text>
            <Text style={styles.checkButtonText}>{checkedIn ? 'Check Out' : 'Check In'}</Text>
            <Text style={styles.checkTime}>Giờ check in {checkInTime}</Text>
          </View>
        </TouchableOpacity>

        {/* Sub icons */}
        <View style={styles.subIconGrid}>
          {subIcons.map((item, idx) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.subIconBtn,
                { backgroundColor: item.color[0] },
                idx === 0 ? { marginRight: 12 } : {},
              ]}
              onPress={() => {
                if (item.key === 'leave') router.push('/leave');
                if (item.key === 'overtime') router.push('/overtime');
              }}
            >
              <Icon name={item.icon} size={32} color={'#fff'} style={styles.subIconEmoji} />
              <Text style={styles.subIconLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Decorative progress bar UI */}
        <View style={styles.progressBox}>
          <Text style={styles.progressTitle}>Mức độ hoàn thành tháng này</Text>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressPercent}>72%</Text>
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
    padding: 0,
    alignItems: 'center',
    backgroundColor: '#f6f8fa',
  },
  headerWrap: {
    width: '100%',
    backgroundColor: '#008080',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    opacity: 0.2,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  hello: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 2,
    fontWeight: '400',
  },
  userName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mainIconCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -32,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    justifyContent: 'space-between',
  },
  mainIconBtn: {
    flex: 1,
    alignItems: 'center',
  },
  mainIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  mainIconEmoji: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  mainIconLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  taskBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f8ff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  taskText: {
    fontSize: 15,
    color: '#333',
  },
  taskCount: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  taskAll: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  checkButton: {
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#e53935',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  checkedIn: {
    backgroundColor: '#1a73e8',
  },
  checkedOut: {
    backgroundColor: '#e53935',
  },
  checkBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  checkBtnIcon: {
    fontSize: 22,
    color: '#fff',
    marginRight: 10,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    flex: 1,
  },
  checkTime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  subIconGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  subIconBtn: {
    width: 160,
    aspectRatio: 2.5,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 18,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  subIconEmoji: {
    marginRight: 14,
  },
  progressBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    alignSelf: 'center',
    padding: 18,
    marginBottom: 24,
    shadowColor: '#1976d2',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
    alignItems: 'center',
  },
  progressTitle: {
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
    fontSize: 15,
  },
  progressBarBg: {
    width: '100%',
    height: 16,
    backgroundColor: '#e3eafc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    width: '72%',
    height: '100%',
    backgroundColor: '#1976d2',
    borderRadius: 8,
  },
  progressPercent: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subIconLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
  },
});
