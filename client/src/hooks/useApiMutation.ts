import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/apiRequest";
import { MutationMethod } from "@/types/api";

export interface UseApiMutationOptions {
  method: MutationMethod;
  endpoint: string;
  /** When false, execute() is a no-op. Defaults to true. */
  enabled?: boolean;
}

export interface UseApiMutationExecuteOptions {
  endpoint?: string;
}

export interface UseApiMutationResult<TResponse, TRequest> {
  data: TResponse | null;
  loading: boolean;
  error: Error | null;
  execute: (
    body?: TRequest,
    options?: UseApiMutationExecuteOptions,
  ) => Promise<TResponse | null>;
}

const toError = (err: unknown): Error =>
  err instanceof Error ? err : new Error("Request failed");

/**
 * Performs a write request when execute() is called.
 */
export function useApiMutation<TResponse, TRequest>({
  endpoint,
  method,
  enabled = true,
}: UseApiMutationOptions): UseApiMutationResult<TResponse, TRequest> {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      body?: TRequest,
      options?: UseApiMutationExecuteOptions,
    ): Promise<TResponse | null> => {
      if (!enabled) {
        return null;
      }

      const resolvedEndpoint = options?.endpoint ?? endpoint;

      try {
        setLoading(true);
        setError(null);

        const result = await apiRequest<TResponse, TRequest>(
          method,
          resolvedEndpoint,
          body,
        );
        setData(result);

        return result;
      } catch (err) {
        const requestError = toError(err);
        setError(requestError);
        console.error(
          `API mutation failed (${method} ${resolvedEndpoint}):`,
          requestError,
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method, enabled],
  );

  return {
    data,
    loading,
    error,
    execute,
  };
}
