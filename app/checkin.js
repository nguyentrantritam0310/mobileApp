import axios from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkShift } from '../composables/useWorkShift';
import { getAttendanceMachines } from '../services/attendanceMachineService';
import { useAuth } from '../contexts/AuthContext';
import CustomHeader from '../components/CustomHeader';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { detectFaces, compareFaces, validateFaceQuality, getRegisteredFace } from '../services/faceDetectionService';

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

const InternalCameraCheckIn = ({ onPictureTaken, onClose }) => {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.1, // 10% quality - rất thấp
        base64: true,
        skipProcessing: false, // Cho phép xử lý để nén tốt hơn
        exif: false
      });
      
      console.log(`📸 Captured image size: ${photo.base64.length} characters (${Math.round(photo.base64.length/1024)}KB)`);
      
      setCapturedImage(photo);
      onPictureTaken(photo);
    } catch (error) {
      console.error('Lỗi chụp ảnh:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
    } finally {
      setIsCapturing(false);
    }
  };


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={internalCameraStyles.permissionContainer}>
        <Text style={internalCameraStyles.permissionText}>Cần quyền truy cập camera</Text>
        <Button onPress={requestPermission} title="Cấp quyền" />
      </View>
    );
  }



  const toggleCameraType = () => {
    setFacing(current => {
       // Đảm bảo chuyển đổi đúng giá trị
      const newFacing = current === 'back' ? 'front' : 'back';
      console.log('Chuyển camera từ', current, 'sang', newFacing);
      return newFacing;
  });
  };
   const handleCameraReady = () => {
    console.log('Camera đã sẵn sàng, loại camera:', facing);
    setCameraReady(true);
  };

  const handleClose = () => {
    setCapturedImage(null);
    if (onClose) onClose();
  };
 const cameraType = facing === 'front' ? 'front' : 'back';
  return (
    <View style={internalCameraStyles.container}>
      <CameraView
        ref={cameraRef} 
        style={internalCameraStyles.camera} 
        facing={cameraType}
        onCameraReady={handleCameraReady}
        ratio="16:9"
      >
        <View style={internalCameraStyles.header}>
          <TouchableOpacity style={internalCameraStyles.closeBtn} onPress={handleClose}>
            <Icon name="close" size={32} color="#fff" />
          </TouchableOpacity>
          
          {/* Hiển thị loại camera hiện tại */}
          <View style={internalCameraStyles.cameraTypeIndicator}>
            <Text style={internalCameraStyles.cameraTypeText}>
              Camera {facing === 'front' ? 'Trước' : 'Sau'}
            </Text>
          </View>
        </View>

        <View style={internalCameraStyles.footer}>
          <TouchableOpacity 
            style={internalCameraStyles.flipBtn} 
            onPress={toggleCameraType}
            disabled={!cameraReady}
          >
            <Icon name="camera-flip" size={28} color="#fff" />
            <Text style={internalCameraStyles.flipText}>Đổi camera</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              internalCameraStyles.captureBtn,
              (!cameraReady || isCapturing) && internalCameraStyles.captureBtnDisabled
            ]} 
            onPress={takePicture}
            disabled={!cameraReady || isCapturing}
          >
            <View style={internalCameraStyles.captureInnerCircle}>
              {isCapturing ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Icon name="camera" size={30} color="#000" />
              )}
            </View>
          </TouchableOpacity>

        </View>


        {/* Simple Attendance Camera Status */}
        <View style={internalCameraStyles.statusIndicator}>
          <Text style={internalCameraStyles.statusText}>
            📸 Camera sẵn sàng - Chụp ảnh để chấm công đơn giản
          </Text>
          {isCapturing && (
            <Text style={internalCameraStyles.capturingText}>
              Đang chụp ảnh...
            </Text>
          )}
        </View>

        {!cameraReady && (
          <View style={internalCameraStyles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={internalCameraStyles.loadingText}>Đang khởi động camera...</Text>
          </View>
        )}

        {isCapturing && (
          <View style={internalCameraStyles.capturingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={internalCameraStyles.loadingText}>Đang chụp ảnh...</Text>
          </View>
        )}
      </CameraView>

      {capturedImage && (
        <View style={internalCameraStyles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={internalCameraStyles.previewImage} />
          <Text style={internalCameraStyles.previewText}>Ảnh đã chụp</Text>
        </View>
      )}
    </View>
  );
};

const internalCameraStyles = StyleSheet.create({
 container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  camera: { 
    flex: 1 
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1
  },
  permissionContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#fff'
  },
  permissionText: { 
    textAlign: 'center', 
    marginBottom: 20, 
    fontSize: 16,
    color: '#333'
  },
  closeBtn: { 
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8
  },
  cameraTypeIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  cameraTypeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  captureBtn: { 
    alignSelf: 'center' 
  },
  captureBtnDisabled: {
    opacity: 0.5
  },
  captureInnerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)'
  },
  flipBtn: { 
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center'
  },
  flipText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4
  },
  loadingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  capturingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  loadingText: { 
    color: '#fff', 
    marginTop: 12, 
    fontSize: 16 
  },
  previewContainer: { 
    position: 'absolute', 
    bottom: 130, 
    right: 20, 
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 12
  },
  previewImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    borderWidth: 2, 
    borderColor: '#fff' 
  },
  previewText: { 
    color: '#fff', 
    fontSize: 12, 
    marginTop: 4 
  },
  detectionIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  detectionText: {
    color: '#4caf50',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500'
  },
  statusIndicator: {
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    zIndex: 1
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  countdownStatus: {
    color: '#ffeb3b',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center'
  },
  disabledText: {
    color: '#ff9800',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center'
  },
  capturingText: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center'
  },
});

export default function CheckInScreen({ navigation, route }) {
  const { user } = useAuth();
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [machines, setMachines] = useState([]);
  const [machinesLoading, setMachinesLoading] = useState(true);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [activeMachineName, setActiveMachineName] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [selectedShift, setSelectedShift] = useState(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  
  // Lấy mode từ route params (checkin hoặc checkout)
  const mode = route?.params?.mode || 'checkin';

  const { workShifts, loading: shiftsLoading, error: shiftsError } = useWorkShift();
  const now = new Date();
  const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('vi-VN');

  // Lấy ca làm việc của thứ hiện tại
  const getTodayShifts = () => {
    if (!workShifts || workShifts.length === 0) return [];
    
    const currentDay = now.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
    
    return workShifts.filter(shift => {
      if (!shift.shiftDetails || shift.shiftDetails.length === 0) return false;
      
      // Chỉ lấy ca có lịch làm việc trong thứ hiện tại
      return shift.shiftDetails.some(detail => {
        const dayOfWeek = getDayOfWeekNumber(detail.dayOfWeek);
        return dayOfWeek === currentDay;
      });
    });
  };

  // Lọc các ca làm việc phù hợp với thời gian hiện tại (để highlight)
  const getCurrentTimeShifts = () => {
    if (!workShifts || workShifts.length === 0) return [];
    
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Thời gian hiện tại tính bằng phút
    const currentDay = now.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
    
    return workShifts.filter(shift => {
      if (!shift.shiftDetails || shift.shiftDetails.length === 0) return false;
      
      // Kiểm tra xem có ca nào phù hợp với ngày hiện tại không
      return shift.shiftDetails.some(detail => {
        const dayOfWeek = getDayOfWeekNumber(detail.dayOfWeek);
        if (dayOfWeek !== currentDay) return false;
        
        // Kiểm tra thời gian check-in (trước giờ bắt đầu ca 30 phút đến sau giờ bắt đầu ca 30 phút)
        const startTime = parseTime(detail.startTime);
        const checkInStart = startTime - 30; // 30 phút trước ca
        const checkInEnd = startTime + 30; // 30 phút sau khi ca bắt đầu
        
        return currentTime >= checkInStart && currentTime <= checkInEnd;
      });
    });
  };

  // Chuyển đổi tên ngày thành số
  const getDayOfWeekNumber = (dayName) => {
    const days = {
      'Chủ nhật': 0, 
      'Thứ hai': 1, 'Thứ 2': 1,
      'Thứ ba': 2, 'Thứ 3': 2,
      'Thứ tư': 3, 'Thứ 4': 3,
      'Thứ năm': 4, 'Thứ 5': 4,
      'Thứ sáu': 5, 'Thứ 6': 5,
      'Thứ bảy': 6, 'Thứ 7': 6
    };
    const result = days[dayName] || -1;
    console.log('🔄 Converting day:', dayName, '->', result);
    return result;
  };

  // Parse thời gian từ string (HH:mm) thành phút
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const availableShifts = getTodayShifts();
  const currentTimeShifts = getCurrentTimeShifts();

  // Debug workShifts data
  useEffect(() => {
    if (workShifts && workShifts.length > 0) {
      console.log('📊 WorkShifts data loaded:', workShifts);
      console.log('📊 First shift example:', workShifts[0]);
    } else {
      console.log('❌ No workShifts data');
    }
  }, [workShifts]);

  useEffect(() => {
    const testServerConnection = async () => {
      console.log('🔍 Testing server connection...');
      
      // Bỏ qua test kết nối và đặt trạng thái connected
      // Mobile app sẽ test kết nối thực tế khi chấm công
      setConnectionStatus('connected');
      console.log('✅ Server connection assumed (will test on actual check-in)');
    };

    testServerConnection();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      setLocationLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc.coords);
        } else {
          Alert.alert('Lỗi', 'Quyền truy cập vị trí bị từ chối');
        }
      } catch (err) {
        console.error('Error fetching location:', err);
        Alert.alert('Lỗi', 'Không thể lấy vị trí');
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
        Alert.alert('Lỗi', 'Không thể tải danh sách máy chấm công');
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
        const distance = getDistance(
          location.latitude, 
          location.longitude, 
          parseFloat(machine.latitude), 
          parseFloat(machine.longitude)
        );
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

  const handlePictureTaken = async (photo) => {
    setIsCameraOpen(false);
    if (!photo || !photo.base64) {
      Alert.alert('Lỗi', 'Không thể lấy được ảnh đã xử lý.');
      return;
    }

    setCapturedImage(photo.uri);
    setUploadStatus(null);
    setIsUploading(true);

    try {
      console.log('Bắt đầu chấm công...');
      
      // ===== FACE RECOGNITION SECTION =====
      console.log('🔍 Starting face recognition...');
      
      try {
        // 1. Detect faces in the captured image
        const detectionResult = await detectFaces(photo.uri);
        
        if (!detectionResult || !detectionResult.hasFace || !detectionResult.faces || detectionResult.faces.length === 0) {
          setIsUploading(false);
          Alert.alert(
            'Không phát hiện khuôn mặt',
            'Vui lòng đưa khuôn mặt vào khung và chụp lại.',
            [
              {
                text: 'Chụp lại',
                onPress: () => setIsCameraOpen(true)
              },
              {
                text: 'Bỏ qua face recognition',
                style: 'cancel',
                onPress: () => {
                  console.log('⚠️ Skipping face recognition');
                  // Continue with normal check-in flow
                  handleCheckInWithoutFaceRecognition(photo);
                }
              }
            ]
          );
          return;
        }
        
        if (detectionResult.faces.length > 1) {
          setIsUploading(false);
          Alert.alert(
            'Phát hiện nhiều khuôn mặt',
            'Vui lòng chụp chỉ một người.',
            [
              {
                text: 'Chụp lại',
                onPress: () => setIsCameraOpen(true)
              },
              {
                text: 'Bỏ qua face recognition',
                style: 'cancel',
                onPress: () => {
                  console.log('⚠️ Skipping face recognition');
                  handleCheckInWithoutFaceRecognition(photo);
                }
              }
            ]
          );
          return;
        }
        
        // 2. Validate face quality
        const detectedFace = detectionResult.faces[0];
        const faceQualityValid = validateFaceQuality(detectedFace);
        
        if (!faceQualityValid) {
          setIsUploading(false);
          Alert.alert(
            'Chất lượng khuôn mặt không đạt',
            'Vui lòng giữ khoảng cách và ánh sáng phù hợp.',
            [
              {
                text: 'Chụp lại',
                onPress: () => setIsCameraOpen(true)
              },
              {
                text: 'Bỏ qua face recognition',
                style: 'cancel',
                onPress: () => {
                  console.log('⚠️ Skipping face recognition');
                  handleCheckInWithoutFaceRecognition(photo);
                }
              }
            ]
          );
          return;
        }
        
        // 3. Get registered face data
        const registeredFace = await getRegisteredFace(user?.id);
        
        if (registeredFace) {
          // 4. Compare faces
          console.log('🔐 Comparing with registered face...');
          const comparisonResult = await compareFaces(detectedFace, registeredFace);
          
          if (!comparisonResult.match || comparisonResult.confidence < 0.7) {
            setIsUploading(false);
            Alert.alert(
              'Khuôn mặt không khớp',
              `Khuôn mặt không khớp với tài khoản đã đăng ký.\nĐộ tin cậy: ${(comparisonResult.confidence * 100).toFixed(0)}%`,
              [
                {
                  text: 'Chụp lại',
                  onPress: () => setIsCameraOpen(true)
                },
                {
                  text: 'Bỏ qua face recognition',
                  style: 'cancel',
                  onPress: () => {
                    console.log('⚠️ Skipping face recognition');
                    handleCheckInWithoutFaceRecognition(photo);
                  }
                }
              ]
            );
            return;
          }
          
          console.log(`✅ Face recognition successful! Match: ${comparisonResult.match}, Confidence: ${comparisonResult.confidence}`);
        } else {
          console.log('⚠️ No registered face found. Skipping face comparison.');
          // Continue with check-in if no registered face exists
        }
        
      } catch (faceError) {
        console.error('❌ Face recognition error:', faceError);
        // Ask user if they want to skip face recognition
        setIsUploading(false);
        Alert.alert(
          'Lỗi nhận diện khuôn mặt',
          'Có lỗi xảy ra khi nhận diện khuôn mặt. Bạn có muốn tiếp tục chấm công không?',
          [
            {
              text: 'Chụp lại',
              onPress: () => setIsCameraOpen(true)
            },
            {
              text: 'Bỏ qua face recognition',
              style: 'cancel',
              onPress: () => {
                console.log('⚠️ Skipping face recognition due to error');
                handleCheckInWithoutFaceRecognition(photo);
              }
            }
          ]
        );
        return;
      }
      // ===== END FACE RECOGNITION SECTION =====
      
      // Kiểm tra kích thước ảnh trước khi gửi
      console.log(`📏 Check-in image size: ${photo.base64.length} characters (${Math.round(photo.base64.length/1024)}KB)`);
      
      // Sử dụng ảnh đã được nén từ camera với chất lượng thấp
      let finalBase64 = photo.base64;
      
      console.log(`📸 Final image size: ${finalBase64.length} characters (${Math.round(finalBase64.length/1024)}KB)`);
      
      // Log thông tin ảnh để debug
      if (finalBase64.length > 200000) { // 200KB warning
        console.log('⚠️ Image still large, but sending anyway for Simple Attendance API');
      } else {
        console.log('✅ Image size is acceptable for Simple Attendance API');
      }
      
      // Chuẩn bị dữ liệu chấm công theo đúng format API
      const currentDateTime = new Date().toISOString();
      const checkInData = mode === 'checkin' ? {
        employeeId: user?.id || 'unknown-user',
        imageBase64: finalBase64,
        checkInDateTime: currentDateTime,
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        location: activeMachineName || 'Unknown Location',
        attendanceMachineId: 2,
        notes: `Check-in from mobile app - Ca: ${selectedShift?.shiftName || 'Chưa chọn ca'}`
      } : {
        employeeId: user?.id || 'unknown-user',
        imageBase64: finalBase64,
        checkOutDateTime: currentDateTime,
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        location: activeMachineName || 'Unknown Location',
        notes: `Check-out from mobile app - Ca: ${selectedShift?.shiftName || 'Chưa chọn ca'}`
      };

      // Validation dữ liệu cho Simple Attendance API
      if (!checkInData.employeeId) {
        throw new Error('employeeId is required');
      }
      if (!checkInData.imageBase64) {
        throw new Error('imageBase64 is required');
      }
      if (checkInData.imageBase64.length < 100) {
        throw new Error('imageBase64 too small, please retake photo');
      }
      console.log('👤 Current user:', user);
      console.log('🆔 User ID:', user?.id);
      console.log('📧 User Email:', user?.email);
      console.log('👤 User Full Name:', user?.fullName);
      
      if (!user?.id) {
        throw new Error('Vui lòng đăng nhập để chấm công');
      }
      
      if (!selectedShift) {
        throw new Error('Vui lòng chọn ca làm việc trước khi chấm công');
      }
      
      // Cảnh báo nếu chọn ca không phù hợp với thời gian hiện tại
      const isCurrentTime = currentTimeShifts.some(s => s.id === selectedShift.id);
      if (!isCurrentTime) {
        console.log('⚠️ Warning: Selected shift is not current time shift');
      }

      console.log('📤 Sending check-in data:', {
        mode: mode,
        employeeId: checkInData.employeeId,
        imageSize: checkInData.imageBase64.length,
        latitude: checkInData.latitude,
        longitude: checkInData.longitude,
        location: checkInData.location,
        checkInDateTime: checkInData.checkInDateTime,
        checkOutDateTime: checkInData.checkOutDateTime,
        notes: checkInData.notes
      });
      
      console.log('📋 Full checkInData object:', JSON.stringify(checkInData, null, 2));

      // Gửi dữ liệu chấm công lên Simple Attendance API với fallback
      let response;
      let workingUrl = null;
      
      // Chọn API endpoint dựa trên mode
      const apiEndpoint = mode === 'checkin' ? 'checkin' : 'checkout';
      const urls = [
        `https://xaydungvipro.id.vn/api/Attendance/${apiEndpoint}`
      ];
      
      for (const url of urls) {
        try {
          console.log(`Trying check-in URL: ${url}`);
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkInData)
          });
          
          if (response.ok) {
            workingUrl = url;
            console.log(`✅ Check-in successful with URL: ${url}`);
            const result = await response.json();
            console.log('📥 Response data:', result);
            break;
          } else {
            console.log(`⚠️ Check-in response with URL: ${url}, status: ${response.status}`);
            const errorText = await response.text();
            console.log(`⚠️ Response text: ${errorText}`);
            
            // Kiểm tra nếu là lỗi business logic (400) nhưng có thể đã lưu dữ liệu
            if (response.status === 400) {
              try {
                const errorData = JSON.parse(errorText);
                if (errorData.message && errorData.message.includes('đã chấm công')) {
                  // Đây là trường hợp đã chấm công rồi, coi như thành công
                  workingUrl = url;
                  console.log(`✅ Check-in already done, treating as success`);
                  break;
                }
              } catch (parseError) {
                console.log('Could not parse error response as JSON');
              }
            }
          }
        } catch (error) {
          console.log(`❌ Check-in error with URL: ${url}, error: ${error.message}`);
        }
      }
      
      if (!workingUrl) {
        throw new Error('Không thể kết nối đến máy chấm công');
      }

      // Nếu có workingUrl thì đã thành công
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // Nếu không parse được JSON, tạo response giả
        result = { message: 'Check-in thành công' };
      }
      
      console.log('✅ Check-in thành công! Response:', result);
      console.log('🎯 Mode:', mode, '- Sẽ navigate về trang chủ...');
      
      // Kiểm tra nếu là trường hợp đã chấm công
      const isAlreadyCheckedIn = result.message && result.message.includes('đã chấm công');
      
      setUploadStatus('success');
      Alert.alert(
        isAlreadyCheckedIn ? 'Thông báo' : 'Thành công', 
        isAlreadyCheckedIn 
          ? `Bạn đã chấm công vào hôm nay!\nThời gian: ${new Date().toLocaleString('vi-VN')}`
          : `${mode === 'checkin' ? 'Check-in' : 'Check-out'} thành công!\nThời gian: ${new Date().toLocaleString('vi-VN')}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset captured image after successful check-in
              setTimeout(async () => {
                setCapturedImage(null);
                setUploadStatus(null);
                // Cập nhật trạng thái checkin trong AsyncStorage
                try {
                  const today = new Date().toDateString();
                  const newStatus = mode === 'checkin' ? true : false;
                  const checkinData = {
                    checkedIn: newStatus,
                    timestamp: new Date().toISOString(),
                    checkInTime: mode === 'checkin' ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
                    checkOutTime: mode === 'checkout' ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : null
                  };
                  await AsyncStorage.setItem(`checkin_${today}`, JSON.stringify(checkinData));
                  console.log('✅ Updated AsyncStorage checkin status:', checkinData);
                } catch (error) {
                  console.error('Error updating checkin status:', error);
                }
                
                // Quay lại trang chủ sau khi thành công
                console.log('🔄 Navigating back to home...');
                try {
                  // Sử dụng replace thay vì back để đảm bảo quay về trang chủ
                  router.replace('/(tabs)/');
                } catch (error) {
                  console.error('Navigation error:', error);
                  // Fallback: navigate to home tab
                  router.push('/(tabs)/');
                }
              }, 1000);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Check-in Error:', error);
      setUploadStatus('error');
      
      // Kiểm tra loại lỗi
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error') || error.message.includes('404') || error.message.includes('Không thể kết nối đến máy chấm công đơn giản')) {
        Alert.alert(
          'Lỗi kết nối',
          'Không thể kết nối đến máy chấm công đơn giản. Vui lòng kiểm tra:\n1. Kết nối mạng\n2. Server đang hoạt động\n3. Thử lại sau',
          [
            {
              text: 'Thử lại',
              onPress: () => {
                // Retry logic có thể thêm ở đây
              }
            },
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối đến hệ thống chấm công đơn giản.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const renderWorkshiftItem = ({ item }) => (
    <View style={styles.shiftItem}>
      <Text style={styles.shiftName}>{item.shiftName}</Text>
      {item.shiftDetails && item.shiftDetails.map(detail => (
        <Text key={detail.id} style={styles.shiftDetail}>
          {detail.dayOfWeek}: {detail.startTime} - {detail.endTime}
        </Text>
      ))}
    </View>
  );

    const isCheckInDisabled = !isWithinRadius || locationLoading || machinesLoading || !selectedShift;

  return (
    <LinearGradient
      colors={['#ecf0f1', '#f8f9fa', '#ffffff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title={mode === 'checkin' ? 'CHẤM CÔNG VÀO' : 'CHẤM CÔNG RA'} />

      <View style={styles.userRow}>
        <LinearGradient
          colors={['#fff', '#f8fafc']}
          style={styles.userRowGradient}
        >
          <View style={styles.avatar}>
            <LinearGradient
              colors={['#3498db', '#2980b9']}
              style={styles.avatarGradient}
            >
              <Icon name="account-circle" size={40} color="#ffffff" />
            </LinearGradient>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Nguyễn Trần Trí Tâm</Text>
            <Text style={styles.userRole}>Nhân viên</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.mapBox}>
        {locationLoading ? (
          <View style={[styles.mapImg, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Đang tải vị trí...</Text>
          </View>
        ) : location ? (
          <View style={styles.mapContainer}>
            <MapView 
              style={styles.mapImg} 
              initialRegion={{ 
                latitude: location.latitude, 
                longitude: location.longitude, 
                latitudeDelta: 0.002, 
                longitudeDelta: 0.002 
              }} 
              showsUserLocation 
              scrollEnabled={false} 
              zoomEnabled={false} 
              pitchEnabled={false} 
              rotateEnabled={false}
            >
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
            </MapView>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.1)']}
              style={styles.mapOverlay}
            />
          </View>
        ) : (
          <View style={[styles.mapImg, { alignItems: 'center', justifyContent: 'center' }]}>
            <Icon name="map-marker-off" size={48} color="#94a3b8" />
            <Text style={styles.errorText}>Không lấy được vị trí</Text>
          </View>
        )}
        <View style={styles.privacyContainer}>
          <Icon name="shield-check" size={16} color="#2563eb" />
          <Text style={styles.privacy}>Quyền riêng tư</Text>
        </View>
      </View>

      {/* Connection Status */}
      {connectionStatus === 'testing' && (
        <View style={styles.connectionStatusBox}>
          <ActivityIndicator size="small" color="#f59e0b" />
          <Text style={styles.connectionStatusText}>Đang kiểm tra kết nối server...</Text>
        </View>
      )}

      {connectionStatus === 'failed' && (
        <View style={styles.connectionErrorBox}>
          <Icon name="wifi-off" size={20} color="#ef4444" />
          <Text style={styles.connectionErrorText}>Không thể kết nối đến server</Text>
        </View>
      )}

      <View style={styles.locationStatusBox}>
        {locationLoading || machinesLoading ? (
          <View style={styles.statusLoadingContainer}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.statusLoadingText}>Đang kiểm tra vị trí...</Text>
          </View>
        ) : isWithinRadius ? (
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.statusSuccessContainer}
          >
            <Icon name="check-circle" size={20} color="#fff" />
            <Text style={styles.statusTextSuccess}>
              Bạn đang ở trong khu vực chấm công: {activeMachineName}
            </Text>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.statusErrorContainer}
          >
            <Icon name="alert-circle" size={20} color="#fff" />
            <Text style={styles.statusTextError}>
              Bạn không ở trong khu vực chấm công
            </Text>
          </LinearGradient>
        )}
      </View>

      {capturedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          {isUploading && <ActivityIndicator size="large" color="#008080" style={styles.uploadSpinner} />}
          {uploadStatus === 'success' && <Icon name="check-circle" size={40} color="#43a047" style={styles.statusIcon} />}
          {uploadStatus === 'error' && <Icon name="close-circle" size={40} color="#e53935" style={styles.statusIcon} />}
        </View>
      )}

      {/* Work Shift Selection */}
      <View style={styles.shiftSelectionBox}>
        <Text style={styles.shiftSelectionTitle}>Chọn ca làm việc</Text>
        <Text style={styles.shiftSelectionSubtitle}>
          Ca làm việc hôm nay ({date})
        </Text>
        
        {availableShifts.length > 0 ? (
          <ScrollView 
            style={styles.shiftScrollContainer}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {availableShifts.map((shift) => {
              const isCurrentTime = currentTimeShifts.some(s => s.id === shift.id);
              const isSelected = selectedShift?.id === shift.id;
              
              return (
                <TouchableOpacity
                  key={shift.id}
                  style={[
                    styles.shiftItem,
                    isSelected && styles.shiftItemSelected,
                    isCurrentTime && !isSelected && styles.shiftItemCurrentTime
                  ]}
                  onPress={() => setSelectedShift(shift)}
                >
                  <View style={styles.shiftInfo}>
                    <View style={styles.shiftHeader}>
                      <Text style={[
                        styles.shiftName,
                        isSelected && styles.shiftNameSelected,
                        isCurrentTime && !isSelected && styles.shiftNameCurrentTime
                      ]}>
                        {shift.shiftName}
                      </Text>
                      {isCurrentTime && (
                        <View style={styles.currentTimeBadge}>
                          <Text style={styles.currentTimeText}>Hiện tại</Text>
                        </View>
                      )}
                    </View>
                    {shift.shiftDetails && shift.shiftDetails
                      .filter(detail => {
                        const dayOfWeek = getDayOfWeekNumber(detail.dayOfWeek);
                        return dayOfWeek === now.getDay();
                      })
                      .map((detail, index) => (
                        <Text key={index} style={[
                          styles.shiftDetail,
                          isSelected && styles.shiftDetailSelected,
                          isCurrentTime && !isSelected && styles.shiftDetailCurrentTime
                        ]}>
                          {detail.startTime.substring(0, 5)} - {detail.endTime.substring(0, 5)}
                        </Text>
                      ))}
                  </View>
                  {isSelected && (
                    <Icon name="check-circle" size={24} color="#10b981" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noShiftContainer}>
            <Icon name="clock-outline" size={48} color="#94a3b8" />
            <Text style={styles.noShiftText}>
              Không có ca làm việc hôm nay
            </Text>
            <Text style={styles.noShiftSubText}>
              Bạn không có ca làm việc vào thứ này
            </Text>
            {/* Debug info */}
            {workShifts && workShifts.length > 0 && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugText}>
                  Debug: Có {workShifts.length} ca tổng cộng
                </Text>
                <Text style={styles.debugText}>
                  Thứ hiện tại: {now.getDay()} (0=CN, 1=T2...)
                </Text>
                {workShifts.map((shift, index) => (
                  <Text key={index} style={styles.debugText}>
                    {shift.shiftName}: {shift.shiftDetails?.map(d => d.dayOfWeek).join(', ')}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.timeBox}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.cameraBtn, isCheckInDisabled && styles.cameraBtnDisabled]} 
            disabled={isCheckInDisabled} 
            onPress={() => setIsCameraOpen(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isCheckInDisabled ? ['#94a3b8', '#64748b'] : ['#3498db', '#2980b9']}
              style={styles.cameraBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="camera" size={32} color="#fff" />
              <Text style={styles.cameraBtnText}>{mode === 'checkin' ? 'Chấm công vào' : 'Chấm công ra'}</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>

      <Modal animationType="slide" transparent={false} visible={isCameraOpen} onRequestClose={() => setIsCameraOpen(false)}>
        <InternalCameraCheckIn 
          onPictureTaken={handlePictureTaken} 
          onClose={() => setIsCameraOpen(false)} 
        />
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  userRow: { 
    marginHorizontal: 16, 
    marginTop: 20, 
    borderRadius: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userRowGradient: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 16,
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
  },
  userInfo: {
    flex: 1,
  },
  userName: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    color: '#2c3e50',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  mapBox: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    borderRadius: 16, 
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
  },
  mapContainer: {
    position: 'relative',
  },
  mapImg: { width: '100%', height: 140 },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  privacyContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  privacy: { 
    color: '#3498db', 
    fontSize: 12, 
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  errorText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  connectionStatusBox: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  connectionStatusText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  connectionErrorBox: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  connectionErrorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  locationStatusBox: { 
    marginHorizontal: 16, 
    borderRadius: 16, 
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },
  statusLoadingText: {
    marginLeft: 8,
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  statusSuccessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statusErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statusTextSuccess: { 
    flex: 1,
    textAlign: 'center', 
    fontSize: 14, 
    color: '#fff', 
    fontWeight: '600',
    marginLeft: 8,
  },
  statusTextError: { 
    flex: 1,
    textAlign: 'center', 
    fontSize: 14, 
    color: '#fff', 
    fontWeight: '600',
    marginLeft: 8,
  },
  timeBox: { 
    alignItems: 'center', 
    marginTop: 24, 
    flex: 1, 
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  time: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    color: '#2c3e50',
    letterSpacing: 2,
  },
  date: { 
    fontSize: 18, 
    color: '#3498db', 
    marginTop: 4,
    fontWeight: '600',
  },
  cameraBtn: { 
    flex: 1,
    borderRadius: 24,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cameraBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  cameraBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1,
  },
  cameraBtnDisabled: { 
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  previewContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    minHeight: 160,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadSpinner: {
    position: 'absolute',
  },
  statusIcon: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shiftItem: {
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  shiftItemSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  shiftInfo: {
    flex: 1,
  },
  shiftName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  shiftNameSelected: {
    color: '#10b981',
  },
  shiftDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  shiftDetailSelected: {
    color: '#059669',
  },
  shiftSelectionBox: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  shiftSelectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  shiftSelectionSubtitle: {
    fontSize: 12,
    color: '#3498db',
    marginBottom: 8,
    fontWeight: '500',
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  currentTimeBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  currentTimeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  shiftItemCurrentTime: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  shiftNameCurrentTime: {
    color: '#3498db',
  },
  shiftDetailCurrentTime: {
    color: '#2980b9',
  },
  shiftList: {
    marginTop: 8,
  },
  shiftScrollContainer: {
    maxHeight: 120, // Chiều cao tối đa cho 2 ca (mỗi ca ~50px + margin)
    marginTop: 8,
  },
  noShiftContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noShiftText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  noShiftSubText: {
    fontSize: 14,
    color: '#3498db',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  debugContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  debugText: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 4,
    fontWeight: '500',
  },
});