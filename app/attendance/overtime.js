import { StyleSheet, Text, View } from 'react-native';

export default function AttendanceOvertime() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tăng ca (UI mẫu)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 8,
  },
  text: {
    color: '#bdbdbd',
    fontSize: 16,
    fontStyle: 'italic',
  },
});
