import { ScrollView, StyleSheet, Text, View } from 'react-native';

const fakeDetail = [
  { day: '3', date: '05/08', inout: '08:38 - 12:47', shift: 'n/a', work: '3.37/0.42', color: '#43a047', color2: '#e53935' },
  { day: '2', date: '04/08', inout: '08:23 - 17:43', shift: 'n/a', work: '8.00/1.00', color: '#43a047', color2: '#e53935' },
  { day: '6', date: '01/08', inout: '08:40 - 17:45', shift: 'n/a', work: '8.00/1.00', color: '#43a047', color2: '#e53935' },
];

export default function AttendanceDetail() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 1 }]}>Thứ</Text>
          <Text style={[styles.th, { flex: 2 }]}>Ngày</Text>
          <Text style={[styles.th, { flex: 3 }]}>In/Out</Text>
          <Text style={[styles.th, { flex: 1 }]}>Ca</Text>
          <Text style={[styles.th, { flex: 2 }]}>Giờ công</Text>
        </View>
        {fakeDetail.map((row, idx) => (
          <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
            <Text style={[styles.td, { flex: 1 }]}>{row.day}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{row.date}</Text>
            <Text style={[styles.td, { flex: 3 }]}><Text style={{ color: row.color }}>{row.inout.split(' - ')[0]}</Text> - <Text style={{ color: row.color2 }}>{row.inout.split(' - ')[1]}</Text></Text>
            <Text style={[styles.td, { flex: 1 }]}>{row.shift}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{row.work}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
