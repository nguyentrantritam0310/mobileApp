// API Configuration
// Production server configuration - gán cứng URL

// Server endpoints:
// Production: https://xaydungvipro.id.vn
// Alternative: http://160.250.132.226
// Local development: http://192.168.x.x:5000

export const API_CONFIG = {
  // Production server URL - gán cứng
  BASE_URL: 'https://xaydungvipro.id.vn',
  TIMEOUT: 10000, // 10 seconds timeout
  FALLBACK_URLS: [
    'https://xaydungvipro.id.vn',  // Production server (primary)
    'http://160.250.132.226',      // Alternative server
    'http://192.168.0.100:5244',   // Local development (corrected port)
    'http://10.0.2.2:5244',        // Android emulator (corrected port)
    'http://localhost:5244',        // Localhost fallback (corrected port)
  ],
  
  // Các endpoint
  ENDPOINTS: {
    AUTH: '/api/auth',
    FACE_RECOGNITION: '/api/facerecognition',
    ATTENDANCE: '/api/attendance',
    EMPLOYEE: '/api/employee'
  }
};

// Helper function để lấy full URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Test kết nối đến server với timeout
export const testConnection = async () => {
  // Ưu tiên test localhost trước
  const priorityUrls = [
    'http://localhost:5244',
    'http://10.0.2.2:5244',
    'http://192.168.0.100:5244',
    API_CONFIG.BASE_URL,
    ...API_CONFIG.FALLBACK_URLS.filter(url => !url.includes('localhost') && !url.includes('10.0.2.2') && !url.includes('192.168.0.100'))
  ];
  
  for (const baseUrl of priorityUrls) {
    try {
      const testUrl = `${baseUrl}/api/attendance/today/test`;
      console.log(`Testing connection to: ${testUrl}`);
      
      // Tạo AbortController để timeout sau 5 giây
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Response status: ${response.status}`);
      
      // Kiểm tra content type
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          console.log(`✅ Connection successful to: ${baseUrl}`);
          return baseUrl;
        } else {
          console.log(`⚠️ Server responded but not JSON: ${baseUrl}`);
        }
      } else {
        console.log(`❌ Server error response: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`⏰ Connection timeout to: ${baseUrl}`);
      } else {
        console.log(`❌ Connection failed to: ${baseUrl}`, error.message);
      }
    }
  }
  
  console.log('❌ All connection attempts failed');
  return null;
};

// Test endpoint cụ thể
export const testEndpoint = async (endpoint) => {
  const testUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log(`🔍 Testing endpoint: ${testUrl}`);
  
  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`✅ JSON Response:`, data);
      return true;
    } else {
      const text = await response.text();
      console.log(`⚠️ Non-JSON Response:`, text.substring(0, 500));
      return false;
    }
  } catch (error) {
    console.log(`❌ Error:`, error.message);
    return false;
  }
};

// Common API URLs
export const API_URLS = {
  // New Simple Attendance API (no face recognition)
  ATTENDANCE_BASE: getApiUrl(API_CONFIG.ENDPOINTS.ATTENDANCE),
  CHECK_IN: getApiUrl(`${API_CONFIG.ENDPOINTS.ATTENDANCE}/checkin`),
  CHECK_OUT: getApiUrl(`${API_CONFIG.ENDPOINTS.ATTENDANCE}/checkout`),
  TODAY_ATTENDANCE: getApiUrl(`${API_CONFIG.ENDPOINTS.ATTENDANCE}/today`),
  ATTENDANCE_HISTORY: getApiUrl(`${API_CONFIG.ENDPOINTS.ATTENDANCE}/history`),
  
  // Legacy Face Recognition API (kept for compatibility)
  FACE_RECOGNITION_BASE: getApiUrl(API_CONFIG.ENDPOINTS.FACE_RECOGNITION),
  DETECT_FACE: getApiUrl(`${API_CONFIG.ENDPOINTS.FACE_RECOGNITION}/detect-face`),
  REGISTER_FACE: getApiUrl(`${API_CONFIG.ENDPOINTS.FACE_RECOGNITION}/register-face`),
  RECOGNIZE_FACE: getApiUrl(`${API_CONFIG.ENDPOINTS.FACE_RECOGNITION}/recognize-base64`),
  CHECK_IN_LEGACY: getApiUrl(`${API_CONFIG.ENDPOINTS.FACE_RECOGNITION}/checkin`),
  CHECK_IN_ALT: getApiUrl(`${API_CONFIG.ENDPOINTS.FACE_RECOGNITION}/check-in`),
};