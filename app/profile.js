import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../components/CustomHeader';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <CustomHeader title="Hồ sơ cá nhân" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarWrap}>
          <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
          <Text style={styles.name}>Nguyễn Trần Trí Tâm</Text>
          <Text style={styles.position}>Nhân viên hành chính</Text>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Icon name="card-account-details" size={20} color="#008080" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Mã nhân viên:</Text>
            <Text style={styles.infoValue}>123456</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#008080" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>tam.nguyen@company.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#008080" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>SĐT:</Text>
            <Text style={styles.infoValue}>0901 234 567</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#008080" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Ngày vào làm:</Text>
            <Text style={styles.infoValue}>29/05/2025</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="office-building" size={20} color="#008080" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Phòng ban:</Text>
            <Text style={styles.infoValue}>Hành chính</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#008080" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Địa chỉ:</Text>
            <Text style={styles.infoValue}>123 Đường ABC, Quận 1, TP.HCM</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#008080',
    marginBottom: 2,
  },
  position: {
    color: '#888',
    fontSize: 15,
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    shadowColor: '#008080',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontWeight: '500',
    color: '#555',
    minWidth: 90,
    fontSize: 15,
  },
  infoValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
});
