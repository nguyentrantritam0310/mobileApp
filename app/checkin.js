import * as Location from 'expo-location';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useEffect, useState } from 'react';

export default function CheckInScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('vi-VN');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Icon name="arrow-left" size={28} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHẤM CÔNG</Text>
        <View style={{ width: 28 }} />
      </View>
      {/* User info */}
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Icon name="account-circle" size={44} color="#bdbdbd" />
        </View>
        <Text style={styles.userName}>Nguyễn Trần Trí Tâm</Text>
      </View>
      {/* Map with current location */}
      <View style={styles.mapBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#008080" style={{ height: 140 }} />
        ) : location ? (
          <MapView
            style={styles.mapImg}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            showsUserLocation={true}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          </MapView>
        ) : (
          <View style={[styles.mapImg, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: '#888' }}>Không lấy được vị trí</Text>
          </View>
        )}
        <Text style={styles.privacy}>Quyền riêng tư</Text>
      </View>
      {/* Work schedule */}
      <View style={styles.scheduleBox}>
        <Text style={styles.scheduleText}>Ngày {date} - Ca hành chính (08:30-17:30) (Đã check in lúc : 08:40)</Text>
      </View>
      {/* Time + camera */}
      <View style={styles.timeBox}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.date}>{date}</Text>
        <TouchableOpacity style={styles.cameraBtn}>
          <Icon name="camera" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Check Out button */}
      <TouchableOpacity style={styles.checkBtn}>
        <Text style={styles.checkBtnText}>Check Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderColor: '#e0e0e0',
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#008080', fontWeight: 'bold', fontSize: 20, textAlign: 'center', flex: 1 },
  userRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 10, elevation: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f3f3f3', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  userName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  mapBox: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', elevation: 1, marginBottom: 8 },
  mapImg: { width: '100%', height: 140 },
  privacy: { position: 'absolute', right: 10, top: 10, color: '#1976d2', fontSize: 13, fontWeight: '500' },
  scheduleBox: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, padding: 10, marginBottom: 8, elevation: 1 },
  scheduleText: { color: '#888', fontSize: 14 },
  timeBox: { alignItems: 'center', marginTop: 18, marginBottom: 18 },
  time: { fontSize: 38, fontWeight: 'bold', color: '#1976d2' },
  date: { fontSize: 18, color: '#1976d2', marginBottom: 10 },
  cameraBtn: { backgroundColor: '#ffc107', borderRadius: 32, padding: 16, marginBottom: 10 },
  checkBtn: { backgroundColor: '#008080', marginHorizontal: 16, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  checkBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
