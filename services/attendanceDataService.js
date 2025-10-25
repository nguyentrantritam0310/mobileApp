import api from '../api';

export const attendanceDataService = {
  // Get all attendance data
  async getAllAttendanceData() {
    try {
      const response = await api.get('/AttendanceData');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      throw error;
    }
  },

  // Get attendance data by employee code
  async getAttendanceDataByEmployee(employeeCode) {
    try {
      const response = await api.get(`/AttendanceData/employee/${employeeCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data by employee:', error);
      throw error;
    }
  },

  // Get attendance data by date range
  async getAttendanceDataByDateRange(startDate, endDate) {
    try {
      const response = await api.get('/AttendanceData/daterange', {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data by date range:', error);
      throw error;
    }
  },

  // Get attendance data by month
  async getAttendanceDataByMonth(year, month) {
    try {
      const response = await api.get('/AttendanceData/month', {
        params: {
          year: year,
          month: month
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data by month:', error);
      throw error;
    }
  },

  // Get attendance data by week
  async getAttendanceDataByWeek(weekString) {
    try {
      const response = await api.get('/AttendanceData/week', {
        params: {
          week: weekString
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data by week:', error);
      throw error;
    }
  },

  // Get attendance data by employee and specific date
  async getAttendanceDataByEmployeeAndDate(employeeCode, date) {
    try {
      const response = await api.get('/AttendanceData/employee/date', {
        params: {
          employeeCode: employeeCode,
          date: date
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data by employee and date:', error);
      throw error;
    }
  }
};
