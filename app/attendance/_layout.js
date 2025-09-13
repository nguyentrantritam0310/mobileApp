import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AttendanceLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'cloud-outline';
          if (route.name === 'summary') iconName = 'calendar-month-outline';
          if (route.name === 'detail') iconName = 'file-document-outline';
          if (route.name === 'overtime') iconName = 'clock-plus-outline';
          if (route.name === 'feedback') iconName = 'message-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#008080',
        tabBarInactiveTintColor: '#bdbdbd',
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 13 },
        tabBarStyle: { backgroundColor: '#fff' },
        headerShown: false, // Ẩn header trên cùng
      })}
      // Ẩn header trên cùng cho toàn bộ tab
      screenListeners={{
        state: (e) => {
          if (e.data?.state?.routes) {
            e.data.state.routes.forEach(route => {
              route.options = { ...route.options, headerShown: false };
            });
          }
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dữ Liệu' }} />
      <Tabs.Screen name="summary" options={{ title: 'Tổng Công' }} />
      <Tabs.Screen name="detail" options={{ title: 'Chi Tiết' }} />
      <Tabs.Screen name="overtime" options={{ title: 'Tăng Ca' }} />
      <Tabs.Screen name="feedback" options={{ title: 'Phản Ánh' }} />
    </Tabs>
  );
}
