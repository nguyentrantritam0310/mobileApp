import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const fakeLeaves = [
  { id: '1', type: 'Nghỉ phép năm', from: '2025-08-10', to: '2025-08-12', status: 'Đã duyệt' },
  { id: '2', type: 'Nghỉ ốm', from: '2025-07-20', to: '2025-07-21', status: 'Chờ duyệt' },
];

export default function LeaveListScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn nghỉ phép</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/leave/add')}> 
          <Icon name="plus-circle" size={32} color="#008080" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={fakeLeaves}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/leave/${item.id}`)} style={styles.card}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.date}>Từ: {item.from}  Đến: {item.to}</Text>
            <Text style={[styles.status, { color: item.status === 'Đã duyệt' ? '#43a047' : '#fb8c00' }]}>{item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Chưa có đơn nghỉ phép nào</Text>}
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
