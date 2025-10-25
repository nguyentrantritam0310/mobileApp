# 🔧 Khắc phục sự cố - Face Recognition App

## 🚨 Lỗi thường gặp và cách khắc phục

### 1. Lỗi Metro Bundler - "InternalBytecode.js not found"

**Triệu chứng:**
```
Error: ENOENT: no such file or directory, open 'InternalBytecode.js'
```

**Cách khắc phục:**
```bash
# Cách 1: Clear cache và restart
cd mobileApp
npx expo start --clear

# Cách 2: Nếu vẫn lỗi, chạy script clear cache
clear-cache.bat

# Cách 3: Reset project hoàn toàn
npm run reset-project
```

### 2. Lỗi Network Error - Không kết nối được API

**Triệu chứng:**
```
ERROR Lỗi khi nhận dạng khuôn mặt: [AxiosError: Network Error]
```

**Cách khắc phục:**

#### Bước 1: Kiểm tra Backend Server
```bash
cd dotnet-api/dotnet-api
dotnet run
```
Đảm bảo server chạy trên port 5244

#### Bước 2: Kiểm tra API URL
Mở file `mobileApp/config/api.js` và kiểm tra URL:

```javascript
// Production URL (đang sử dụng)
BASE_URL: 'https://xaydungvipro.id.vn/api',

// Hoặc local development
BASE_URL: 'http://160.250.132.226:5244/api',
```

**Cách tìm IP của máy:**
```bash
# Windows
ipconfig

# Mac/Linux  
ifconfig
```

#### Bước 3: Kiểm tra Firewall
Đảm bảo port 5244 không bị chặn bởi firewall.

### 3. Lỗi Python Dependencies

**Triệu chứng:**
```
ModuleNotFoundError: No module named 'ultralytics'
```

**Cách khắc phục:**
```bash
cd dotnet-api/dotnet-api/MachineLearning
python setup.py
```

### 4. Lỗi Camera Permissions

**Triệu chứng:**
```
Camera permission denied
```

**Cách khắc phục:**
- Android: Vào Settings > Apps > MobileApp > Permissions > Camera
- iOS: Vào Settings > Privacy > Camera > MobileApp

### 5. Lỗi Face Detection

**Triệu chứng:**
```
Không phát hiện được khuôn mặt trong ảnh
```

**Cách khắc phục:**
- Đảm bảo khuôn mặt rõ ràng, đủ ánh sáng
- Không đeo kính râm hoặc che khuôn mặt
- Giữ khoảng cách phù hợp với camera
- Chụp ảnh chính diện

## 🛠️ Debug Steps

### 1. Kiểm tra API Connection
```bash
# Test API endpoint production
curl https://xaydungvipro.id.vn/api/FaceRecognition/registered-employees

# Test API endpoint local (nếu cần)
curl http://160.250.132.226:5244/api/FaceRecognition/registered-employees
```

### 2. Kiểm tra Python Script
```bash
cd dotnet-api/dotnet-api/MachineLearning
python face_recognition.py --help
```

### 3. Kiểm tra Logs
```bash
# Backend logs
dotnet run --verbosity detailed

# Mobile app logs
npx expo start --verbose
```

## 📱 Cấu hình Network

### Cho Emulator:
```javascript
BASE_URL: 'http://10.0.2.2:5244/api'  // Android emulator
BASE_URL: 'http://localhost:5244/api'  // iOS simulator
```

### Cho Physical Device:
```javascript
BASE_URL: 'http://160.250.132.226:5244/api'  // IP hiện tại của server
```

### Cho Same Network:
```javascript
BASE_URL: 'http://[MACHINE_IP]:5244/api'
```

## 🔍 Common Issues

### Issue 1: App crashes on camera open
**Solution:** Check camera permissions và restart app

### Issue 2: Slow face recognition
**Solution:** 
- Đảm bảo có GPU
- Giảm kích thước ảnh
- Tối ưu Python dependencies

### Issue 3: Low recognition accuracy
**Solution:**
- Cải thiện chất lượng ảnh đăng ký
- Điều chỉnh threshold trong config
- Đăng ký nhiều góc độ khuôn mặt

## 📞 Support

Nếu vẫn gặp vấn đề, hãy:
1. Kiểm tra logs chi tiết
2. Thử trên emulator trước
3. Test API endpoints riêng biệt
4. Kiểm tra network connectivity

---

**Lưu ý:** Đảm bảo máy tính và điện thoại cùng mạng WiFi để kết nối được.
