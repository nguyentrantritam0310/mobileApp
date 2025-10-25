import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeHeader = ({ 
  userName,
  onLogoutPress,
  avatarSource
}) => {
  return (
    <LinearGradient
      colors={['#2c3e50', '#3498db']}
      style={styles.headerWrap}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <BlurView intensity={15} style={styles.headerBlur}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
            <LinearGradient
              colors={['#e74c3c', '#c0392b']}
              style={styles.logoutButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="logout" size={20} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#3498db', '#2980b9']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={avatarSource} style={styles.logo} />
            </LinearGradient>
          </View>
        </View>
        
        <View style={styles.userInfoSection}>
          <Text style={styles.hello}>Xin chào</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </BlurView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    width: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 50,
    paddingBottom: 32,
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerBlur: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
    paddingTop: 8,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    padding: 2,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  hello: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  userName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
});

export default HomeHeader;
