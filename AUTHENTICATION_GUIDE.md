# Hướng dẫn Authentication cho Mobile App

## Tổng quan
Mobile app đã được tích hợp hệ thống xác thực hoàn chỉnh tương tự như web app Vue.js, bao gồm:
- Đăng nhập/đăng xuất
- Quản lý token và refresh token
- Bảo vệ routes
- Đổi mật khẩu
- Quản lý state với Context API

## Cấu trúc Files

### 1. AuthService (`services/authService.js`)
- Xử lý tất cả API calls liên quan đến authentication
- Quản lý token storage với AsyncStorage
- Tự động refresh token khi hết hạn
- Decode JWT token để lấy thông tin user

### 2. AuthContext (`contexts/AuthContext.js`)
- Quản lý global state cho authentication
- Cung cấp các functions: login, logout, register, changePassword
- Role-based access control helpers
- Loading states và error handling

### 3. Login Screen (`app/login.js`)
- UI đăng nhập với validation
- Tích hợp với AuthContext
- Xử lý forgot password
- Responsive design

### 4. Change Password Screen (`app/change-password.js`)
- UI đổi mật khẩu
- Validation mật khẩu mới
- Yêu cầu mật khẩu hiện tại

### 5. Main App (`App.js`)
- Navigation setup với authentication guard
- Conditional rendering dựa trên auth state
- Loading screen khi check auth state

## Cách sử dụng

### 1. Đăng nhập
```javascript
import { useAuth } from '../contexts/AuthContext';

const { login, isLoading, error } = useAuth();

const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    // Navigate to main app
  }
};
```

### 2. Kiểm tra authentication state
```javascript
import { useAuth } from '../contexts/AuthContext';

const { isAuthenticated, user, isLoading } = useAuth();

if (isLoading) {
  return <LoadingScreen />;
}

if (!isAuthenticated) {
  return <LoginScreen />;
}

return <MainApp />;
```

### 3. Role-based access control
```javascript
import { useAuth } from '../contexts/AuthContext';

const { isDirector, isHRManager, canViewAll, canEdit } = useAuth();

// Sử dụng trong component
if (isDirector()) {
  // Show director-only content
}

if (canViewAll()) {
  // Show content for users who can view all
}
```

### 4. Đăng xuất
```javascript
import { useAuth } from '../contexts/AuthContext';

const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User will be redirected to login screen
};
```

## API Endpoints

Mobile app sử dụng các API endpoints sau:

### Authentication
- `POST /api/Auth/login` - Đăng nhập
- `POST /api/Auth/register` - Đăng ký
- `POST /api/Auth/refresh-token` - Refresh token
- `POST /api/Auth/change-password` - Đổi mật khẩu
- `POST /api/Auth/forgot-password` - Quên mật khẩu

### Request/Response Format

#### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "message": "Đăng nhập thành công",
  "requiresPasswordChange": false
}
```

## Security Features

### 1. Token Management
- JWT tokens được lưu trong AsyncStorage
- Tự động refresh token khi hết hạn
- Xóa tokens khi logout

### 2. Password Security
- Validation mật khẩu mới
- Yêu cầu mật khẩu hiện tại khi đổi
- Minimum 6 characters

### 3. Error Handling
- Comprehensive error messages
- Network error handling
- Token expiration handling

## Configuration

### API Base URL
Cập nhật trong `config/api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.88.218:5244/api', // Your API URL
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};
```

### Environment Variables
Có thể sử dụng environment variables cho different environments:
- Development: `http://localhost:5244/api`
- Production: `https://your-api-domain.com/api`

## Troubleshooting

### 1. Network Error
- Kiểm tra API URL trong config
- Đảm bảo server đang chạy
- Kiểm tra firewall settings

### 2. Token Issues
- Clear app data và thử lại
- Kiểm tra token format
- Verify server token validation

### 3. Navigation Issues
- Đảm bảo đã wrap app với AuthProvider
- Kiểm tra navigation setup
- Verify screen names

## Testing

### 1. Test Login Flow
1. Mở app
2. Nhập email/password
3. Kiểm tra navigation đến main app
4. Verify user info hiển thị đúng

### 2. Test Logout Flow
1. Từ main app, tap logout button
2. Confirm logout
3. Verify redirect đến login screen
4. Check tokens được xóa

### 3. Test Token Refresh
1. Đăng nhập
2. Đợi token gần hết hạn
3. Thực hiện API call
4. Verify token được refresh tự động

## Future Enhancements

1. **Biometric Authentication**
   - Touch ID / Face ID
   - Fingerprint authentication

2. **Remember Me**
   - Persistent login
   - Auto-login on app start

3. **Two-Factor Authentication**
   - SMS verification
   - Email verification

4. **Social Login**
   - Google Sign-In
   - Facebook Login

5. **Offline Support**
   - Cache user data
   - Offline authentication state


