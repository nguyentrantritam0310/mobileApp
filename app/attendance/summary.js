import React from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const fakeSummary = [
  { label: 'Mã chấm công', value: '123456' },
  { label: 'Ngày vào làm', value: '29/05/2025' },
  { label: 'Tổng ngày công chuẩn', value: '23.5' },
  { label: 'Ngày thường', value: '2' },
  { label: 'Thứ 7, Chủ Nhật', value: '1' },
  { label: 'Ngày lễ', value: '0' },
  { label: 'Ngày Tết', value: '0' },
  { label: 'Nghỉ không lương', value: '0' },
  { label: 'Phép năm', value: '0' },
  { label: 'Công tác', value: '0' },
  { label: 'Nghỉ Lễ', value: '0' },
  { label: 'Tổng ngày công', value: '7.42' },
  { label: 'Ngày đi làm', value: '7.42' },
  { label: 'Vắng không lý do', value: '0.5' },
  { label: 'Tổng giờ công', value: '19.37' },
  { label: 'Tổng ngày tăng ca nghỉ bù (ngày)', value: '0' },
  { label: 'Số phút đi trễ', value: '0' },
  { label: 'Số phút về sớm', value: '0' },
  { label: 'Số lần đi trễ', value: '0' },
  { label: 'Số lần về sớm', value: '0' },
];

export default function AttendanceSummary() {
  // State cho tháng/năm
  const [month, setMonth] = React.useState(8);
  const [year, setYear] = React.useState(2025);
  // Tìm thứ đầu tháng (0=CN, 1=T2...)
  const firstDay = new Date(year, month - 1, 1).getDay();
  // Số ngày trong tháng
  const daysInMonth = new Date(year, month, 0).getDate();
  // Tạo mảng ngày, chèn ô trống đầu tháng để căn thẳng thứ
  const calendarData = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    calendarData.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    // Demo: alternating statuses
    if (i === 5) calendarData.push({ day: i, status: 'leave', label: 'NP' });
    else if (i === 10) calendarData.push({ day: i, status: 'absent' });
    else if (i === 12) calendarData.push({ day: i, status: 'miss_checkout', checkin: '08:40' });
    else if (i === 15) calendarData.push({ day: i, status: 'miss_checkin', checkout: '17:30' });
    else if (i % 7 === 0) calendarData.push({ day: i, status: 'absent' });
    else calendarData.push({ day: i, status: 'present', checkin: '08:40', checkout: '17:30' });
  }

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(null);

  const handleDayPress = (item) => {
    setSelectedDay(item);
    setModalVisible(true);
  };

  // Dòng thứ
  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <ScrollView>
      {/* Bộ lọc tháng */}
      <View style={styles.monthFilterRow}>
        <TouchableOpacity style={styles.monthBtn} onPress={() => setMonth(m => m === 1 ? 12 : m - 1)}>
          <Icon name="chevron-left" size={22} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{month < 10 ? `0${month}` : month}/{year}</Text>
        <TouchableOpacity style={styles.monthBtn} onPress={() => setMonth(m => m === 12 ? 1 : m + 1)}>
          <Icon name="chevron-right" size={22} color="#008080" />
        </TouchableOpacity>
      </View>
      {/* Calendar grid */}
      <View style={styles.calendarWrap}>
        <Text style={styles.calendarTitle}>Bảng chấm công tháng {month}/{year}</Text>
        {/* Dòng thứ */}
        <View style={styles.weekdaysRow}>
          {weekdays.map((d, i) => (
            <Text key={i} style={[styles.weekday, i === 6 && { color: '#e53935' }]}>{d}</Text>
          ))}
        </View>
        {/* Render lịch theo từng tuần, mỗi hàng 7 ô */}
        <View style={styles.calendarGrid}>
          {Array.from({ length: Math.ceil(calendarData.length / 7) }).map((_, weekIdx) => (
            <View key={weekIdx} style={styles.calendarRow}>
              {calendarData.slice(weekIdx * 7, weekIdx * 7 + 7).map((item, idx) => {
                if (!item) return <View key={idx} style={styles.dayBox} />;
                let bg = '#e0e0e0', color = '#888', border = 'transparent', label = '';
                if (item.status === 'present') { bg = '#e8f5e9'; color = '#43a047'; border = '#43a047'; label = `${item.checkin}\n${item.checkout}`; }
                if (item.status === 'miss_checkout') { bg = '#ffebee'; color = '#e53935'; border = '#e53935'; label = `${item.checkin}\n--`; }
                if (item.status === 'miss_checkin') { bg = '#ffebee'; color = '#e53935'; border = '#e53935'; label = `--\n${item.checkout}`; }
                if (item.status === 'leave') { bg = '#e3f2fd'; color = '#1976d2'; border = '#1976d2'; label = 'NP'; }
                if (item.status === 'absent') { bg = '#f5f5f5'; color = '#bdbdbd'; border = '#bdbdbd'; label = '--'; }
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.dayBox, { backgroundColor: bg, borderColor: border }]}
                    activeOpacity={0.7}
                    onPress={() => handleDayPress(item)}
                  >
                    <Text style={[styles.dayNum, { color }]}>{item.day}</Text>
                    <Text style={[styles.dayLabel, { color }]}>{label}</Text>
                    {/* Không hiển thị icon cảnh báo/quên checkin/out hoặc nghỉ phép */}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
        {/* Chú thích màu */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#43a047' }]} /><Text style={styles.legendLabel}>Đi làm</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#e53935' }]} /><Text style={styles.legendLabel}>Quên checkin/out</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#bdbdbd' }]} /><Text style={styles.legendLabel}>Vắng</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#1976d2' }]} /><Text style={styles.legendLabel}>Nghỉ phép</Text></View>
        </View>
      </View>
      {/* Summary grid */}
      <View style={styles.summaryGrid}>
        {fakeSummary.map((item, idx) => (
          <View key={idx} style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{item.value}</Text>
            <Text style={styles.summaryLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={28} color="#008080" />
            </TouchableOpacity>
            {selectedDay && (
              <>
                <Text style={styles.modalTitle}>Chi tiết ngày {selectedDay.day}</Text>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Lịch sử chấm công</Text>
                  <View style={styles.modalCard}>
                    <View style={styles.modalCardRow}>
                      <Image source={require('../../assets/images/checkin.png')} style={styles.modalCardImg} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalCardName}>Nguyễn Trần Trí Tâm - 103.199.32.253</Text>
                        <Text style={styles.modalCardSub}>Ca hành chính - <Text style={{ color: '#43a047' }}>Đi làm</Text></Text>
                        <Text style={styles.modalCardSub}><Icon name="calendar" size={14} color="#888" /> 01/08/2025 08:40</Text>
                        <Text style={styles.modalCardSub}><Icon name="qrcode-scan" size={14} color="#888" /> Máy quét: VPQ9</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.modalCard}>
                    <View style={styles.modalCardRow}>
                      <Image source={require('../../assets/images/checkout.png')} style={styles.modalCardImg} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalCardName}>Nguyễn Trần Trí Tâm - 14.169.38.68</Text>
                        <Text style={styles.modalCardSub}>Ca hành chính - <Text style={{ color: '#43a047' }}>Đi làm</Text></Text>
                        <Text style={styles.modalCardSub}><Icon name="calendar" size={14} color="#888" /> 01/08/2025 17:45</Text>
                        <Text style={styles.modalCardSub}><Icon name="qrcode-scan" size={14} color="#888" /> Máy quét: VPQ9</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Lịch làm việc</Text>
                  <View style={styles.modalCard}>
                    <Text style={styles.modalCardName}>Nguyễn Trần Trí Tâm</Text>
                    <Text style={styles.modalCardSub}><Icon name="calendar-clock" size={14} color="#888" /> Ca hành chính (08:30 - 17:30)</Text>
                    <Text style={styles.modalCardSub}><Icon name="calendar" size={14} color="#888" /> 01/08/2025 (ngày làm)</Text>
                    <Text style={styles.modalCardSub}><Icon name="clock" size={14} color="#888" /> 8.00 (Giờ công)</Text>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                      <Text style={[styles.modalCardSub, { marginRight: 8 }]}>Vào: <Text style={{ color: '#43a047' }}>08:40</Text></Text>
                      <Text style={styles.modalCardSub}>Ra: <Text style={{ color: '#e53935' }}>17:45</Text></Text>
                    </View>
                    <Text style={styles.modalCardSub}>Quên In/out Chưa xác nhận: 0</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = {
  monthFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  monthBtn: {
    padding: 6,
    borderRadius: 8,
  },
  monthText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#008080',
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
    paddingHorizontal: 2,
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 2,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  legendLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
    marginRight: 2,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginHorizontal: 2,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: '#888',
    fontWeight: 'bold',
    fontSize: 13,
    paddingBottom: 2,
  },
  calendarWrap: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    marginBottom: 8,
    padding: 12,
    shadowColor: '#008080',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarTitle: {
    fontWeight: 'bold',
    color: '#008080',
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  calendarGrid: {
    flexDirection: 'column',
    gap: 0,
    marginHorizontal: 2,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  dayBox: {
    width: '12%',
    aspectRatio: 0.8,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
    paddingTop: 4,
    minWidth: 38,
    maxWidth: 48,
  },
  modalSection: {
    marginBottom: 18,
  },
  modalSectionTitle: {
    fontWeight: 'bold',
    color: '#008080',
    fontSize: 15,
    marginBottom: 8,
    marginTop: 2,
  },
  modalCard: {
    backgroundColor: '#f8fafd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#008080',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  modalCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  modalCardImg: {
    width: 38,
    height: 38,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  modalCardName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  modalCardSub: {
    color: '#666',
    fontSize: 13,
    marginBottom: 1,
  },
  dayNum: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  dayLabel: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 14,
    minHeight: 28,
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
    gap: 12,
  },
  summaryBox: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 6,
    shadowColor: '#008080',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0f2f1',
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#008080',
    fontSize: 18,
    marginBottom: 2,
  },
  summaryLabel: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#008080',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#008080',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalLabel: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  modalValue: {
    color: '#008080',
    fontSize: 14,
    fontWeight: '500',
  },
  modalImgRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  modalImgPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImg: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
};
