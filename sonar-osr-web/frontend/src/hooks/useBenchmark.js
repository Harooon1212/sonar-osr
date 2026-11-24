import { useEffect, useState, useCallback } from 'react';
import { fetchBenchmarkData } from '../lib/api';

let cachedBenchmark = null;
let inflightPromise = null;

export function useBenchmark() {
  const [data, setData] = useState(cachedBenchmark);
  const [loading, setLoading] = useState(!cachedBenchmark);
  const [error, setError] = useState(null);

  const load = useCallback(async (force = false) => {
    if (cachedBenchmark && !force) {
      setData(cachedBenchmark);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!inflightPromise || force) {
        inflightPromise = fetchBenchmarkData();
      }
      const res = await inflightPromise;
      if (!res) {
        throw new Error('Could not load benchmark results (/data/results.json).');
      }
      cachedBenchmark = res;
      setData(res);
    } catch (err) {
      setError(err?.message || 'Failed to load benchmark data');
    } finally {
      inflightPromise = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  return { data, loading, error, retry: () => load(true) };
}
