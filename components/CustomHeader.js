import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CustomHeader({ title }) {
  const router = useRouter();
  return (
    <View style={styles.headerWrap}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Icon name="arrow-left" size={26} color="#008080" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 36 : 18,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fafdff',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#008080',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
    flex: 1,
  },
});
