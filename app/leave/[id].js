import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Fake data for demo
const fakeLeaves = {
  '1': { id: '1', type: 'Nghỉ phép năm', from: '2025-08-10', to: '2025-08-12', status: 'Tạo mới' },
  '2': { id: '2', type: 'Nghỉ ốm', from: '2025-07-20', to: '2025-07-21', status: 'Đã duyệt' },
};

export default function LeaveDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const leave = fakeLeaves[id] || {};
  const canEdit = leave.status === 'Tạo mới';
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="arrow-left" size={28} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn nghỉ phép</Text>
        {canEdit ? (
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/leave/edit/${id}`)}>
            <Icon name="pencil" size={26} color="#008080" />
          </TouchableOpacity>
        ) : <View style={{ width: 26 }} />}
      </View>
      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Loại nghỉ phép</Text>
        <Text style={styles.value}>{leave.type}</Text>
        <Text style={styles.label}>Từ ngày</Text>
        <Text style={styles.value}>{leave.from}</Text>
        <Text style={styles.label}>Đến ngày</Text>
        <Text style={styles.value}>{leave.to}</Text>
        <Text style={styles.label}>Trạng thái</Text>
        <Text style={[styles.value, { color: leave.status === 'Đã duyệt' ? '#43a047' : '#fb8c00' }]}>{leave.status}</Text>
      </View>
      {/* Actions */}
      {canEdit && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="delete" size={22} color="#e53935" />
            <Text style={styles.actionText}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#008080' }]}> 
            <Text style={[styles.actionText, { color: '#fff' }]}>Gửi duyệt</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e0e0e0' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#008080' },
  editBtn: { padding: 4 },
  infoBox: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, elevation: 1 },
  label: { fontWeight: 'bold', color: '#1976d2', marginTop: 8 },
  value: { color: '#222', fontSize: 16, marginTop: 2 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', margin: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginRight: 8, elevation: 1 },
  actionText: { marginLeft: 6, color: '#e53935', fontWeight: 'bold' },
});
