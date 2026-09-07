import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiRequest";

export interface UseApiQueryOptions {
  endpoint: string;
  /** When false, the request is skipped. Defaults to true. */
  enabled?: boolean;
}

export interface UseApiQueryResult<TResponse> {
  data: TResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<TResponse | null>;
}

const toError = (err: unknown): Error =>
  err instanceof Error ? err : new Error("Request failed");

/**
 * Fetches data from the API on mount and when the endpoint or enabled flag changes.
 */
export function useApiQuery<TResponse>({
  endpoint,
  enabled = true,
}: UseApiQueryOptions): UseApiQueryResult<TResponse> {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<TResponse | null> => {
    if (!enabled) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await apiRequest<TResponse>("GET", endpoint);
      setData(result);

      return result;
    } catch (err) {
      const requestError = toError(err);
      setError(requestError);
      console.error(`API query failed (${endpoint}):`, requestError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
