import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const fakeOvertimes = [
  { id: '1', reason: 'Dự án A', from: '2025-08-10 18:00', to: '2025-08-10 21:00', status: 'Đã duyệt' },
  { id: '2', reason: 'Hỗ trợ khách hàng', from: '2025-07-22 19:00', to: '2025-07-22 21:30', status: 'Chờ duyệt' },
];

export default function OvertimeListScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn tăng ca</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/overtime/add')}> 
          <Icon name="plus-circle" size={32} color="#008080" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={fakeOvertimes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/overtime/${item.id}`)} style={styles.card}>
            <Text style={styles.type}>Lý do: {item.reason}</Text>
            <Text style={styles.date}>Từ: {item.from}  Đến: {item.to}</Text>
            <Text style={[styles.status, { color: item.status === 'Đã duyệt' ? '#43a047' : '#fb8c00' }]}>{item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Chưa có đơn tăng ca nào</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa', padding: 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e0e0e0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#008080' },
  addBtn: { padding: 4 },
  card: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 16, elevation: 1 },
  type: { fontWeight: 'bold', fontSize: 16, color: '#1976d2', marginBottom: 4 },
  date: { color: '#555', marginBottom: 4 },
  status: { fontWeight: 'bold', fontSize: 14 },
});
