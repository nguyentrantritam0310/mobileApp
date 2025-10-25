import { useState, useEffect, useCallback } from 'react';
import { attendanceDataService } from '../services/attendanceDataService';

export const useAttendanceData = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceData = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (params.employeeCode && params.date) {
        data = await attendanceDataService.getAttendanceDataByEmployeeAndDate(params.employeeCode, params.date);
      } else if (params.employeeCode) {
        data = await attendanceDataService.getAttendanceDataByEmployee(params.employeeCode);
      } else if (params.startDate && params.endDate) {
        data = await attendanceDataService.getAttendanceDataByDateRange(params.startDate, params.endDate);
      } else if (params.week) {
        data = await attendanceDataService.getAttendanceDataByWeek(params.week);
      } else if (params.year && params.month) {
        data = await attendanceDataService.getAttendanceDataByMonth(params.year, params.month);
      } else {
        data = await attendanceDataService.getAllAttendanceData();
      }
      
      // Validate and clean data
      const validatedData = Array.isArray(data) ? data.filter(item => {
        // Basic validation for required fields
        return item && typeof item === 'object' && item.date;
      }) : [];
      
      setAttendanceData(validatedData);
    } catch (err) {
      console.error("Error fetching attendance data:", JSON.stringify(err, null, 2));
      setError(err.message || 'Không thể tải dữ liệu chấm công');
      setAttendanceData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const refreshAttendanceData = async (params = {}) => {
    try {
      const data = await attendanceDataService.getAllAttendanceData();
      setAttendanceData(data);
    } catch (err) {
      console.error("Error refreshing attendance data:", JSON.stringify(err, null, 2));
      setError(err.message || 'Không thể làm mới dữ liệu');
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return {
    attendanceData,
    loading,
    error,
    fetchAttendanceData,
    refreshAttendanceData,
    clearError,
  };
};
