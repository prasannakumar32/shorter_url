import { useState, useEffect, useCallback } from 'react';
import { urlService } from '../services/api';

export const useUrls = (search) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await urlService.getUrls(search);
      setUrls(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const createUrl = async (data) => {
    try {
      setError(null);
      await urlService.createUrl(data);
      await fetchUrls();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create URL');
      return false;
    }
  };

  const deleteUrl = async (code) => {
    try {
      setError(null);
      await urlService.deleteUrl(code);
      await fetchUrls();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete URL');
      return false;
    }
  };

  return {
    urls,
    loading,
    error,
    fetchUrls,
    createUrl,
    deleteUrl,
    clearError: () => setError(null),
  };
};
