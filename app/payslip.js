import { ScrollView, StyleSheet, Text, View } from 'react-native';

const payslipData = {
  employee: 'Nguyễn Trần Trí Tâm',
  code: '123456',
  position: 'Nhân viên hành chính',
  month: '07/2025',
  baseSalary: 12000000,
  workingDays: 22,
  actualDays: 21,
  overtime: 8,
  allowance: 1500000,
  bonus: 1000000,
  bhxh: 1680000, // 14% (8% NV + 6% DN)
  bhyt: 210000,  // 1.5%
  bhtn: 180000,  // 1%
  tax: 350000,
  advance: 2000000,
  net: 12000000,
};

export default function PayslipScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Phiếu lương tháng {payslipData.month}</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Họ tên:</Text>
        <Text style={styles.value}>{payslipData.employee}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Mã NV:</Text>
        <Text style={styles.value}>{payslipData.code}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Chức vụ:</Text>
        <Text style={styles.value}>{payslipData.position}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Lương cơ bản:</Text>
        <Text style={styles.value}>{payslipData.baseSalary.toLocaleString()} đ</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Số ngày công chuẩn:</Text>
        <Text style={styles.value}>{payslipData.workingDays}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Số ngày làm thực tế:</Text>
        <Text style={styles.value}>{payslipData.actualDays}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Số giờ tăng ca:</Text>
        <Text style={styles.value}>{payslipData.overtime}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Phụ cấp:</Text>
        <Text style={styles.value}>{payslipData.allowance.toLocaleString()} đ</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Thưởng:</Text>
        <Text style={styles.value}>{payslipData.bonus.toLocaleString()} đ</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>BHXH (14%):</Text>
        <Text style={styles.value}>{payslipData.bhxh.toLocaleString()} đ</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>BHYT (1.5%):</Text>
        <Text style={styles.value}>{payslipData.bhyt.toLocaleString()} đ</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>BHTN (1%):</Text>
        <Text style={styles.value}>{payslipData.bhtn.toLocaleString()} đ</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Thuế TNCN:</Text>
        <Text style={styles.value}>{payslipData.tax.toLocaleString()} đ</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Tạm ứng:</Text>
        <Text style={styles.value}>{payslipData.advance.toLocaleString()} đ</Text>
      </View>
      <View style={styles.sectionTotal}>
        <Text style={styles.labelTotal}>Thực lãnh:</Text>
        <Text style={styles.valueTotal}>{payslipData.net.toLocaleString()} đ</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 18,
    flexGrow: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#008080',
    marginBottom: 18,
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#008080',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    color: '#555',
    fontWeight: '500',
    fontSize: 15,
  },
  value: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#008080',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  labelTotal: {
    color: '#008080',
    fontWeight: 'bold',
    fontSize: 17,
  },
  valueTotal: {
    color: '#008080',
    fontWeight: 'bold',
    fontSize: 19,
  },
});
