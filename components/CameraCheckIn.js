import { Camera, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CameraCheckIn = ({ onPictureTaken, onClose }) => {
  const [type, setType] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Cần quyền truy cập camera</Text>
        <Button onPress={requestPermission} title="Cấp quyền" />
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      
      setCapturedImage(photo.uri);
      if (onPictureTaken) {
        onPictureTaken(photo);
      }
    } catch (error) {
      console.error('Lỗi khi chụp ảnh:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={type}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Icon name="close" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
          <View style={styles.captureInnerCircle}>
            <Icon name="camera" size={30} color="#000" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.flipBtn} onPress={toggleCameraType}>
          <Icon name="camera-flip" size={28} color="#fff" />
        </TouchableOpacity>

        {isCapturing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Đang chụp ảnh...</Text>
          </View>
        )}
      </Camera>

      {capturedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <Text style={styles.previewText}>Ảnh đã chụp</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  camera: { 
    flex: 1 
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
    position: 'absolute', 
    top: 50, 
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8
  },
  captureBtn: { 
    position: 'absolute', 
    bottom: 40, 
    alignSelf: 'center' 
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
    position: 'absolute', 
    bottom: 50, 
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8
  },
  loadingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
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
});

export default CameraCheckIn;