import { useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAttendanceData } from '../../composables/useAttendanceData';
import CustomHeader from '../../components/CustomHeader';

const fakeData = [
  { day: '5', date: '07/08', time: '08:40', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
  { day: '4', date: '06/08', time: '08:40', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
  { day: '3', date: '05/08', time: '12:47', shift: 'n/a', type: 'ĐiLam', color: '#e53935' },
  { day: '3', date: '05/08', time: '08:38', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
  { day: '2', date: '04/08', time: '17:43', shift: 'n/a', type: 'ĐiLam', color: '#e53935' },
  { day: '2', date: '04/08', time: '08:23', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
  { day: '6', date: '01/08', time: '17:45', shift: 'n/a', type: 'ĐiLam', color: '#e53935' },
  { day: '6', date: '01/08', time: '08:40', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
];

export default function AttendanceData() {
  const router = useRouter();
  const { attendanceData, loading, error, fetchAttendanceData } = useAttendanceData();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAttendanceData();
  }, [currentMonth, currentYear]);

  const loadAttendanceData = async () => {
    await fetchAttendanceData({
      year: currentYear,
      month: currentMonth
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const getDayOfWeek = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[date.getDay()];
    } catch (error) {
      console.error('Error getting day of week:', error);
      return '';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ĐiLam':
        return '#43a047';
      case 'Về':
        return '#43a047';
      case 'Đi trễ':
        return '#e53935';
      case 'Về sớm':
        return '#e53935';
      default:
        return '#43a047';
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <CustomHeader title="BẢNG CÔNG" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#008080" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <CustomHeader title="BẢNG CÔNG" />
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={64} color="#e53935" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadAttendanceData}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <CustomHeader title="BẢNG CÔNG" />
        
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={handlePreviousMonth}>
            <Icon name="chevron-left" size={24} color="#008080" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth < 10 ? `0${currentMonth}` : currentMonth}/{currentYear}
          </Text>
          <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
            <Icon name="chevron-right" size={24} color="#008080" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 1 }]}>THỨ</Text>
              <Text style={[styles.th, { flex: 2 }]}>NGÀY</Text>
              <Text style={[styles.th, { flex: 2 }]}>GIỜ VÀO/RA</Text>
              <Text style={[styles.th, { flex: 1 }]}>CA</Text>
              <Text style={[styles.th, { flex: 2 }]}>LOẠI</Text>
            </View>
            {attendanceData.map((row, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.td, { flex: 1 }]}>{getDayOfWeek(row.date)}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{formatDate(row.date)}</Text>
                <Text style={[styles.td, { flex: 2, color: getTypeColor(row.type) }]}>
                  {formatTime(row.scanTime)}
                </Text>
                <Text style={[styles.td, { flex: 1 }]}>{row.shiftName || 'N/A'}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{row.type || 'Đi làm'}</Text>
              </View>
            ))}
            {attendanceData.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có dữ liệu chấm công</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#008080',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
    marginHorizontal: 20,
  },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0f2f1',
    borderBottomWidth: 1,
    borderColor: '#b2dfdb',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  th: {
    color: '#008080',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
    backgroundColor: '#fff',
  },
  tableRowAlt: {
    backgroundColor: '#f6f8fa',
  },
  td: {
    color: '#222',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
