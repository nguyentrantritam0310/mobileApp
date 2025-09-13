import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AddOvertimeScreen() {
  const router = useRouter();
  const [reason, setReason] = useState('Dự án A');
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="arrow-left" size={28} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo đơn tăng ca</Text>
        <View style={{ width: 28 }} />
      </View>
      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Lý do tăng ca</Text>
        <TextInput style={styles.input} value={reason} onChangeText={setReason} />
        <Text style={styles.label}>Từ</Text>
        <TouchableOpacity onPress={() => setShowFrom(true)} style={styles.input}><Text>{from.toLocaleString()}</Text></TouchableOpacity>
        {showFrom && (
          <DateTimePicker
            value={from}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => { setShowFrom(false); if (date) setFrom(date); }}
          />
        )}
        <Text style={styles.label}>Đến</Text>
        <TouchableOpacity onPress={() => setShowTo(true)} style={styles.input}><Text>{to.toLocaleString()}</Text></TouchableOpacity>
        {showTo && (
          <DateTimePicker
            value={to}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => { setShowTo(false); if (date) setTo(date); }}
          />
        )}
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>Gửi đơn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e0e0e0' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#008080' },
  form: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, elevation: 1 },
  label: { fontWeight: 'bold', color: '#1976d2', marginTop: 8 },
  input: { backgroundColor: '#f6f8fa', borderRadius: 8, padding: 10, marginTop: 4 },
  submitBtn: { backgroundColor: '#008080', borderRadius: 10, marginTop: 18, alignItems: 'center', padding: 14 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
