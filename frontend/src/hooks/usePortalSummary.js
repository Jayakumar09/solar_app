import { useEffect, useState } from 'react';
import portalService from '../services/portal';

export default function usePortalSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const summary = await portalService.getSummary();
        if (active) {
          setData(summary);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.error || 'Failed to load dashboard data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error, setData };
}
