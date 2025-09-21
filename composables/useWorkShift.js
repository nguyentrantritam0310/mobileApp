import { useState, useEffect } from 'react';
import { getWorkShifts } from '../services/workshiftService';

export const useWorkShift = () => {
  const [workShifts, setWorkShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkShifts = async () => {
      try {
        const data = await getWorkShifts();
        setWorkShifts(data);
      } catch (err) {
        console.error("Error fetching work shifts:", JSON.stringify(err, null, 2));
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkShifts();
  }, []);

  return { workShifts, loading, error };
};