# Hướng dẫn Setup Face Recognition với Custom Dev Client

## 🎯 Mục tiêu
Tích hợp Face Recognition vào app chấm công mà KHÔNG cần eject khỏi Expo, sử dụng Custom Dev Client.

## 📦 Cài đặt các package cần thiết

```bash
cd mobileApp

# Cài đặt EAS CLI
npm install -g eas-cli

# Login vào Expo
eas login

# Cài đặt các dependencies cho face recognition
npx expo install expo-dev-client
npm install react-native-vision-camera
npm install vision-camera-face-detector@1.9.1
npm install @react-native-ml-kit/face-detection
```

## 🏗️ Build Custom Dev Client

### Cho Android:
```bash
# Build development client cho Android
eas build --profile development --platform android

# Hoặc build local (nhanh hơn)
npx expo run:android
```

### Cho iOS:
```bash
# Build development client cho iOS  
eas build --profile development --platform ios

# Hoặc build local
npx expo run:ios
```

## 📝 Cập nhật code

### 1. Tạo Face Detection Service
File: `services/faceDetectionService.js`

```javascript
import FaceDetector from '@react-native-ml-kit/face-detection';
import * as FileSystem from 'expo-file-system';
import { VisionCameraProxy, Frame } from 'react-native-vision-camera';

const visionCameraProxy = VisionCameraProxy.initFrameProcessorPlugin('scanFaces');

export async function detectFaces(photoUri) {
  try {
    const options = {
      enableLandmarks: true,
      enableClassification: true,
      enableTracking: false,
    };
    
    const faceDetector = FaceDetector(options);
    const result = await faceDetector.process(photoUri);
    
    return result;
  } catch (error) {
    console.error('Face detection error:', error);
    throw error;
  }
}

export async function compareFaces(registeredFacePath, detectedFace) {
  // Đây là logic đơn giản, có thể nâng cấp sau
  // So sánh các đặc trưng khuôn mặt
  
  if (!detectedFace || detectedFace.length === 0) {
    return { match: false, confidence: 0 };
  }
  
  // TODO: Implement actual face comparison using ML Kit or custom model
  // For now, return success if face is detected
  return {
    match: true,
    confidence: 0.85
  };
}
```

### 2. Cập nhật checkin.js

Thêm face detection vào flow chấm công:

```javascript
import { detectFaces, compareFaces } from '../services/faceDetectionService';

// Trong handlePictureTaken:
const handlePictureTaken = async (photo) => {
  setIsCameraOpen(false);
  
  if (!photo || !photo.uri) {
    Alert.alert('Lỗi', 'Không thể lấy được ảnh.');
    return;
  }

  try {
    // 1. Detect faces trong ảnh
    console.log('🔍 Detecting faces...');
    const faces = await detectFaces(photo.uri);
    
    if (!faces || faces.length === 0) {
      Alert.alert(
        'Không phát hiện khuôn mặt',
        'Vui lòng đưa khuôn mặt vào khung và chụp lại.',
        [{ text: 'OK', onPress: () => setIsCameraOpen(true) }]
      );
      return;
    }
    
    if (faces.length > 1) {
      Alert.alert(
        'Phát hiện nhiều khuôn mặt',
        'Vui lòng chụp chỉ một người.',
        [{ text: 'OK', onPress: () => setIsCameraOpen(true) }]
      );
      return;
    }
    
    // 2. So sánh với khuôn mặt đã đăng ký
    console.log('🔐 Comparing faces...');
    const comparisonResult = await compareFaces(
      user.facePhotoPath, // Cần lưu path ảnh đăng ký
      faces[0]
    );
    
    if (!comparisonResult.match || comparisonResult.confidence < 0.7) {
      Alert.alert(
        'Khuôn mặt không khớp',
        'Khuôn mặt không khớp với tài khoản đã đăng ký.',
        [{ text: 'OK', onPress: () => setIsCameraOpen(true) }]
      );
      return;
    }
    
    console.log(`✅ Face match! Confidence: ${comparisonResult.confidence}`);
    
    // 3. Tiếp tục process check-in như bình thường
    setCapturedImage(photo.uri);
    // ... rest of check-in logic
    
  } catch (error) {
    console.error('Face detection error:', error);
    Alert.alert('Lỗi', 'Không thể xác thực khuôn mặt.');
  }
};
```

## 🚀 Chạy app

### Development mode với Custom Dev Client:
```bash
# Start development server
npm start -- --dev-client

# Hoặc nếu đã build xong
eas build:run -p android
eas build:run -p ios
```

### Development mode local:
```bash
npx expo run:android --device
npx expo run:ios --device
```

## 🔍 Testing

1. **Test face detection**: Chụp ảnh có khuôn mặt và không có khuôn mặt
2. **Test face matching**: So sánh với ảnh đã đăng ký
3. **Test check-in flow**: Hoàn chỉnh flow chấm công với face recognition

## ⚠️ Lưu ý quan trọng

1. **Custom Dev Client** khác với Expo Go:
   - Không thể scan QR code
   - Phải build app trước khi chạy
   - Có thể sử dụng native modules

2. **Performance**:
   - Face detection khá nặng
   - Nên optimize ảnh trước khi detect
   - Có thể cache kết quả

3. **Bảo mật**:
   - Không lưu trữ ảnh khuôn mặt dạng raw
   - Nên hash/encode face features
   - Encrypt data trước khi gửi server

## 📚 Tài liệu tham khảo

- [Expo Custom Dev Client](https://docs.expo.dev/development/introduction/)
- [React Native Vision Camera](https://github.com/mrousavy/react-native-vision-camera)
- [ML Kit Face Detection](https://developers.google.com/ml-kit/vision/face-detection)
- [EAS Build](https://docs.expo.dev/build/introduction/)

## 🎯 Roadmap nâng cấp

1. **Advanced Face Recognition**:
   - Sử dụng TensorFlow Lite
   - Custom ML model cho face recognition
   - Face embedding comparison

2. **Liveness Detection**:
   - Phát hiện khuôn mặt giả (spoofing)
   - Yêu cầu người dùng cử động
   - Detect 3D vs 2D

3. **Offline Support**:
   - Chạy face detection offline
   - Cache ML models
   - Sync khi online
