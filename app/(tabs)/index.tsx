import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import HomeHeader from '../../components/common/HomeHeader';
import api from '../../api';

const { width: screenWidth } = Dimensions.get('window');

const mainIcons = [
  { 
    key: 'profile', 
    label: 'Hồ sơ', 
    icon: 'account-circle-outline', 
    primaryColor: '#3498db',
    secondaryColor: '#2980b9',
    gradient: ['#3498db', '#2980b9'],
    bgGradient: ['#e3f2fd', '#f0f8ff']
  },
  { 
    key: 'attendance', 
    label: 'Bảng công', 
    icon: 'calendar-check-outline', 
    primaryColor: '#2c3e50',
    secondaryColor: '#34495e',
    gradient: ['#2c3e50', '#34495e'],
    bgGradient: ['#ecf0f1', '#f8f9fa']
  },
  { 
    key: 'salary', 
    label: 'Phiếu lương', 
    icon: 'cash-multiple', 
    primaryColor: '#27ae60',
    secondaryColor: '#229954',
    gradient: ['#27ae60', '#229954'],
    bgGradient: ['#e8f5e8', '#f0fdf4']
  },
];

const subIcons = [
  { 
    key: 'leave', 
    label: 'Nghỉ phép', 
    icon: 'beach', 
    primaryColor: '#3498db',
    secondaryColor: '#2980b9',
    gradient: ['#3498db', '#2980b9'],
    bgGradient: ['#e3f2fd', '#f0f8ff']
  },
  { 
    key: 'overtime', 
    label: 'Tăng ca', 
    icon: 'clock-plus-outline', 
    primaryColor: '#2c3e50',
    secondaryColor: '#34495e',
    gradient: ['#2c3e50', '#34495e'],
    bgGradient: ['#ecf0f1', '#f8f9fa']
  },
];

export default function HomeScreen() {
  const [checkedIn, setCheckedIn] = useState(false); // Mặc định chưa checkin
  const [actualCheckInTime, setActualCheckInTime] = useState(null); // Giờ checkin thực tế
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const userName = user?.fullName || 'Người dùng';
  const checkInTime = '08:40';
  const router = useRouter();

  // Kiểm tra authentication state và chuyển hướng nếu cần
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login' as any);
    } else if (isAuthenticated && user?.id) {
      // Kiểm tra trạng thái checkin khi đã đăng nhập
      checkTodayAttendanceStatus();
    }
  }, [isAuthenticated, isLoading, router, user?.id]);

  // Kiểm tra trạng thái checkin từ API
  const checkTodayAttendanceStatus = async () => {
    if (!user?.id) return;
    
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await api.get(`/AttendanceData`);
      
      if (response.data && response.data.length > 0) {
        // Filter dữ liệu của user hôm nay
        const todayAttendance = response.data.find((item: any) => 
          item.employeeCode === user.id && 
          item.workDate === today
        );
        
        if (todayAttendance) {
          const hasCheckIn = todayAttendance.checkInTime !== null;
          const hasCheckOut = todayAttendance.checkOutTime !== null;
          
          console.log('📊 Today attendance status:', {
            hasCheckIn,
            hasCheckOut,
            checkInTime: todayAttendance.checkInTime,
            checkOutTime: todayAttendance.checkOutTime
          });
          
          if (hasCheckIn && !hasCheckOut) {
            // Đã checkin nhưng chưa checkout
            setCheckedIn(true);
            setActualCheckInTime(todayAttendance.checkInTime);
          } else if (hasCheckIn && hasCheckOut) {
            // Đã checkin và checkout rồi
            setCheckedIn(false);
            setActualCheckInTime(todayAttendance.checkInTime);
          } else {
            // Chưa checkin
            setCheckedIn(false);
            setActualCheckInTime(null);
          }
        } else {
          // Không có dữ liệu hôm nay, kiểm tra AsyncStorage
          const today = new Date().toDateString();
          const checkinData = await AsyncStorage.getItem(`checkin_${today}`);
          if (checkinData) {
            const parsed = JSON.parse(checkinData);
            console.log('📱 No API data for today, using AsyncStorage:', parsed);
            setCheckedIn(parsed.checkedIn);
            if (parsed.checkInTime) {
              setActualCheckInTime(parsed.checkInTime);
            }
          } else {
            setCheckedIn(false);
            setActualCheckInTime(null);
          }
        }
      } else {
        // Không có dữ liệu từ API, kiểm tra AsyncStorage
        const today = new Date().toDateString();
        const checkinData = await AsyncStorage.getItem(`checkin_${today}`);
        if (checkinData) {
          const parsed = JSON.parse(checkinData);
          console.log('📱 No API data, using AsyncStorage:', parsed);
          setCheckedIn(parsed.checkedIn);
          if (parsed.checkInTime) {
            setActualCheckInTime(parsed.checkInTime);
          }
        } else {
          setCheckedIn(false);
          setActualCheckInTime(null);
        }
      }
    } catch (error) {
      console.error('Error checking attendance status:', error);
      // Fallback: sử dụng AsyncStorage
      const today = new Date().toDateString();
      const checkinData = await AsyncStorage.getItem(`checkin_${today}`);
      if (checkinData) {
        const parsed = JSON.parse(checkinData);
        console.log('📱 AsyncStorage checkin data:', parsed);
        setCheckedIn(parsed.checkedIn);
        if (parsed.checkInTime) {
          setActualCheckInTime(parsed.checkInTime);
        }
      }
    }
  };

  // Reload checkin status khi focus vào screen
  useFocusEffect(
    React.useCallback(() => {
      checkTodayAttendanceStatus();
    }, [user?.id])
  );

  // Save trạng thái checkin vào AsyncStorage
  const saveCheckinStatus = async (status: boolean) => {
    try {
      const today = new Date().toDateString();
      const checkinData = {
        checkedIn: status,
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem(`checkin_${today}`, JSON.stringify(checkinData));
      setCheckedIn(status);
    } catch (error) {
      console.error('Error saving checkin status:', error);
    }
  };

  // Hiển thị loading nếu đang kiểm tra authentication
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Chuyển hướng về trang login sau khi đăng xuất
            router.replace('/login' as any);
          },
        },
      ]
    );
  };
  return (
    <LinearGradient
      colors={['#ecf0f1', '#f8f9fa', '#ffffff']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header */}
        <HomeHeader 
          userName={userName}
          onLogoutPress={handleLogout}
          avatarSource={require('@/assets/images/partial-react-logo.png')}
        />

        {/* Main icons */}
        <View style={styles.mainIconContainer}>
          <View style={styles.mainIconGrid}>
            {mainIcons.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={styles.mainIconBtn}
                onPress={() => {
                  if (item.key === 'attendance') router.push('/attendance');
                  if (item.key === 'profile') router.push('/profile');
                  if (item.key === 'salary') router.push('/payslip');
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={item.bgGradient as any}
                  style={styles.mainIconCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <LinearGradient
                    colors={item.gradient as any}
                    style={styles.mainIconInner}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name={item.icon} size={24} color="#ffffff" />
                  </LinearGradient>
                </LinearGradient>
                <Text style={[styles.mainIconLabel, { color: item.primaryColor }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Checkin/Checkout */}
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => {
            const mode = checkedIn ? 'checkout' : 'checkin';
            router.push({
              pathname: '/checkin' as any,
              params: { mode }
            });
          }}
          activeOpacity={0.85}
        >
          <BlurView intensity={15} style={styles.checkButtonBlur}>
            <LinearGradient
              colors={checkedIn ? ['#e8f5e8', '#f0fdf4'] : ['#e3f2fd', '#f0f8ff']}
              style={styles.checkButtonContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.checkBtnRow}>
                <LinearGradient
                  colors={checkedIn ? ['#27ae60', '#229954'] : ['#3498db', '#2980b9']}
                  style={styles.checkIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="clock-outline" size={28} color="#ffffff" />
                </LinearGradient>
                <View style={styles.checkTextContainer}>
                  <Text style={[styles.checkButtonText, checkedIn ? styles.checkedOutText : styles.checkedInText]}>
                    {checkedIn ? 'Check Out' : 'Check In'}
                  </Text>
                  <Text style={[styles.checkTime, checkedIn ? styles.checkedOutTime : styles.checkedInTime]}>
                    {checkedIn && actualCheckInTime 
                      ? `Giờ check in: ${(actualCheckInTime as string).substring(0, 5)}`
                      : checkedIn 
                        ? 'Giờ check in: --:--'
                        : 'Chưa check in'
                    }
                  </Text>
                </View>
                <View style={styles.checkArrowContainer}>
                  <Icon name="chevron-right" size={24} color={checkedIn ? "#27ae60" : "#3498db"} />
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>

        {/* Sub icons */}
        <View style={styles.subIconGrid}>
          {subIcons.map((item, idx) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.subIconBtn,
                idx === 0 ? { marginRight: 12 } : {},
              ]}
              onPress={() => {
                if (item.key === 'leave') router.push('/leave');
                if (item.key === 'overtime') router.push('/overtime');
              }}
              activeOpacity={0.8}
            >
              <BlurView intensity={10} style={styles.subIconBlur}>
                <LinearGradient
                  colors={item.bgGradient as any}
                  style={styles.subIconContent}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <LinearGradient
                    colors={item.gradient as any}
                    style={styles.subIconInner}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name={item.icon} size={32} color="#ffffff" style={styles.subIconEmoji} />
                  </LinearGradient>
                  <Text style={[styles.subIconLabel, { color: item.primaryColor }]}>{item.label}</Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 0,
    alignItems: 'center',
    paddingBottom: 32,
  },
  mainIconContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainIconGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: '100%',
  },
  mainIconBtn: {
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 12,
    minWidth: 100,
  },
  mainIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  mainIconInner: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mainIconLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  checkButton: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  checkButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  checkButtonContent: {
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  checkedIn: {
    // Style for checked in state
  },
  checkedOut: {
    // Style for checked out state
  },
  checkBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  checkIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkedInIcon: {
    backgroundColor: '#dbeafe',
  },
  checkedOutIcon: {
    backgroundColor: '#fecaca',
  },
  checkTextContainer: {
    flex: 1,
  },
  checkButtonText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  checkedInText: {
    color: '#3498db',
  },
  checkedOutText: {
    color: '#27ae60',
  },
  checkTime: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.8,
  },
  checkedInTime: {
    color: '#2c3e50',
  },
  checkedOutTime: {
    color: '#2c3e50',
  },
  checkArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subIconGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 32,
  },
  subIconBtn: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  subIconBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subIconContent: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: 120,
  },
  subIconInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  subIconEmoji: {
    // Icon styling handled in component
  },
  subIconLabel: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
