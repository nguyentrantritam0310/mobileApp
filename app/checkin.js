import axios from 'axios';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CameraCheckIn from '../components/CameraCheckIn';
import { useWorkShift } from '../composables/useWorkShift';
import { getAttendanceMachines } from '../services/attendanceMachineService';

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function CheckInScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [machines, setMachines] = useState([]);
  const [machinesLoading, setMachinesLoading] = useState(true);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [activeMachineName, setActiveMachineName] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // New state for image handling and API call
  const [capturedImage, setCapturedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null

  const { workShifts, loading: shiftsLoading, error: shiftsError } = useWorkShift();
  const now = new Date();
  const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('vi-VN');

  useEffect(() => {
    const fetchLocation = async () => {
      setLocationLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc.coords);
        }
      } catch (err) {
        console.error('Error fetching location:', err);
      } finally {
        setLocationLoading(false);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchMachines = async () => {
      setMachinesLoading(true);
      try {
        const data = await getAttendanceMachines();
        setMachines(data);
      } catch (err) {
        console.error('Error fetching machines:', err);
      } finally {
        setMachinesLoading(false);
      }
    };
    fetchMachines();
  }, []);

  useEffect(() => {
    if (location && machines.length > 0) {
      let inRange = false;
      let machineName = '';
      for (const machine of machines) {
        const distance = getDistance(location.latitude, location.longitude, parseFloat(machine.latitude), parseFloat(machine.longitude));
        if (distance <= parseFloat(machine.allowedRadius)) {
          inRange = true;
          machineName = machine.attendanceMachineName;
          break;
        }
      }
      setIsWithinRadius(inRange);
      setActiveMachineName(machineName);
    }
  }, [location, machines]);

  const handlePictureTaken = async (croppedPhoto) => {
    setIsCameraOpen(false);
    if (!croppedPhoto || !croppedPhoto.base64) {
      Alert.alert('Lỗi', 'Không thể lấy được ảnh đã xử lý.');
      return;
    }

    setCapturedImage(croppedPhoto.uri);
    setUploadStatus(null);
    setIsUploading(true);

    // --- MOCK API CALL ---
    try {
      // The mock API expects a base64 string
      const response = await axios.post('https://mock-face-api.glitch.me/faceid/checkin', {
        userId: 'user123', // Example user ID
        imageBase64: croppedPhoto.base64,
      });

      if (response.data.success) {
        setUploadStatus('success');
        Alert.alert('Thành công', `Check-in thành công! (Confidence: ${response.data.confidence.toFixed(2)}%)`);
      } else {
        setUploadStatus('error');
        Alert.alert('Thất bại', response.data.message || 'API đã từ chối yêu cầu.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setUploadStatus('error');
      Alert.alert('Lỗi API', 'Không thể kết nối đến máy chủ chấm công.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderWorkshiftItem = ({ item }) => (
    <View style={styles.shiftItem}>
      <Text style={styles.shiftName}>{item.shiftName}</Text>
      {item.shiftDetails.map(detail => (
        <Text key={detail.id} style={styles.shiftDetail}>{detail.dayOfWeek}: {detail.startTime} - {detail.endTime}</Text>
      ))}
    </View>
  );

  const isCheckInDisabled = !isWithinRadius || locationLoading || machinesLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Icon name="arrow-left" size={28} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHẤM CÔNG</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Icon name="account-circle" size={44} color="#bdbdbd" />
        </View>
        <Text style={styles.userName}>Nguyễn Trần Trí Tâm</Text>
      </View>

      <View style={styles.mapBox}>
        {locationLoading ? (
          <ActivityIndicator size="large" color="#008080" style={{ height: 140 }} />
        ) : location ? (
          <MapView style={styles.mapImg} initialRegion={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.002, longitudeDelta: 0.002 }} showsUserLocation scrollEnabled={false} zoomEnabled={false} pitchEnabled={false} rotateEnabled={false}>
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          </MapView>
        ) : (
          <View style={[styles.mapImg, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ color: '#888' }}>Không lấy được vị trí</Text></View>
        )}
        <Text style={styles.privacy}>Quyền riêng tư</Text>
      </View>

      <View style={styles.locationStatusBox}>
        {locationLoading || machinesLoading ? (
          <Text style={styles.statusText}>Đang kiểm tra vị trí...</Text>
        ) : isWithinRadius ? (
          <Text style={styles.statusTextSuccess}>Bạn đang ở trong khu vực chấm công: {activeMachineName}</Text>
        ) : (
          <Text style={styles.statusTextError}>Bạn không ở trong khu vực chấm công</Text>
        )}
      </View>

      {/* --- Image Preview and Status --- */}
      {capturedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          {isUploading && <ActivityIndicator size="large" color="#008080" style={styles.uploadSpinner} />}
          {uploadStatus === 'success' && <Icon name="check-circle" size={40} color="#43a047" style={styles.statusIcon} />}
          {uploadStatus === 'error' && <Icon name="close-circle" size={40} color="#e53935" style={styles.statusIcon} />}
        </View>
      )}

      <View style={styles.timeBox}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.date}>{date}</Text>
        <TouchableOpacity style={[styles.cameraBtn, isCheckInDisabled && styles.cameraBtnDisabled]} disabled={isCheckInDisabled} onPress={() => setIsCameraOpen(true)}>
          <Icon name="camera" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={false} visible={isCameraOpen} onRequestClose={() => setIsCameraOpen(false)}>
        <CameraCheckIn onPictureTaken={handlePictureTaken} onClose={() => setIsCameraOpen(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e0e0e0' },
  backBtn: { padding: 4 },
  headerTitle: { color: '#008080', fontWeight: 'bold', fontSize: 20, textAlign: 'center', flex: 1 },
  userRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 10, elevation: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f3f3f3', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  userName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  mapBox: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', elevation: 1, marginTop: 8 },
  mapImg: { width: '100%', height: 120 },
  privacy: { position: 'absolute', right: 10, top: 10, color: '#1976d2', fontSize: 13, fontWeight: '500' },
  locationStatusBox: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, padding: 12, elevation: 1, marginTop: 8 },
  statusText: { textAlign: 'center', fontSize: 15, color: '#555' },
  statusTextSuccess: { textAlign: 'center', fontSize: 15, color: '#2e7d32', fontWeight: 'bold' },
  statusTextError: { textAlign: 'center', fontSize: 15, color: '#c62828', fontWeight: 'bold' },
  timeBox: { alignItems: 'center', marginTop: 12, flex: 1, justifyContent: 'center' },
  time: { fontSize: 38, fontWeight: 'bold', color: '#1976d2' },
  date: { fontSize: 18, color: '#1976d2', marginBottom: 10 },
  cameraBtn: { backgroundColor: '#ffc107', borderRadius: 32, padding: 16, marginBottom: 10 },
  cameraBtnDisabled: { backgroundColor: '#e0e0e0' },
  previewContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 1,
    position: 'relative',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  uploadSpinner: {
    position: 'absolute',
  },
  statusIcon: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
});
