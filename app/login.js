import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Validate form
  useEffect(() => {
    const isValid = email.trim().length > 0 && password.trim().length > 0;
    setIsFormValid(isValid);
  }, [email, password]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const result = await login(email.trim(), password);
    
    if (result.success) {
      if (result.requiresPasswordChange) {
        Alert.alert(
          'Thông báo',
          'Bạn cần đổi mật khẩu trước khi sử dụng hệ thống',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to change password screen
                router.push('/change-password');
              }
            }
          ]
        );
      } else {
        // Navigate to main app
        router.replace('/(tabs)');
      }
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Quên mật khẩu',
      'Tính năng này sẽ được phát triển trong phiên bản tiếp theo',
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient
      colors={['#2c3e50', '#3498db']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View style={styles.loginCard}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Icon name="hard-hat" size={60} color="#fff" />
              </View>
              <Text style={styles.title}>Đăng Nhập</Text>
              <Text style={styles.subtitle}>Hệ thống quản lý thi công xây dựng</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  <Icon name="email" size={20} color="#666" /> Email
                </Text>
                <TextInput
                  ref={emailInputRef}
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Nhập email của bạn"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  <Icon name="lock" size={20} color="#666" /> Mật khẩu
                </Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    ref={passwordInputRef}
                    style={[
                      styles.passwordInput,
                      passwordFocused && styles.inputFocused
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    onFocus={() => {
                      console.log('Password input focused');
                      setPasswordFocused(true);
                    }}
                    onBlur={() => {
                      console.log('Password input blurred');
                      setPasswordFocused(false);
                    }}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => {
                      console.log('Eye button pressed');
                      setShowPassword(!showPassword);
                    }}
                    disabled={isLoading}
                    activeOpacity={0.7}
                  >
                    <Icon 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={20} color="#dc3545" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!isFormValid || isLoading) && styles.loginButtonDisabled
                ]}
                onPress={handleLogin}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Icon name="login" size={24} color="#fff" />
                )}
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 Hệ thống quản lý thi công xây dựng
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%',
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // Giống web app
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#3498db', // Màu chủ đạo như web
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Thêm gradient effect (React Native không hỗ trợ CSS gradient trực tiếp)
    shadowColor: '#2c3e50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50', // Màu tiêu đề như web
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d', // Màu phụ như web
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057', // Màu label như web
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6', // Màu border như web
    borderRadius: 8, // Border radius như web
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff', // Nền trắng như web
  },
  inputFocused: {
    borderColor: '#3498db', // Màu border khi focus
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50, // Tạo không gian cho eye button
    fontSize: 16,
    minHeight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.1)', // Màu nền error như web
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc3545', // Màu text error như web
    marginLeft: 8,
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#3498db', // Màu button như web
    borderRadius: 8, // Border radius như web
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // Thêm shadow effect
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#3498db', // Màu link như web
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    color: '#6c757d', // Màu footer text như web
    fontSize: 12,
  },
});

export default LoginScreen;
