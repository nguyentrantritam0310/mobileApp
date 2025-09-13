import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const fakeData = [
  { day: '5', date: '07/08', time: '08:40', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
  { day: '4', date: '06/08', time: '08:40', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
  { day: '3', date: '05/08', time: '12:47', shift: 'n/a', type: 'ĐiLam', color: '#e53935' },
  { day: '3', date: '05/08', time: '08:38', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
  { day: '2', date: '04/08', time: '17:43', shift: 'n/a', type: 'ĐiLam', color: '#e53935' },
  { day: '2', date: '04/08', time: '08:23', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
  { day: '6', date: '01/08', time: '17:45', shift: 'n/a', type: 'ĐiLam', color: '#e53935' },
  { day: '6', date: '01/08', time: '08:40', shift: 'n/a', type: 'ĐiLam', color: '#43a047' },
];

export default function AttendanceData() {
  const router = useRouter();
    return (
      <View style={{ flex: 1, backgroundColor: '#f6f8fa' }}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Icon name="arrow-left" size={28} color="#008080" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>BẢNG CÔNG</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 1 }]}>THỨ</Text>
              <Text style={[styles.th, { flex: 2 }]}>NGÀY</Text>
              <Text style={[styles.th, { flex: 2 }]}>GIỜ VÀO/RA</Text>
              <Text style={[styles.th, { flex: 1 }]}>CA</Text>
              <Text style={[styles.th, { flex: 2 }]}>LOẠI</Text>
            </View>
            {fakeData.map((row, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.td, { flex: 1 }]}>{row.day}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{row.date}</Text>
                <Text style={[styles.td, { flex: 2, color: row.color }]}>{row.time}</Text>
                <Text style={[styles.td, { flex: 1 }]}>{row.shift}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{row.type}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderColor: '#e0e0e0',
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#008080', fontWeight: 'bold', fontSize: 20, textAlign: 'center', flex: 1 },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0f2f1',
    borderBottomWidth: 1,
    borderColor: '#b2dfdb',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  th: {
    color: '#008080',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
    backgroundColor: '#fff',
  },
  tableRowAlt: {
    backgroundColor: '#f6f8fa',
  },
  td: {
    color: '#222',
    fontSize: 14,
    textAlign: 'center',
  },
});
